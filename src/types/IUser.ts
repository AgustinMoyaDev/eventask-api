import { IBase } from '../types/IBase.js'
import { IUserDto } from './dtos/user.js'

export interface IUser extends IBase {
  firstName: string
  lastName: string
  email: string
  password: string
  profileImageURL: string
  contactsIds: string[]
  isEmailVerified?: boolean
  googleId?: string
  // optional fields after populated()
  contacts?: IUserDto[]
}
