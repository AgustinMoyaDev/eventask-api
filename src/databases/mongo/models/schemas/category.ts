import { Schema, model } from 'mongoose'

import { CategoryDoc } from '../doctypes/category.js'

const CategorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: [true, 'Name is required schema'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export const CategoryModel = model<CategoryDoc>('Category', CategorySchema)
