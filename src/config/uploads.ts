import path from 'path'
import fs from 'fs'
import express from 'express'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Path to the avatars upload directory.
 */
export const AVATARS_DIR = path.join(__dirname, '../../uploads/avatars')
/**
 * Path to the general uploads directory.
 */
export const UPLOADS_DIR = path.join(__dirname, '../../uploads')

/**
 * Ensures that the uploads/avatars directory exists.
 * If it does not, it creates it recursively.
 */
export function ensureUploadsFolders(): void {
  if (!fs.existsSync(AVATARS_DIR)) {
    fs.mkdirSync(AVATARS_DIR, { recursive: true })
  }
}

/**
 * Returns an Express static middleware for serving uploaded files.
 * @returns Middleware for /uploads route
 */
export function uploadsStaticMiddleware() {
  return express.static(UPLOADS_DIR)
}
