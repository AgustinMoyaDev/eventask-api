import { INotification } from '../../../../types/INotification.js'
import { IUser } from '../../../../types/IUser.js'

export class EmailNotificationTemplates {
  /**
   * Generate notification email template.
   * @param notification - Notification data to include
   * @param recipient - User receiving the notification
   * @param appUrl - Base URL of the application
   * @returns HTML email content with consistent styling
   */
  static notificationEmail(notification: INotification, recipient: IUser, appUrl: string): string {
    return `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
       <h2 style="color: #1976d2;">${notification.title}</h2>
       <p>Hi ${recipient.firstName},</p>
       <p>${notification.message}</p>
       ${
         notification.data?.actionUrl
           ? `
         <div style="text-align: center; margin: 20px 0;">
           <a href="${appUrl}${notification.data.actionUrl}" 
              style="background: #1976d2; color: white; padding: 12px 24px; 
                     text-decoration: none; border-radius: 4px; display: inline-block;">
             View in App
           </a>
         </div>
       `
           : ''
       }
       <p style="color: #666; font-size: 14px;">
         This notification was sent from Todo App.
       </p>
     </div>
   `
  }
}
