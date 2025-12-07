/**
 * Global type declarations for Node.js environment variables.
 *
 * This file extends the NodeJS global namespace to provide strong typing
 * for environment variables used throughout the application.
 *
 * The @typescript-eslint/no-namespace disable is necessary because extending
 * Node.js global interfaces requires the namespace syntax, which is the
 * official TypeScript recommendation for this use case.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Server port number */
      PORT: string
      /** MongoDB connection string */
      DB_CONNECTION_STRING: string
      /** JWT secret seed for token signing */
      SECRET_JWT_SEED: string
      /** Application environment mode */
      NODE_ENV: 'development' | 'production'
      /** Base application URL */
      FRONTEND_URL: string
      /** Email service provider */
      EMAIL_SERVICE: string
      /** Email service username */
      EMAIL_USER: string
      /** Email service application password */
      EMAIL_APP_PASSWORD: string
      /** Display name for email sender */
      EMAIL_FROM_NAME: string
      /** Email provider configuration */
      EMAIL_PROVIDER: string
      /** Session secret for express-session */
      SESSION_SECRET: string
    }
  }
}

export {}
