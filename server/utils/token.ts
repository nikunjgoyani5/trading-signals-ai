import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'

export type AccessTokenPayload = {
  sub: string
  email: string
  role: string
}

export type RefreshTokenPayload = {
  sub: string
  rememberMe: boolean
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options)
}

export function signRefreshToken(payload: RefreshTokenPayload, rememberMe: boolean): string {
  const options: SignOptions = {
    expiresIn: (rememberMe
      ? env.JWT_REMEMBER_REFRESH_EXPIRES_IN
      : env.JWT_REFRESH_EXPIRES_IN) as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options)
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload
}
