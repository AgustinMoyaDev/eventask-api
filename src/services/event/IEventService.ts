import { IBaseService } from '../IBaseService.js'

import { EventStatus, IEvent, IEventCalendarResult } from '../../types/IEvent.js'
import { IPaginationParams, IPaginationResult } from '../../helpers/pagination.js'

export interface IEventService extends IBaseService<
  IEvent,
  string,
  Omit<IEvent, 'id'>,
  Partial<Omit<IEvent, 'id'>>
> {
  getAllByUser(userId: string, params: IPaginationParams): Promise<IPaginationResult<IEvent>>
  /**
   * Get events for calendar view by month
   * @param userId - User ID
   * @param year - Year
   * @param month - Month (1-12)
   */
  getAllByUserAndMonth(userId: string, year: number, month: number): Promise<IEventCalendarResult>
  updateStatus(id: string, dto: { status: EventStatus }): Promise<IEvent>
  assignCollaborator(userId: string, eventId: string, collaboratorId: string): Promise<IEvent>
  removeCollaborator(userId: string, eventId: string, collaboratorId: string): Promise<IEvent>
}
