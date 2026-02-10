import { TaskStatus } from '../../types/ITask.js'

export interface ITaskCreateDto {
  title: string
  categoryId: string
}

/**
 * DTO for updating task basic info (client-facing).
 * User can only modify title and category.
 */
export interface ITaskUpdateDto {
  title?: string
  categoryId?: string
  eventsIds?: string[]
  participantsIds?: string[]
}

/**
 * DTO for internal metadata updates (used by Event/Task services).
 * Includes computed fields and relationships.
 */
export interface ITaskMetadataUpdateDto {
  title?: string
  categoryId?: string
  participantsIds?: string[]
  eventsIds?: string[]
  beginningDate?: string
  completionDate?: string
  status?: TaskStatus
  duration?: number
  progress?: number
}
