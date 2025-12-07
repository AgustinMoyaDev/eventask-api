import { IBaseRepository } from '../../repositories/IBaseRepository.js'
import { IInvitation } from '../../types/IInvitation.js'

export interface IInvitationRepository
  extends IBaseRepository<
    IInvitation,
    string,
    Omit<IInvitation, 'id'>,
    Partial<Omit<IInvitation, 'id'>>
  > {
  // create(data: Partial<IInvitation>): Promise<IInvitation>
  findPendingByEmail(email: string): Promise<IInvitation | null>
  // findById(id: string): Promise<IInvitation | null>
  // update(id: string, data: Partial<IInvitation>): Promise<IInvitation | null>
}
