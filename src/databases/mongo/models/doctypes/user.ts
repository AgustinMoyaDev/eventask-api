import { Document } from 'mongoose'

export interface UserDoc extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  profileImageURL: string
  contactsIds: string[]
  googleId?: string
  isEmailVerified?: boolean
  hasManualPassword?: boolean
}
