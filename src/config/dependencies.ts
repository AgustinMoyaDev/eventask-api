import { UserRepository } from '../repositories/user/UserRepository.js'
import { NotificationRepository } from '../repositories/notification/NotificationRepository.js'
import { CategoryRepository } from '../repositories/category/CategoryRepository.js'
import { IUserRepository } from '../repositories/user/IUserRepository.js'
import { INotificationRepository } from '../repositories/notification/INotificationRepository.js'
import { ITaskRepository } from '../repositories/task/ITaskRepository.js'
import { TaskRepository } from '../repositories/task/TaskRepository.js'
import { IEventRepository } from '../repositories/event/IEventRepository.js'
import { EventRepository } from '../repositories/event/EventRepository.js'
import { IInvitationRepository } from '../repositories/invitation/IInvitationRepository.js'
import { InvitationRepository } from '../repositories/invitation/InvitationRepository.js'
import { ICategoryRepository } from '../repositories/category/ICategoryRepository.js'
import { ITokenRepository } from '../repositories/token/ITokenRepository.js'
import { TokenRepository } from '../repositories/token/TokenRepository.js'

import { IApplicationEventEmitter } from '../sys-events/IApplicationEventEmitter.js'
import { ApplicationEventEmitter } from '../sys-events/ApplicationEventEmitter.js'
import { NotificationEventSubscriber } from '../sys-events/subscribers/NotificationEventSubscriber.js'

import { WebSocketService } from '../services/websocket/WebSocketService.js'
import { EventNotificationScheduler } from '../services/scheduler/EventNotificationScheduler.js'

import { INotificationService } from '../services/notification/INotificationService.js'
import { IUserService } from '../services/user/IUserService.js'
import { ITaskService } from '../services/task/ITaskService.js'
import { IEventService } from '../services/event/IEventService.js'
import { ICategoryService } from '../services/category/ICategoryService.js'
import { IInvitationService } from '../services/invitation/IInvitationService.js'
import { IAuthService } from '../services/auth/IAuthService.js'

import { UserServiceImpl } from '../services/user/UserServiceImpl.js'
import { TaskServiceImpl } from '../services/task/TaskServiceImpl.js'
import { EventServiceImpl } from '../services/event/EventServiceImpl.js'
import { CategoryServiceImpl } from '../services/category/CategoryServiceImpl.js'
import { NotificationServiceImpl } from '../services/notification/NotificationServiceImpl.js'
import { InvitationServiceImpl } from '../services/invitation/InvitationServiceImpl.js'
import { AuthServiceImpl } from '../services/auth/AuthServiceImpl.js'

import { UserController } from '../controllers/user/UserController.js'
import { NotificationController } from '../controllers/notification/NotificationController.js'
import { TaskController } from '../controllers/task/TaskController.js'
import { EventController } from '../controllers/event/EventController.js'
import { InvitationController } from '../controllers/invitation/InvitationController.js'
import { CategoryController } from '../controllers/category/CategoryController.js'
import { AuthController } from '../controllers/auth/AuthControllerImpl.js'

/**
 * Dependency Injection Container - Singleton instances
 * Ensures single instances across the entire application
 */

// Event System Singletons
let notificationEventEmitter: ApplicationEventEmitter | null = null
let notificationEventSubscriber: NotificationEventSubscriber | null = null

// Repository Singletons
let userRepository: IUserRepository | null = null
let notificationRepository: INotificationRepository | null = null
let taskRepository: ITaskRepository | null = null
let eventRepository: IEventRepository | null = null
let invitationRepository: IInvitationRepository | null = null
let categoryRepository: ICategoryRepository | null = null
let tokenRepository: ITokenRepository | null = null

// Service Singletons
let notificationService: INotificationService | null = null
let userService: IUserService | null = null
let taskService: ITaskService | null = null
let eventService: IEventService | null = null
let invitationService: IInvitationService | null = null
let categoryService: ICategoryService | null = null
let authService: IAuthService | null = null
let webSocketService: WebSocketService | null = null

// Controller Singletons
let userController: UserController | null = null
let notificationController: NotificationController | null = null
let taskController: TaskController | null = null
let eventController: EventController | null = null
let invitationController: InvitationController | null = null
let categoryController: CategoryController | null = null
let authController: AuthController | null = null

/**
 * Repository Getters - Lazy initialization with Singleton pattern
 */
export function getUserRepository(): IUserRepository {
  if (!userRepository) {
    userRepository = new UserRepository()
  }
  return userRepository
}

