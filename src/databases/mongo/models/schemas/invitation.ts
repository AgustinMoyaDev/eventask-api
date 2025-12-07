import { Schema, model } from 'mongoose'

import { InvitationDoc } from '../doctypes/invitation.js'
import { INVITATION_STATUS } from '../../../../types/IInvitation.js'

const InvitationSchema = new Schema<InvitationDoc>(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: INVITATION_STATUS,
      default: INVITATION_STATUS.PENDING,
    },
  },
  { timestamps: true }
)

export const InvitationModel = model('Invitation', InvitationSchema)
