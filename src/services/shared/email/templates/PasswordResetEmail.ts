export class ResetPasswordEmailTemplates {
  /**
   * Generates HTML and text for password reset email.
   * @param resetUrl - URL for password reset
   * @returns { subject: string, html: string, text: string }
   */
  static getPasswordResetEmail(resetUrl: string) {
    return {
      subject: 'Password Reset Request',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>
          Click <a href="${resetUrl}">here</a> to reset your password.<br>
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
      text: `Reset your password: ${resetUrl}`,
    }
  }
}
