/**
 * Email template generator for invitation system.
 * Provides HTML templates based on user registration status.
 */
export class InvitationEmailTemplates {
  /**
   * Generate invitation email for registered users.
   * @param inviterName - Name of user sending the invitation
   * @param appUrl - Base URL of the application
   * @returns HTML email content with action button
   */
  static invitationForRegisteredUser(inviterName: string, appUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">You've been invited to join Todo App!</h2>
        <p><strong>${inviterName}</strong> has sent you an invitation to connect on Todo App.</p>
        <p>Log in to the application to accept or decline this invitation:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${appUrl}/auth/login" 
             style="background: #1976d2; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            See invitations
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you can't click the button, copy and paste this link: ${appUrl}/auth/login
        </p>
      </div>
    `
  }

  /**
   * Generate invitation email for non-registered users.
   * @param inviterName - Name of user sending the invitation
   * @param appUrl - Base URL of the application
   * @returns HTML email content with registration call-to-action
   */
  static invitationForNewUser(inviterName: string, appUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">You've been invited to join Todo App!</h2>
        <p><strong>${inviterName}</strong> has invited you to join Todo App.</p>
        <p>Sign up to connect and collaborate on tasks:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${appUrl}/auth/register" 
             style="background: #1976d2; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Create an account
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you can't click the button, copy and paste this link: ${appUrl}/auth/register
        </p>
      </div>
    `
  }
}
