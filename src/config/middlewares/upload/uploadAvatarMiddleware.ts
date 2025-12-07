import { fileURLToPath } from 'url'
import path from 'path'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../../../uploads/avatars'))
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const extension = path.extname(file.originalname)
    const filename = `${timestamp}-${file.fieldname}${extension}`
    cb(null, filename)
  },
})

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG and PNG files are allowed'))
  }
  cb(null, true)
}

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter,
}).single('avatar')
