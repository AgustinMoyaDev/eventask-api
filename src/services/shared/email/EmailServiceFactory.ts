import { IEmailService } from './IEmailService.js'
import { NodemailerEmailService } from './NodemailerEmailService.js'
import { env } from '../../../config/env.js'

/**
 * Factory for creating email service instances.
 * Allows switching email providers via environment configuration.
 */
export class EmailServiceFactory {
  /**
   * Create email service instance based on environment configuration.
   * @returns Configured email service implementation
   */
  static createEmailService(): IEmailService {
    const provider = env.EMAIL_PROVIDER

    switch (provider) {
      case 'nodemailer':
        return new NodemailerEmailService()
      // Future providers can be added here:
      // case 'sendgrid': return new SendGridEmailService()
      // case 'resend': return new ResendEmailService()
      default:
        throw new Error(`Unsupported email provider: ${provider}`)
    }
  }
}
