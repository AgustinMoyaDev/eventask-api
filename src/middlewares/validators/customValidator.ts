import { CustomValidator } from 'express-validator'

export const createdAt: CustomValidator = value => {
  const date = new Date(value)

  if (isNaN(date.getTime())) {
    throw new Error('Creation date must be a valid date.')
  }
  if (date > new Date()) {
    throw new Error('Creation date cannot be in the future.')
  }
  return true
}

export const completionDate: CustomValidator = (value, { req }) => {
  const created = new Date(req.body.createdAt)
  const completed = new Date(value)
  if (isNaN(created.getTime()) || isNaN(completed.getTime())) {
    throw new Error('Invalid creation or completion date.')
  }
  if (completed < created) {
    throw new Error('Completion date cannot be before creation date.')
  }
  return true
}

export const endDate: CustomValidator = (value, { req }) => {
  const start = new Date(req.body.start)
  const end = new Date(value)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Start and end dates must be valid dates.')
  }
  if (end <= start) {
    throw new Error('End date must be after start date.')
  }
  return true
}
