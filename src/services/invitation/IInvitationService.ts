import { IBaseService } from '../../services/IBaseService.js'
import { IInvitation } from '../../types/IInvitation.js'

export interface IInvitationService
  extends IBaseService<
    IInvitation,
    string,
    Omit<IInvitation, 'id'>,
    Partial<Omit<IInvitation, 'id'>>
  > {
  /**
   * Invite a user by email to become a contact.
   * - Handles both existing and new users.
   * - Returns the created invitation.
   */
  inviteContact(userId: string, email: string): Promise<IInvitation>

  /**
   * Accept a pending invitation and create bidirectional contact relationship.
   * @param invitationId - The invitation ID to accept
   * @param userId - The ID of the user accepting the invitation
   * @returns The updated invitation with accepted status
   */
  acceptInvitation(invitationId: string, userId: string): Promise<IInvitation>

  /**
   * Reject a pending invitation.
   * @param invitationId - The invitation ID to reject
   * @param userId - The ID of the user rejecting the invitation
   * @returns The updated invitation with rejected status
   */
  rejectInvitation(invitationId: string, userId: string): Promise<IInvitation>
}
