import { Response } from 'express'

import { COOKIE_TYPE, CookieType } from '../../config/types/cookies.js'

import { IAuthService } from '../../services/auth/IAuthService.js'

import type {
  IAuthResponseDto,
  IRegisterDto,
  ILoginDto,
  IGoogleLoginDto,
  IRequestPasswordResetDto,
  IResetPasswordDto,
  ISetPasswordDto,
  IChangePasswordDto,
} from '../../types/dtos/auth.js'

import { refreshCookieOptions } from '../../config/utils/authCookie.js'

export class AuthController {
  constructor(private authService: IAuthService) {}

  private setCookie = (cookieId: CookieType, data: string, res: Response) => {
    res.cookie(cookieId, data, refreshCookieOptions)
  }

  register = async (dto: IRegisterDto, res: Response): Promise<IAuthResponseDto> => {
    const { userId, accessToken, refreshToken } = await this.authService.register(dto)
    this.setCookie(COOKIE_TYPE.REFRESH_TOKEN, refreshToken, res)
    return { userId, accessToken }
  }

  login = async (dto: ILoginDto, res: Response): Promise<IAuthResponseDto> => {
    const { userId, accessToken, refreshToken } = await this.authService.login(dto)
    this.setCookie(COOKIE_TYPE.REFRESH_TOKEN, refreshToken, res)
    return { userId, accessToken }
  }

  googleLogin = async (dto: IGoogleLoginDto, res: Response) => {
    const { userId, accessToken, refreshToken } = await this.authService.googleLogin(dto)
    this.setCookie(COOKIE_TYPE.REFRESH_TOKEN, refreshToken, res)
    return { userId, accessToken }
  }

  refresh = async (refreshToken: string): Promise<IAuthResponseDto> => {
    // validateRefreshToken has already verified signature and expiration and set req.uid
    const { accessToken, userId } = await this.authService.refreshToken(refreshToken)
    return { userId, accessToken }
  }

  logout = async (refreshToken: string, res: Response): Promise<void> => {
    await this.authService.logout(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })
  }

  requestPasswordReset = async (dto: IRequestPasswordResetDto): Promise<void> => {
    await this.authService.requestPasswordReset(dto)
  }

  resetPassword = async (dto: IResetPasswordDto): Promise<void> => {
    await this.authService.resetPassword(dto)
  }

  setPassword = async (userId: string, dto: ISetPasswordDto): Promise<void> => {
    await this.authService.setPassword(userId, dto)
  }

  changePassword = async (userId: string, dto: IChangePasswordDto): Promise<void> => {
    await this.authService.changePassword(userId, dto)
  }
}
