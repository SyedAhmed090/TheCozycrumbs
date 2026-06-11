export async function signSessionToken(token: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(token))
  return Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifySessionToken(sessionValue: string, secret: string): Promise<boolean> {
  const dotIdx = sessionValue.lastIndexOf('.')
  if (dotIdx === -1) return false
  const token = sessionValue.slice(0, dotIdx)
  const signature = sessionValue.slice(dotIdx + 1)
  if (!token || !signature) return false

  const expected = await signSessionToken(token, secret)

  if (signature.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}
