import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import { OAuth2Client } from 'google-auth-library'

import { env } from '../../config/env.js'

import { IUserRepository } from '../../repositories/user/IUserRepository.js'
import { ITokenRepository } from '../../repositories/token/ITokenRepository.js'
import { IAuthService } from './IAuthService.js'

import type {
  ILoginDto,
  IRegisterDto,
  IAuthWithRefreshTokenDto,
  IAuthResponseDto,
  IGoogleLoginDto,
  IRequestPasswordResetDto,
  IResetPasswordDto,
  ISetPasswordDto,
} from '../../types/dtos/auth.js'

import { generateJWT } from '../../config/middlewares/JWT/generateJWT.js'
import { ApiError } from '../../config/middlewares/ApiError.js'
import { TOKEN_TYPE } from '../../types/IToken.js'
import { sendPasswordResetEmail } from '../../helpers/sendPasswordResetEmail.js'

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export class AuthServiceImpl implements IAuthService {
  constructor(
    private userRepo: IUserRepository,
    private tokenRepo: ITokenRepository
  ) {}

  /**
   * Generates access and refresh tokens for a user and persists the refresh token.
   * @param user - User entity
   * @returns Auth DTO with userId, accessToken, refreshToken
   */
  private async generateAuthTokens(user: { id: string }): Promise<IAuthWithRefreshTokenDto> {
    const accessToken = await generateJWT({ uid: user.id, expiresIn: '15m' })
    const refreshToken = await generateJWT({ uid: user.id, expiresIn: '7d' })

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.tokenRepo.save({
      token: refreshToken,
      userId: user.id,
      expiresAt,
      type: TOKEN_TYPE.REFRESH,
    })

    return { userId: user.id, accessToken, refreshToken }
  }

  async register(dto: IRegisterDto): Promise<IAuthWithRefreshTokenDto> {
    const { email, firstName, lastName, password } = dto
    // email has been validated by express-validator middleware
    const existingUser = await this.userRepo.findByEmail(email)
    if (existingUser) throw new ApiError(422, 'Invalid email.')

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    const user = await this.userRepo.create({
      firstName,
      lastName,
      email,
      password: hash,
      contactsIds: [],
      profileImageURL: '',
      hasManualPassword: true,
      createdAt: new Date(),
    })

    return this.generateAuthTokens(user)
  }

  async login(dto: ILoginDto): Promise<IAuthWithRefreshTokenDto> {
    // email has been validated by express-validator middleware
    const user = await this.userRepo.findByEmail(dto.email)

    // Provide clear message for Google-only accounts
    if (user?.googleId && !user.hasManualPassword) {
      throw new ApiError(
        401,
        'This account uses Google login. Please sign in with Google or set a password first.'
      )
    }

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new ApiError(401, 'Email or password incorrect.')
    }

    return this.generateAuthTokens(user)
  }

  /**
   * Authenticates a user via Google OAuth.
   * @param dto - DTO containing Google ID token
   * @returns Auth result or error
   */
  async googleLogin(dto: IGoogleLoginDto): Promise<IAuthWithRefreshTokenDto> {
    const { idToken } = dto
    // Validate token format
    if (!idToken?.includes('.')) {
      throw new ApiError(400, 'Invalid Google ID token format')
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()

      if (!payload?.email) throw new Error('Invalid Google token')

      // Find or create user
      let user = await this.userRepo.findByEmail(payload.email)
      if (!user) {
        user = await this.userRepo.create({
          firstName: payload.given_name || payload.name || 'Google',
          lastName: payload.family_name || 'User',
          email: payload.email,
          profileImageURL: payload.picture || '',
          contactsIds: [],
          createdAt: new Date(),
          password: crypto.randomBytes(32).toString('hex'), // No password for Google-authenticated users (technical placeholder)
          googleId: payload.sub,
          isEmailVerified: true,
          hasManualPassword: false,
        })
      } else if (!user.googleId) {
        // Link existing account with Google
        await this.userRepo.update(user.id, {
          googleId: payload.sub,
          isEmailVerified: true,
        })
      }
      return this.generateAuthTokens(user)
    } catch (error) {
      console.error('Google login error:', error)

      if (error instanceof Error && error.message.includes('Token used too early')) {
        throw new ApiError(401, 'Token timing issue. Please try again.')
      }

      if (error instanceof ApiError) throw error
      throw new ApiError(401, 'Google login failed.')
    }
  }

  async refreshToken(token: string): Promise<IAuthResponseDto> {
    // 1. Verify that the token exists (stateful)
    const existing = await this.tokenRepo.find(token)
    if (!existing) throw new ApiError(401, 'Invalid refresh token.')

    // 2. Verify that the user still exists and is active
    const user = await this.userRepo.findById(existing.userId)
    if (!user) {
      // Cleanup orphaned token
      await this.tokenRepo.delete(token)
      throw new ApiError(401, 'Invalid refresh token.')
    }

    // TODO -> 3. Future: Add user status validations
    // if (!user.isActive) {
    //   await this.tokenRepo.delete(token)
    //   throw new ApiError(403, 'User account is disabled.')
    // }

    // 4. Generate new access token
    const accessToken = await generateJWT({
      uid: existing.userId,
      expiresIn: '15m',
    })

    return { userId: user.id, accessToken }
  }

  async logout(token: string): Promise<void> {
    // Delete the refresh token so it can no longer be used
    await this.tokenRepo.delete(token)
  }

  /**
   * Initiates password reset by generating a reset token and sending email.
   * @param email - User's email
   */
  async requestPasswordReset(dto: IRequestPasswordResetDto): Promise<void> {
    const { email } = dto
    const user = await this.userRepo.findByEmail(email)
    // To prevent email enumeration, do not reveal if the email exists
    if (!user) {
      throw new ApiError(400, 'Error on password reset process.')
    }

    // Generate a password reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hourInMs = 60 * 60 * 1000
    const expiresAt = new Date(Date.now() + hourInMs)

    await this.tokenRepo.save({
      token: resetToken,
      userId: user.id,
      expiresAt,
      type: TOKEN_TYPE.RESET,
    })

    await sendPasswordResetEmail(user.email, resetToken)
  }

  /**
   * Resets user's password using a valid reset token.
   * @param token - Reset token
   * @param newPassword - New password
   */
  async resetPassword(dto: IResetPasswordDto): Promise<void> {
    const { token, newPassword } = dto
    const tokenDoc = await this.tokenRepo.find(token)

    if (!tokenDoc || tokenDoc.type !== TOKEN_TYPE.RESET || tokenDoc.expiresAt < new Date()) {
      throw new ApiError(400, 'Invalid or expired reset token.')
    }

    const user = await this.userRepo.findById(tokenDoc.userId)
    // To prevent email enumeration, do not reveal if the email exists
    if (!user) {
      throw new ApiError(400, 'Error on password reset process.')
    }
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(newPassword, salt)

    await this.userRepo.update(user.id, { password: hash })
    await this.tokenRepo.delete(token)
  }

  /**
   * Sets or updates password for authenticated user.
   * Enables manual login for Google-only accounts.
   * @param userId - Authenticated user ID from JWT
   * @param dto - DTO containing new password
   */
  async setPassword(userId: string, dto: ISetPasswordDto): Promise<void> {
    const { newPassword } = dto
    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new ApiError(404, 'User not found.')
    }

    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(newPassword, salt)

    await this.userRepo.update(userId, {
      password: hash,
      hasManualPassword: true,
    })
  }
}
