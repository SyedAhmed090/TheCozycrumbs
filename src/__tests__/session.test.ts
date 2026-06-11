import { describe, it, expect } from 'vitest'
import { signSessionToken, verifySessionToken } from '@/lib/admin-session'

const SECRET = 'test-secret-password'

describe('signSessionToken', () => {
  it('returns a 64-char hex string', async () => {
    const sig = await signSessionToken('some-token', SECRET)
    expect(sig).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is deterministic for the same inputs', async () => {
    const a = await signSessionToken('token-abc', SECRET)
    const b = await signSessionToken('token-abc', SECRET)
    expect(a).toBe(b)
  })

  it('produces different output for different tokens', async () => {
    const a = await signSessionToken('token-1', SECRET)
    const b = await signSessionToken('token-2', SECRET)
    expect(a).not.toBe(b)
  })

  it('produces different output for different secrets', async () => {
    const a = await signSessionToken('same-token', 'secret-1')
    const b = await signSessionToken('same-token', 'secret-2')
    expect(a).not.toBe(b)
  })
})

describe('verifySessionToken', () => {
  it('verifies a correctly signed session value', async () => {
    const token = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const sig = await signSessionToken(token, SECRET)
    const sessionValue = `${token}.${sig}`
    expect(await verifySessionToken(sessionValue, SECRET)).toBe(true)
  })

  it('rejects a tampered token', async () => {
    const token = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const sig = await signSessionToken(token, SECRET)
    const tampered = `tampered-token.${sig}`
    expect(await verifySessionToken(tampered, SECRET)).toBe(false)
  })

  it('rejects a tampered signature', async () => {
    const token = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const sig = await signSessionToken(token, SECRET)
    const corrupted = sig.slice(0, -2) + 'ff'
    const sessionValue = `${token}.${corrupted}`
    expect(await verifySessionToken(sessionValue, SECRET)).toBe(false)
  })

  it('rejects when verified with wrong secret', async () => {
    const token = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const sig = await signSessionToken(token, SECRET)
    const sessionValue = `${token}.${sig}`
    expect(await verifySessionToken(sessionValue, 'wrong-secret')).toBe(false)
  })

  it('rejects a session value with no dot separator', async () => {
    expect(await verifySessionToken('nodotinhere', SECRET)).toBe(false)
  })

  it('rejects an empty string', async () => {
    expect(await verifySessionToken('', SECRET)).toBe(false)
  })

  it('rejects a plain-password session (old format)', async () => {
    // Old sessions stored the raw password — should fail verification
    expect(await verifySessionToken(SECRET, SECRET)).toBe(false)
  })
})
