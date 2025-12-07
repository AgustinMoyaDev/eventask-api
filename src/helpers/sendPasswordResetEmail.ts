import { ResetPasswordEmailTemplates } from '../services/shared/email/templates/PasswordResetEmail.js'
import { EmailServiceFactory } from '../services/shared/email/EmailServiceFactory.js'

/**
 * Sends a password reset email to the user.
 * @param to - User's email
 * @param token - Reset token
 */
export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const emailService = EmailServiceFactory.createEmailService()
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`
  const { subject, html, text } = ResetPasswordEmailTemplates.getPasswordResetEmail(resetUrl)

  await emailService.sendEmail({ to, subject, html, text })
}
