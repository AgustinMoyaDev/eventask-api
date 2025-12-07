import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax.js'

import { IEventDto } from '../types/dtos/event.js'
import { EVENT_STATUS } from '../types/IEvent.js'
import { TASK_STATUS, TaskMetadata } from '../types/ITask.js'

dayjs.extend(minMax)

export function computeTaskMetadata(events: IEventDto[] = []): TaskMetadata {
  const initial: TaskMetadata = {
    beginningDate: '',
    completionDate: '',
    duration: 0,
    progress: 0,
    status: TASK_STATUS.PENDING,
  }
  if (events.length === 0) return initial

  const starts = events.map(e => dayjs(e.start)).filter(d => d.isValid())
  const ends = events.map(e => dayjs(e.end)).filter(d => d.isValid())

  if (starts.length === 0 || ends.length === 0) return initial

  const minStart = dayjs.min(...starts)
  const maxEnd = dayjs.max(...ends)

  if (!minStart || !maxEnd) return initial

  const duration = events.reduce((acc, ev) => {
    const start = dayjs(ev.start)
    const end = dayjs(ev.end)
    if (start.isValid() && end.isValid()) {
      return acc + end.diff(start, 'hour', true)
    }
    return acc
  }, 0)

  const doneCount = events.filter(e => e.status === EVENT_STATUS.COMPLETED).length
  const progress = Math.round((doneCount / events.length) * 100)

  const status =
    progress === 100
      ? TASK_STATUS.COMPLETED
      : progress > 0
        ? TASK_STATUS.PROGRESS
        : TASK_STATUS.PENDING

  return {
    beginningDate: minStart.toISOString(),
    completionDate: maxEnd.toISOString(),
    duration,
    progress,
    status,
  }
}
