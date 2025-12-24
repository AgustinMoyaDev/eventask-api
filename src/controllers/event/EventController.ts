import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'
import { AuthenticatedRequest } from '../../config/types/request.js'
import { BaseControllerImpl } from '../../controllers/base/BaseControllerImpl.js'
import { IEventService } from '../../services/event/IEventService.js'
import {
  EventStatus,
  IEvent,
  IEventCalendarQueryParams,
  IEventCalendarResult,
} from '../../types/IEvent.js'

export class EventController extends BaseControllerImpl<IEvent, IEventService> {
  async getAllByUser(req: AuthenticatedRequest): Promise<IPaginationResult<IEvent>> {
    const { uid, query } = req
    const { page, perPage, sortBy, sortOrder } = query as IPaginationParams

    const params: IPaginationParams = {
      page: page ? parseInt(String(page)) : undefined,
      perPage: perPage ? parseInt(String(perPage)) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    }
    return this.service.getAllByUser(uid!, params)
  }

  async getAllByMonth(req: AuthenticatedRequest): Promise<IEventCalendarResult> {
    const { uid, query } = req
    const { year, month } = query as IEventCalendarQueryParams
    const yearValue = year ? parseInt(year) : new Date().getFullYear()
    const monthValue = month ? parseInt(month) : new Date().getMonth() + 1

    return this.service.getAllByUserAndMonth(uid!, yearValue, monthValue)
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
