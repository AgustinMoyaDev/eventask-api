import { SignOptions } from 'jsonwebtoken'

export interface JWTPayload {
  uid: string
}

export interface GenerateJWTOptions {
  uid: string
  expiresIn?: SignOptions['expiresIn']
}
