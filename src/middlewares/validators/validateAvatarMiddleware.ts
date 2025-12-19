import { Request, Response, NextFunction } from 'express'
import { access, constants } from 'fs/promises'
import path from 'path'

import { AVATARS_DIR } from '../../config/uploads.js'

/**
 * Allowed filename pattern for avatar images.
 * - Alphanumeric characters, hyphens, underscores
 * - Supported extensions: jpg, jpeg, png, gif, webp
 * - Case insensitive
 */
const ALLOWED_AVATAR_EXTENSIONS = /^[\w-]+\.(jpg|jpeg|png|gif|webp)$/i

/**
 * Middleware that validates avatar image existence.
 * If the requested avatar doesn't exist, returns 204 No Content
 * instead of a 404 error to prevent console errors in frontend.
 */
export function validateAvatarMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Only intercept requests to /avatars/* paths
  if (!req.path.startsWith('/avatars/')) {
    next()
    return
  }

  // Extract filename from path
  const filename = req.path.replace('/avatars/', '')

  // Sanitize filename: remove path traversal attempts
  const sanitizedFilename = path.basename(filename)

  // Validate filename format (alphanumeric + allowed extensions)
  if (!ALLOWED_AVATAR_EXTENSIONS.test(sanitizedFilename)) {
    res.status(204).end()
    return
  }

  const filePath = path.resolve(AVATARS_DIR, sanitizedFilename)

  // Validate that filePath is within the avatars directory (defense in depth)
  if (!filePath.startsWith(path.resolve(AVATARS_DIR) + path.sep)) {
    res.status(204).end()
    return
  }

  // Check if file exists
  access(filePath, constants.R_OK)
    .then(() => next())
    .catch(() => res.status(204).end())
}
