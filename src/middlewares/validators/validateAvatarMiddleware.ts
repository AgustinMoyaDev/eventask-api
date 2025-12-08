import { Request, Response, NextFunction } from 'express'
import { access, constants } from 'fs/promises'
import path from 'path'

import { AVATARS_DIR } from '../../config/uploads.js'

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
  const filePath = path.resolve(AVATARS_DIR, filename)

  // Validate that filePath is within the avatars directory
  if (!filePath.startsWith(path.resolve(AVATARS_DIR) + path.sep)) {
    res.status(204).end()
    return
  }

  // Check if file exists
  access(filePath, constants.R_OK)
    .then(() => next())
    .catch(() => res.status(204).end())
}
