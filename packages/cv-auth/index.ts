import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

function getSecret() {
  const secret = process.env.RENDER_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('RENDER_SECRET is required in production')
  }
  return 'development-only-secret'
}

function getEncryptionKey() {
  return createHash('sha256').update(getSecret()).digest()
}

export function signPayload(payload: any) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()])

  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString('base64url')).join('.')
}

export function verifyPayload(token: string) {
  const [encodedIv, encodedTag, encodedPayload, ...extra] = token.split('.')
  if (!encodedIv || !encodedTag || !encodedPayload || extra.length > 0) return null

  const encryptionKey = getEncryptionKey()
  let payload
  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      encryptionKey,
      Buffer.from(encodedIv, 'base64url')
    )
    decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'))
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encodedPayload, 'base64url')),
      decipher.final(),
    ])
    payload = JSON.parse(decrypted.toString('utf8'))
  } catch {
    return null
  }

  if (payload.exp && payload.exp < Date.now()) return null

  return payload
}
