import { Document, Types } from 'mongoose'

export interface CategoryDoc extends Document {
  name: string
  createdBy: Types.ObjectId
}
