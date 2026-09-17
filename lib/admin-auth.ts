export const ADMIN_SESSION_COOKIE = 'admin_session'

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return ''

  const data = new TextEncoder().encode(`hc-clinic-admin-v1:${secret}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('')
}

export async function isValidSessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false
  const expected = await createSessionToken()
  if (!expected || token.length !== expected.length) return false

  let mismatch = 0
  for (let i = 0; i < token.length; i += 1) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}
