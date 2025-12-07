import { EmailOptions, EmailResult } from '../../../types/IEmail.js'

/**
 * Email service interface for sending emails.
 * Allows switching between different email providers without changing business logic.
 */
export interface IEmailService {
  /**
   * Send an email using the configured provider.
   * @param options - Email configuration object
   * @returns Promise with operation result
   */
  sendEmail(options: EmailOptions): Promise<EmailResult>

  /**
   * Verify email service connection and configuration.
   * @returns Promise indicating if service is ready
   */
  verifyConnection(): Promise<boolean>
}
