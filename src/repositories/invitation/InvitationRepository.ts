import { IInvitation, INVITATION_STATUS } from '../../types/IInvitation.js'
import { IInvitationRepository } from './IInvitationRepository.js'

import { InvitationModel } from '../../databases/mongo/models/schemas/invitation.js'
import { MongooseRepository } from '../../repositories/MongooseRepository.js'

export class InvitationRepository
  extends MongooseRepository<
    IInvitation,
    string,
    Omit<IInvitation, 'id'>,
    Partial<Omit<IInvitation, 'id'>>
  >
  implements IInvitationRepository
{
  constructor() {
    super(InvitationModel)
  }

  async findPendingByEmail(email: string): Promise<IInvitation | null> {
    return this.model.findOne({ email, status: INVITATION_STATUS.PENDING }).exec()
  }
}
