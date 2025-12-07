export interface IBasicUserDto {
  id: string
  firstName: string
  lastName: string
  email: string
  profileImageURL: string
  createdAt: Date
  updatedAt: Date
}

export interface IUserDto extends IBasicUserDto {
  contactsIds: string[]
  contacts?: IBasicUserDto[]
}
