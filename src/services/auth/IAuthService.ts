import {
  ILoginDto,
  IRegisterDto,
  IAuthResponseDto,
  IAuthWithRefreshTokenDto,
  IGoogleLoginDto,
  IRequestPasswordResetDto,
  IResetPasswordDto,
  ISetPasswordDto,
} from '../../types/dtos/auth.js'

export interface IAuthService {
  register(dto: IRegisterDto): Promise<IAuthWithRefreshTokenDto>
  /**
   * Authenticates a user by email and password.
   * @param email - Validated and sanitized email string (checked by express-validator)
   * @param password - Validated password string
   * @returns Auth result or error
   */
  login(dto: ILoginDto): Promise<IAuthWithRefreshTokenDto>
  /**
   * Authenticates a user via Google OAuth.
   * @param dto - DTO containing Google ID token
   * @returns Auth result or error
   */
  googleLogin(dto: IGoogleLoginDto): Promise<IAuthWithRefreshTokenDto>
  refreshToken(token: string): Promise<IAuthResponseDto>
  logout(token: string): Promise<void>
  requestPasswordReset(dto: IRequestPasswordResetDto): Promise<void>
  resetPassword(dto: IResetPasswordDto): Promise<void>
  /**
   * Sets or updates password for authenticated user (enables manual login for Google-only accounts).
   * @param userId - Authenticated user ID
   * @param dto - DTO containing new password
   */
  setPassword(userId: string, dto: ISetPasswordDto): Promise<void>
}
