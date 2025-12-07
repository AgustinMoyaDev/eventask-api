import { Schema, model } from 'mongoose'

import { ITokenDoc } from '../doctypes/token.js'

const tokenSchema = new Schema<ITokenDoc>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value.getTime() > Date.now(),
        message: 'expiresAt must be a future date',
      },
    },
    type: { type: String, required: true },
  },
  { timestamps: true }
)

// TTL index para que Mongo elimine automáticamente los tokens caducados.
// Así los documentos desaparecen justo al llegar a su expiresAt
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const TokenModel = model<ITokenDoc>('Token', tokenSchema)
