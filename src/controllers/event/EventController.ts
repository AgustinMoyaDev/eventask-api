import { IPaginationOptions } from '../../config/types/pagination.js'
import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'
import { IEventService } from '../../services/event/IEventService.js'
import { EventStatus, IEvent } from '../../types/IEvent.js'

export class EventController extends BaseControllerImpl<IEvent, IEventService> {
  async getAllByUser(
    userId: string,
    query: IPaginationOptions
  ): Promise<{ items: IEvent[]; total: number }> {
    const { page = 1, perPage = 20 } = query
    return this.service.getAllByUser(userId, Number(page), Number(perPage))
  }

  async updateStatus(id: string, dto: { status: EventStatus }): Promise<IEvent> {
    return this.service.updateStatus(id, dto)
  }

  async assignCollaborator(
    userId: string,
    eventId: string,
    collaboratorId: string
  ): Promise<IEvent> {
    return this.service.assignCollaborator(userId, eventId, collaboratorId)
  }

  async removeCollaborator(
    userId: string,
    eventId: string,
    collaboratorId: string
  ): Promise<IEvent> {
    return this.service.removeCollaborator(userId, eventId, collaboratorId)
  }
}
