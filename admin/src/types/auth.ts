export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

export type LoginRequest = {
  email: string
  password: string
  rememberMe: boolean
}

export type LoginResponse = {
  user: AuthUser
  accessToken: string
  rememberMe: boolean
}
