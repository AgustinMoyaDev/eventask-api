import { IInvitation } from '../../types/IInvitation.js'
import { IInvitationService } from '../../services/invitation/IInvitationService.js'
import { AuthenticatedRequest } from '../../config/types/request.js'
import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'

export class InvitationController extends BaseControllerImpl<IInvitation, IInvitationService> {
  /**
   * Invites a user by email to become a contact.
   * @param req - Authenticated request containing email in body
   * @returns Created invitation
   */
  async inviteContact(req: AuthenticatedRequest): Promise<IInvitation> {
    const { email } = req.body
    return this.service.inviteContact(req.uid!, email)
  }

  /**
   * Accepts a pending invitation.
   * @param req - Authenticated request
   * @returns Updated invitation
   */
  async acceptInvitation(req: AuthenticatedRequest): Promise<IInvitation> {
    const { id } = req.params
    return this.service.acceptInvitation(id, req.uid!)
  }

  /**
   * Rejects a pending invitation.
   * @param req - Authenticated request
   * @returns Updated invitation
   */
  async rejectInvitation(req: AuthenticatedRequest): Promise<IInvitation> {
    const { id } = req.params
    return this.service.rejectInvitation(id, req.uid!)
  }
}
