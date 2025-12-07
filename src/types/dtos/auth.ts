export interface IGoogleLoginDto {
  idToken: string
}

export interface ILoginDto {
  email: string
  password: string
}

export interface IRegisterDto {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface IAuthResponseDto {
  userId: string
  accessToken: string
}

/**
 * Response DTO for login/register operations that includes refresh token
 * Used internally by auth service, not exposed to client
 */
export interface IAuthWithRefreshTokenDto {
  userId: string
  accessToken: string
  refreshToken: string
}

export interface IRequestPasswordResetDto {
  email: string
}

export interface IResetPasswordDto {
  token: string
  newPassword: string
}
