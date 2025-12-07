export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/', // Cookie is now valid for all backend routes
  domain: undefined, // Let browser handle domain automatically
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}
