import { IBase } from '../types/IBase.js'
import { IUserDto } from './dtos/user.js'

export interface IUser extends IBase {
  profileImageURL: string
  firstName: string
  lastName: string
  email: string
  password: string
  contactsIds: string[]
  isEmailVerified?: boolean
  hasManualPassword?: boolean
  googleId?: string
}

export interface IUserPopulated extends IUser {
  contacts: IUserDto[]
}
