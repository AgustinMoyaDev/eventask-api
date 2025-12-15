import { IBaseService } from '../IBaseService.js'

import { EventStatus, IEvent } from '../../types/IEvent.js'

export interface IEventService extends IBaseService<
  IEvent,
  string,
  Omit<IEvent, 'id'>,
  Partial<Omit<IEvent, 'id'>>
> {
  updateStatus(id: string, dto: { status: EventStatus }): Promise<IEvent>
  getAllByUser(
    userId: string,
    page?: number,
    perPage?: number
  ): Promise<{ items: IEvent[]; total: number }>
  updateStatus(id: string, dto: { status: EventStatus }): Promise<IEvent>
  assignCollaborator(userId: string, eventId: string, collaboratorId: string): Promise<IEvent>
  removeCollaborator(userId: string, eventId: string, collaboratorId: string): Promise<IEvent>
}
