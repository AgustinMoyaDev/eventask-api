import { IBase } from '../types/IBase.js'

export interface ICategory extends IBase {
  name: string
  createdBy: string
}

/**
 * Category with count of associated tasks.
 * Used for analytics and category usage statistics.
 */
export interface ICategoryWithTaskCount extends ICategory {
  taskCount: number
}
