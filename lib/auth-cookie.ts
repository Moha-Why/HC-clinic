export const ACCESS_TOKEN_COOKIE = 'accessToken'

export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7

export function accessTokenCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  }
}
