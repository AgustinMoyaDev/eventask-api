export const COOKIE_TYPE = {
  REFRESH_TOKEN: 'refreshToken',
} as const

export type CookieType = (typeof COOKIE_TYPE)[keyof typeof COOKIE_TYPE]
