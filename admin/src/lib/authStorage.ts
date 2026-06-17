const ACCESS_TOKEN_SESSION = 'tsai.accessToken'
const ACCESS_TOKEN_LOCAL = 'tsai.accessToken.remember'
const REMEMBERED_EMAIL_KEY = 'tsai.rememberedEmail'
const REMEMBERED_PASSWORD_KEY = 'tsai.rememberedPassword'
const REMEMBER_SECRET = 'tsai.remember.credentials.v1'
const REMEMBER_SALT = 'tsai.remember.salt.v1'

type EncryptedPayload = {
  iv: string
  data: string
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function getRememberKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(REMEMBER_SECRET),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(REMEMBER_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    secretKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

async function encryptRememberedPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await getRememberKey()
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(password),
  )

  const payload: EncryptedPayload = {
    iv: encodeBase64(iv),
    data: encodeBase64(new Uint8Array(encryptedBuffer)),
  }

  return JSON.stringify(payload)
}

async function decryptRememberedPassword(payloadText: string): Promise<string | null> {
  try {
    const payload = JSON.parse(payloadText) as EncryptedPayload
    if (!payload?.iv || !payload?.data) {
      return null
    }

    const key = await getRememberKey()
    const iv = new Uint8Array(decodeBase64(payload.iv))
    const data = new Uint8Array(decodeBase64(payload.data))
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data,
    )

    return new TextDecoder().decode(decryptedBuffer)
  } catch {
    return null
  }
}

export function setAccessToken(token: string, rememberMe: boolean) {
  clearAccessToken()
  if (rememberMe) {
    localStorage.setItem(ACCESS_TOKEN_LOCAL, token)
  } else {
    sessionStorage.setItem(ACCESS_TOKEN_SESSION, token)
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_LOCAL) ?? sessionStorage.getItem(ACCESS_TOKEN_SESSION)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_LOCAL)
  sessionStorage.removeItem(ACCESS_TOKEN_SESSION)
}

export function setRememberedEmail(email: string) {
  localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
}

export function getRememberedEmail(): string | null {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY)
}

export function clearRememberedEmail() {
  localStorage.removeItem(REMEMBERED_EMAIL_KEY)
}

export async function setRememberedPassword(password: string) {
  localStorage.setItem(REMEMBERED_PASSWORD_KEY, await encryptRememberedPassword(password))
}

export async function getRememberedPassword(): Promise<string | null> {
  const stored = localStorage.getItem(REMEMBERED_PASSWORD_KEY)
  if (!stored) {
    return null
  }

  return decryptRememberedPassword(stored)
}

export function clearRememberedPassword() {
  localStorage.removeItem(REMEMBERED_PASSWORD_KEY)
}

export async function setRememberedCredentials(email: string, password: string) {
  setRememberedEmail(email)
  await setRememberedPassword(password)
}

export async function getRememberedCredentials(): Promise<{
  email: string | null
  password: string | null
}> {
  const [email, password] = await Promise.all([getRememberedEmail(), getRememberedPassword()])

  return { email, password }
}

export function clearRememberedCredentials() {
  clearRememberedEmail()
  clearRememberedPassword()
}
