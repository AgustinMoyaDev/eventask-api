import { Schema, Types } from 'mongoose'

export const cleanOutput = (schema: Schema): void => {
  const options = {
    // 1. Include virtual (task, creator, etc.) in each conversion
    virtuals: true,
    // 2. Delete __v
    versionKey: false,
    // 3. Apply getters (in case any custom getter is defined)
    getters: true,
    // 4. Transform to rename _id → id
    transform(_doc: unknown, ret: Record<string, unknown>) {
      // a) Convert _id to id (as string)
      if ('_id' in ret) {
        ret.id = (ret._id as Types.ObjectId).toString()
        delete ret._id
      }
      // b) Convert any ObjectId fields (single or arrays) to strings
      for (const [key, val] of Object.entries(ret)) {
        // Date fields
        if (val instanceof Date) {
          ret[key] = val.toISOString()
        }
        // Array of ObjectId
        if (
          Array.isArray(val) &&
          val.length > 0 &&
          val.every(item => item instanceof Types.ObjectId)
        ) {
          ret[key] = (val as Types.ObjectId[]).map(v => v.toString())
        }
        // Unique ObjectId
        else if (val instanceof Types.ObjectId) {
          ret[key] = val.toString()
        }
      }
      /**
       * Remove sensitive fields from output.
       * Add any other fields that should never be sent to the client.
       */
      delete ret.password
      return ret
    },
  }

  schema.set('toJSON', options)
  schema.set('toObject', options)
}
