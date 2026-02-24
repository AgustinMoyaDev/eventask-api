import { TaskStatus } from '../../types/ITask.js'

export interface ITaskCreateDto {
  title: string
  categoryId: string
}

/**
 * DTO for client-facing task updates (PATCH /tasks/:id).
 * Only basic fields editable by the user.
 */
export interface ITaskUpdateDto {
  title?: string
  categoryId?: string
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
  beginningDate?: Date
  completionDate?: Date
  status?: TaskStatus
  duration?: number
  progress?: number
}
