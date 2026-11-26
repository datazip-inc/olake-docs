// Signatures made with a shared secret (HMAC-SHA256, as hex).

const bytes = (text: string) => new TextEncoder().encode(text)
const key = (secret: string) =>
  crypto.subtle.importKey('raw', bytes(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify'
  ])

export async function sign(secret: string, text: string): Promise<string> {
  const signature = await crypto.subtle.sign('HMAC', await key(secret), bytes(text))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}

/** Whether `signature` is the signature of `text`. The comparison takes the same time either way. */
export async function isSignatureOf(
  secret: string,
  text: string,
  signature: string
): Promise<boolean> {
  const pairs = /^(?:[0-9a-f]{2})+$/.test(signature) ? signature.match(/../g) : null
  if (!pairs) return false
  return crypto.subtle.verify(
    'HMAC',
    await key(secret),
    Uint8Array.from(pairs, (pair) => parseInt(pair, 16)),
    bytes(text)
  )
}
