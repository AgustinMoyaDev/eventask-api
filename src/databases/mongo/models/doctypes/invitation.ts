import { Types } from 'mongoose'
import { InvitationStatus } from '../../../../types/IInvitation.js'

export interface InvitationDoc {
  from: Types.ObjectId
  to?: Types.ObjectId
  email: string
  status: InvitationStatus
  createdAt: Date
  updatedAt: Date
}
