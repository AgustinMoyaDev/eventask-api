import { IBaseService } from '../IBaseService.js'

import { EventStatus, IEvent, IEventCalendarResult } from '../../types/IEvent.js'
import { ICreateEventDto, IUpdateEventDto } from '../../types/dtos/event.js'
import { IPaginationOptions, IPaginationResult } from '../../helpers/pagination.js'

export interface IEventService extends IBaseService<
  IEvent,
  string,
  Omit<IEvent, 'id'>,
  Partial<Omit<IEvent, 'id'>>
> {
  getAllByUser(userId: string, params: IPaginationOptions): Promise<IPaginationResult<IEvent>>
  /**
   * Get events for calendar view by month
   * @param userId - User ID
   * @param year - Year
   * @param month - Month (1-12)
   */
  getAllByUserAndMonth(userId: string, year: number, month: number): Promise<IEventCalendarResult>
  /**
   * Creates an event with the authenticated user as creator.
   * @param dto - Event creation data (without createdBy)
   * @param userId - ID of the user creating the event
   */
  createEvent(dto: ICreateEventDto, userId: string): Promise<IEvent>
  updateEvent(dto: IUpdateEventDto, userId: string): Promise<IEvent>
  updateStatus(id: string, dto: { status: EventStatus }): Promise<IEvent>
  assignCollaborator(userId: string, eventId: string, collaboratorId: string): Promise<IEvent>
  removeCollaborator(userId: string, eventId: string, collaboratorId: string): Promise<IEvent>
}
