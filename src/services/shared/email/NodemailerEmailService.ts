import nodemailer, { Transporter } from 'nodemailer'

import { EmailOptions, EmailResult } from '../../../types/IEmail.js'
import { IEmailService } from './IEmailService.js'

import { env } from '../../../config/env.js'

/**
 * Nodemailer implementation of email service.
 * Handles email sending via SMTP (Gmail, Outlook, etc.).
 */
export class NodemailerEmailService implements IEmailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: env.EMAIL_SERVICE,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_APP_PASSWORD,
      },
    })
  }

  /**
   * Send email using Nodemailer transporter.
   * @param options - Email configuration
   * @returns Result with success status and message ID
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      return {
        success: true,
        messageId: info.messageId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error',
      }
    }
  }

  /**
   * Verify SMTP connection is working.
   * @returns True if connection is successful
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      return true
    } catch {
      return false
    }
  }
}
