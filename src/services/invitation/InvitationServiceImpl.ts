import { IUserRepository } from '../../repositories/user/IUserRepository.js'
import { IInvitationRepository } from '../../repositories/invitation/IInvitationRepository.js'

import { BaseServiceImpl } from '../../services/BaseServiceImpl.js'
import { IInvitationService } from './IInvitationService.js'

import { IApplicationEventEmitter } from '../../sys-events/IApplicationEventEmitter.js'

import { EmailServiceFactory } from '../../services/shared/email/EmailServiceFactory.js'
import { InvitationEmailTemplates } from '../../services/shared/email/templates/InvitationEmailTemplates.js'

import { IInvitation, INVITATION_STATUS } from '../../types/IInvitation.js'
import {
  EVENT_NAMES,
  InvitationAcceptedEvent,
  InvitationRejectedEvent,
  InvitationSentEvent,
} from '../../sys-events/types/sys-events.js'

import { env } from '../../config/env.js'
import { ApiError } from '../../config/middlewares/ApiError.js'

export class InvitationServiceImpl
  extends BaseServiceImpl<
    IInvitation,
    string,
    Omit<IInvitation, 'id'>,
    Partial<Omit<IInvitation, 'id'>>
  >
  implements IInvitationService
{
  protected resourceName: string = 'Invitation'

  constructor(
    private readonly invitationRepository: IInvitationRepository,
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: IApplicationEventEmitter
  ) {
    super(invitationRepository)
  }

  /**
   * Send invitation email based on user registration status.
   * @param inviterName - Name of user sending the invitation
   * @param targetEmail - Email address of invited user
   * @param isRegisteredUser - Whether target user is already registered
   */
  private async sendInvitationEmail(
    inviterName: string,
    targetEmail: string,
    isRegisteredUser: boolean
  ): Promise<void> {
    try {
      const emailService = EmailServiceFactory.createEmailService()
      const frontendUrl = env.FRONTEND_URL

      const template = isRegisteredUser
        ? InvitationEmailTemplates.invitationForRegisteredUser(inviterName, frontendUrl)
        : InvitationEmailTemplates.invitationForNewUser(inviterName, frontendUrl)

      const subject = isRegisteredUser
        ? `${inviterName} has sent you an invitation in Todo App`
        : `${inviterName} has invited you to join Todo App`

      await emailService.sendEmail({
        to: targetEmail,
        subject,
        html: template,
      })
    } catch (error) {
      // Log error but don't fail the invitation creation
      console.error('### Failed to send invitation email:', error)
    }
  }

  /**
   * Invite a user by email to become a contact.
   * Handles both flows (existing user or new).
   */
  async inviteContact(userId: string, email: string): Promise<IInvitation> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new ApiError(404, 'User not found')
    if (user.email === email) throw new ApiError(400, 'Cannot invite yourself')

    // Check existing invitation
    const existingInvitation = await this.invitationRepository.findPendingByEmail(email)
    if (existingInvitation) throw new ApiError(409, 'Invitation already pending')

    // Check if the invited user already exists and is in contacts
    const invitedUser = await this.userRepository.findByEmail(email)
    if (invitedUser && user.contactsIds.includes(invitedUser.id)) {
      throw new ApiError(409, 'User is already in your contacts')
    }

    // Check if the user already exists
    const to = invitedUser ? invitedUser.id : undefined

    await this.sendInvitationEmail(user.firstName, email, !!to)

    // Create invitation
    const now = new Date()
    const invitation = await this.invitationRepository.create({
      from: userId,
      to,
      email,
      status: INVITATION_STATUS.PENDING,
      createdAt: now,
      updatedAt: now,
    })

    // Emit invitation sent event for notification system
    this.eventEmitter.emit<InvitationSentEvent>(EVENT_NAMES.INVITATION_SENT, {
      invitationId: invitation.id,
      invitationStatus: INVITATION_STATUS.PENDING,
      from: userId,
      to: invitedUser?.id,
      email,
      timestamp: new Date(),
      sentBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    return invitation
  }

  /**
   * Accept a pending invitation and create bidirectional contact relationship.
   * @param invitationId - The invitation ID to accept
   * @param userId - The ID of the user accepting the invitation
   * @returns The updated invitation with accepted status
   */
  async acceptInvitation(invitationId: string, userId: string): Promise<IInvitation> {
    const invitation = await this.invitationRepository.findById(invitationId)
    if (!invitation) throw new ApiError(404, 'Invitation not found')

    if (invitation.status !== INVITATION_STATUS.PENDING) {
      throw new ApiError(400, 'Invitation is not pending')
    }

    // Validate authorization (user accepting must be the target)
    const acceptingUser = await this.userRepository.findById(userId)
    if (!acceptingUser) throw new ApiError(404, 'User not found')

    if (acceptingUser.email !== invitation.email) {
      throw new ApiError(403, 'Not authorized to accept this invitation')
    }

    // Create bidirectional contact relationship
    const inviter = await this.userRepository.findById(invitation.from)

    if (!inviter) {
      throw new ApiError(404, 'Inviter user not found - cannot complete invitation')
    }

    // Add accepting user to inviter's contacts
    await this.userRepository.update(invitation.from, {
      contactsIds: [...(inviter.contactsIds || []), userId],
      updatedAt: new Date(),
    })

    // Add inviter to accepting user's contacts
    await this.userRepository.update(userId, {
      contactsIds: [...(acceptingUser.contactsIds || []), invitation.from],
      updatedAt: new Date(),
    })

    // Update invitation status
    const updatedInvitation = await this.invitationRepository.update(invitationId, {
      status: INVITATION_STATUS.ACCEPTED,
      to: userId,
      updatedAt: new Date(),
    })

    if (!updatedInvitation) throw new ApiError(500, 'Failed to update invitation')

    // Wait for notification processing to complete before responding
    await this.eventEmitter.emit<InvitationAcceptedEvent>(EVENT_NAMES.INVITATION_ACCEPTED, {
      invitationId,
      invitationStatus: INVITATION_STATUS.ACCEPTED,
      from: invitation.from,
      to: userId,
      timestamp: new Date(),
      acceptedBy: {
        id: acceptingUser.id,
        firstName: acceptingUser.firstName,
        lastName: acceptingUser.lastName,
      },
    })

    return updatedInvitation
  }

  /**
   * Reject a pending invitation.
   * @param invitationId - The invitation ID to reject
   * @param userId - The ID of the user rejecting the invitation
   * @returns The updated invitation with rejected status
   */
  async rejectInvitation(invitationId: string, userId: string): Promise<IInvitation> {
    // Find invitation
    const invitation = await this.invitationRepository.findById(invitationId)
    if (!invitation) throw new ApiError(404, 'Invitation not found')

    // Validate invitation status
    if (invitation.status !== INVITATION_STATUS.PENDING) {
      throw new ApiError(400, 'Invitation is not pending')
    }

    // Validate authorization (user rejecting must be the target)
    const rejectingUser = await this.userRepository.findById(userId)
    if (!rejectingUser) throw new ApiError(404, 'User not found')

    if (rejectingUser.email !== invitation.email) {
      throw new ApiError(403, 'Not authorized to reject this invitation')
    }

    // Update invitation status
    const updatedInvitation = await this.invitationRepository.update(invitationId, {
      status: INVITATION_STATUS.REJECTED,
      updatedAt: new Date(),
    })

    if (!updatedInvitation) throw new ApiError(500, 'Failed to update invitation')

    // Wait for notification processing to complete before responding
    await this.eventEmitter.emit<InvitationRejectedEvent>(EVENT_NAMES.INVITATION_REJECTED, {
      invitationId,
      invitationStatus: INVITATION_STATUS.REJECTED,
      from: invitation.from,
      to: userId,
      timestamp: new Date(),
      rejectedBy: {
        id: rejectingUser.id,
        firstName: rejectingUser.firstName,
        lastName: rejectingUser.lastName,
      },
    })

    return updatedInvitation
  }
}