export function getNotificationRepository(): INotificationRepository {
  if (!notificationRepository) {
    notificationRepository = new NotificationRepository()
  }
  return notificationRepository
}

export function getTaskRepository(): ITaskRepository {
  if (!taskRepository) {
    taskRepository = new TaskRepository()
  }
  return taskRepository
}

export function getEventRepository(): IEventRepository {
  if (!eventRepository) {
    eventRepository = new EventRepository()
  }
  return eventRepository
}

export function getInvitationRepository(): IInvitationRepository {
  if (!invitationRepository) {
    invitationRepository = new InvitationRepository()
  }
  return invitationRepository
}

export function getCategoryRepository(): ICategoryRepository {
  if (!categoryRepository) {
    categoryRepository = new CategoryRepository()
  }
  return categoryRepository
}

export function getTokenRepository(): ITokenRepository {
  if (!tokenRepository) {
    tokenRepository = new TokenRepository()
  }
  return tokenRepository
}

/**
 * Service Getters - Lazy initialization with dependency injection
 */
export function getUserService(): IUserService {
  if (!userService) {
    userService = new UserServiceImpl(getUserRepository())
  }
  return userService
}

export function getInvitationService(): IInvitationService {
  if (!invitationService) {
    const eventEmitter = getNotificationSystem()

    invitationService = new InvitationServiceImpl(
      getInvitationRepository(),
      getUserRepository(),
      eventEmitter
    )
  }
  return invitationService
}

export function getTaskService(): ITaskService {
  if (!taskService) {
    taskService = new TaskServiceImpl(
      getTaskRepository(),
      getEventRepository(),
      getNotificationSystem()
    )
  }
  return taskService
}

export function getEventService(): IEventService {
  if (!eventService) {
    eventService = new EventServiceImpl(
      getEventRepository(),
      getTaskRepository(),
      getUserRepository(),
      getNotificationSystem()
    )
  }
  return eventService
}

export function getCategoryService(): ICategoryService {
  if (!categoryService) {
    categoryService = new CategoryServiceImpl(getCategoryRepository())
  }
  return categoryService
}

export function getAuthService(): IAuthService {
  if (!authService) {
    authService = new AuthServiceImpl(getUserRepository(), getTokenRepository())
  }
  return authService
}

/**
 * Controller Getters - Lazy initialization with service injection
 */
export function getUserController(): UserController {
  if (!userController) {
    userController = new UserController(getUserService())
  }
  return userController
}

export function getNotificationController(): NotificationController {
  if (!notificationController) {
    notificationController = new NotificationController(getNotificationService())
  }
  return notificationController
}

export function getTaskController(): TaskController {
  if (!taskController) {
    taskController = new TaskController(getTaskService())
  }
  return taskController
}

export function getEventController(): EventController {
  if (!eventController) {
    eventController = new EventController(getEventService())
  }
  return eventController
}

export function getInvitationController(): InvitationController {
  if (!invitationController) {
    invitationController = new InvitationController(getInvitationService())
  }
  return invitationController
}

export function getCategoryController(): CategoryController {
  if (!categoryController) {
    categoryController = new CategoryController(getCategoryService())
  }
  return categoryController
}

export function getAuthController(): AuthController {
  if (!authController) {
    authController = new AuthController(getAuthService())
  }
  return authController
}

export function getWebSocketService(): WebSocketService {
  if (!webSocketService) {
    webSocketService = new WebSocketService()
  }
  return webSocketService
}

export function getNotificationService(): INotificationService {
  if (!notificationService) {
    notificationService = new NotificationServiceImpl(getNotificationRepository())
  }
  return notificationService
}

export function getNotificationSystem(): IApplicationEventEmitter {
  if (!notificationEventEmitter) {
    notificationEventEmitter = new ApplicationEventEmitter()

    // Configure event subscribers (this connects events to notifications)
    if (!notificationEventSubscriber) {
      notificationEventSubscriber = new NotificationEventSubscriber(
        notificationEventEmitter,
        getNotificationService(),
        getUserService(),
        getWebSocketService()
      )
    }
  }
  return notificationEventEmitter
}

/**
 * System Initialization Functions
 */

/**
 * Initialize notification system during application bootstrap.
 * Ensures proper setup before any services attempt to use the event system.
 */
export function initializeNotificationSystem(): void {
  console.log('🚀 Starting notification system initialization...')

  getNotificationSystem()
  EventNotificationScheduler.getInstance().start()

  console.log('✅ Notification system fully initialized and ready')
}
