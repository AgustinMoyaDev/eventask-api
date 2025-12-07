import { Schema, model } from 'mongoose'

import { UserDoc } from '../doctypes/user.js'

const UserSchema = new Schema<UserDoc>(
  {
    profileImageURL: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      required: [true, 'First name is required schema'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required schema'],
    },
    email: {
      type: String,
      required: [true, 'Email is required schema'],
    },
    password: {
      type: String,
      required: [true, 'Password is required schema'],
    },
    contactsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    googleId: {
      type: String,
      required: false,
      // To allow multiple users without googleId
      sparse: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.virtual('contacts', {
  ref: 'User',
  localField: 'contactsIds',
  foreignField: '_id',
  justOne: false,
})

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ contactsIds: 1 })

export const UserModel = model<UserDoc>('User', UserSchema)
