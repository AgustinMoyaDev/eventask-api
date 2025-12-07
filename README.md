# 🎯 EvenTask API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**RESTful API with real-time WebSocket notifications and event-driven architecture**

[Features](#-key-features) • [Installation](#-installation--setup) • [Architecture](#️-architecture) • [Security](#-security)

</div>

---

## 📖 Overview

**EvenTask API** is a modern backend application built with **Node.js**, **TypeScript**, **Express**, and **MongoDB** following **Clean Architecture** principles. It provides a robust RESTful API for collaborative task management with real-time notifications via WebSocket and an event-driven architecture for loose coupling between services.

### 🎯 Core Concept: Event-Based Tasks

The API manages **Tasks** composed of multiple **Events** (time-boxed work sessions), enforcing an 8-hour maximum workday constraint. Each task automatically calculates metadata (duration, progress, status) based on its events.

### 🏗️ Architecture Highlights

- **Layered Architecture**: Controllers → Services → Repositories → Models
- **Dependency Injection Container**: Centralized singleton management for testability
- **Event-Driven Design**: Domain events decouple services via Observer pattern
- **Real-Time Communication**: Socket.io with JWT authentication
- **Automated Scheduling**: Node-cron for event reminder notifications

---

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based authentication**: Access tokens (15 min) + Refresh tokens (7 days)
- **Refresh token persistence**: Stored in MongoDB with automatic rotation
- **Google OAuth 2.0**: Social login integration with google-auth-library
- **Password reset flow**: One-time tokens sent via email (nodemailer)
- **CSRF protection**: Double-submit cookie pattern with Lusca
- **Rate limiting**: 500 requests per 15 minutes per IP
- **bcrypt hashing**: Secure password storage with salt rounds
- **HTTP-only cookies**: Secure, SameSite cookies for refresh tokens

### 📋 Task & Event Management
- **Atomic transactions**: MongoDB sessions ensure task + events created/updated together
- **Automatic metadata calculation**: `beginningDate`, `completionDate`, `duration`, `progress`, `status`
- **Event synchronization**: Create new, update existing, delete obsolete events in single operation
- **8-hour workday constraint**: Tasks limited to standard workday duration
- **Status tracking**: Pending → In Progress → Completed based on event completion
- **Category organization**: Group tasks by custom categories

### 👥 Collaboration
- **Invitation system**: Send/accept/reject contact invitations
- **Participant assignment**: Assign collaborators to tasks and specific events
- **Contact management**: User network for collaboration
- **Real-time updates**: Instant notifications for all collaborators

### 🔔 Real-Time Notifications
- **WebSocket with Socket.io**: Bidirectional communication with JWT authentication
- **User-specific rooms**: `user:${userId}` for targeted message delivery
- **Notification persistence**: All notifications stored in MongoDB
- **Multi-type notifications**: Task, Event, Invitation, System
- **Read/unread tracking**: Mark notifications as read
- **Event-driven creation**: Automatically generated from domain events

### 📅 Event Notification Scheduler
- **Automated reminders**: Cron job runs every minute to check upcoming events
- **10-minute advance warning**: Notifies participants when events start in ≤10 minutes
- **Multi-recipient delivery**: Alerts all collaborators + task creator
- **Duplicate prevention**: Tracks `lastNotificationSent` to avoid repeat notifications

### 🎭 Event-Driven Architecture
- **ApplicationEventEmitter**: Custom Observer pattern implementation
- **Domain events**: `invitation:accepted`, `task:assigned`, `event:created`, etc.
- **NotificationEventSubscriber**: Listens to domain events and creates notifications
- **Loose coupling**: Services communicate via events, not direct dependencies
- **Async event handling**: Parallel execution with Promise.allSettled

### 📧 Email System
- **Factory pattern**: Easy switching between email providers (Nodemailer, SendGrid, Resend)
- **HTML templates**: Professional password reset emails
- **Environment-driven**: Configure provider via `EMAIL_PROVIDER` env var
- **Extensible design**: Add new providers by implementing `IEmailService`

### 📤 File Upload
- **Avatar uploads**: Multer middleware for profile pictures
- **Validation**: Only JPEG/PNG, max 1MB
- **Secure storage**: Files stored in `/uploads/avatars` with timestamp naming
- **CORS-enabled serving**: Static file middleware with cross-origin support

### 🛡️ Input Validation
- **express-validator**: Comprehensive request validation on all endpoints
- **Custom validators**: MongoDB ID validation, email format, password strength
- **Centralized error aggregation**: `validationFieldsResult` middleware
- **Type-safe DTOs**: TypeScript interfaces for all request/response payloads

### 🗄️ Database Features
- **Mongoose plugins**: `cleanOutput` (sanitization), `mongoose-lean-virtuals`, `mongoose-lean-id`
- **Virtual fields**: `task.creator`, `task.participants`, `task.events`, `user.contacts`
- **Automatic sanitization**: Transform `_id` → `id`, remove `__v` and `password`
- **ObjectId to string conversion**: All IDs returned as strings for frontend compatibility
- **Indexes**: Optimized queries on `email`, `createdBy`, `categoryId`, `contactsIds`
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields

### 🔧 Developer Experience
- **TypeScript strict mode**: Full type safety across entire codebase
- **ESLint + Prettier**: Automated code quality and formatting
- **Hot reload**: tsx + nodemon for instant development feedback
- **Centralized error handling**: `ApiError` class with status codes and validation errors
- **HTTP logging**: Morgan middleware for request/response tracking
- **Environment validation**: Startup checks for required env variables

### 🚀 CI/CD
- **GitHub Actions**: Automated lint, typecheck, and build on push/PR
- **pnpm caching**: Faster CI builds with store path caching
- **Build artifacts**: Upload dist/ folder for deployment
- **Frozen lockfile**: Ensures consistent dependencies across environments

---

## 🛠️ Tech Stack

### Core

| Technology     | Version | Purpose                                   |
| -------------- | ------- | ----------------------------------------- |
| **Node.js**    | ≥18.0.0 | JavaScript runtime for server-side code   |
| **TypeScript** | 5.8.3   | Type-safe development with strict mode    |
| **Express**    | 5.1.0   | Web framework for RESTful API             |
| **MongoDB**    | 8.18.1  | NoSQL database for flexible data modeling |
| **Mongoose**   | 8.18.1  | ODM for MongoDB with schema validation    |

### Authentication & Security

| Technology              | Version | Purpose                                |
| ----------------------- | ------- | -------------------------------------- |
| **jsonwebtoken**        | 9.0.2   | JWT token generation and verification  |
| **bcryptjs**            | 3.0.2   | Password hashing with salt             |
| **google-auth-library** | 10.3.1  | Google OAuth 2.0 integration           |
| **lusca**               | 1.7.0   | CSRF protection middleware             |
| **express-session**     | 1.18.2  | Session management                     |
| **connect-mongo**       | 5.1.0   | MongoDB session store                  |
| **cookie-parser**       | 1.4.7   | Parse cookies from request headers     |
| **express-rate-limit**  | 8.1.0   | Rate limiting middleware (500 req/15m) |
| **cors**                | 2.8.5   | Cross-Origin Resource Sharing          |

### Real-Time & Scheduling

| Technology    | Version | Purpose                                    |
| ------------- | ------- | ------------------------------------------ |
| **socket.io** | 4.7.5   | WebSocket server for real-time events      |
| **node-cron** | 4.2.1   | Cron-based task scheduler for notification |

### Validation & Processing

| Technology            | Version | Purpose                                   |
| --------------------- | ------- | ----------------------------------------- |
| **express-validator** | 7.2.1   | Request validation middleware             |
| **multer**            | 2.0.2   | Multipart/form-data for file uploads      |
| **dayjs**             | 1.11.13 | Lightweight date manipulation and parsing |

### Email

| Technology     | Version | Purpose                            |
| -------------- | ------- | ---------------------------------- |
| **nodemailer** | 7.0.5   | Send emails (password reset, etc.) |

### Mongoose Plugins

| Technology                 | Version | Purpose                                      |
| -------------------------- | ------- | -------------------------------------------- |
| **mongoose-lean-id**       | 1.0.0   | Transform `_id` to `id` in lean queries      |
| **mongoose-lean-virtuals** | 2.0.0   | Include virtual fields in lean query results |

### Development & DevOps

| Technology  | Version | Purpose                                    |
| ----------- | ------- | ------------------------------------------ |
| **pnpm**    | 10.x    | Fast, disk-efficient package manager       |
| **tsx**     | 4.19.4  | TypeScript execution engine for dev server |
| **nodemon** | 3.1.10  | Auto-restart server on file changes        |
| **rimraf**  | 6.0.1   | Cross-platform `rm -rf` for clean builds   |

### Code Quality

| Technology                           | Version | Purpose                           |
| ------------------------------------ | ------- | --------------------------------- |
| **ESLint**                           | 9.26.0  | JavaScript/TypeScript linting     |
| **Prettier**                         | 3.6.2   | Code formatting                   |
| **@typescript-eslint/parser**        | 8.43.0  | ESLint parser for TypeScript      |
| **@typescript-eslint/eslint-plugin** | 8.32.0  | TypeScript-specific linting rules |
| **eslint-plugin-prettier**           | 5.4.0   | Run Prettier as ESLint rule       |
| **eslint-config-prettier**           | 10.1.8  | Disable conflicting ESLint rules  |

### Logging

| Technology | Version | Purpose                        |
| ---------- | ------- | ------------------------------ |
| **morgan** | 1.10.1  | HTTP request logger middleware |

### Configuration

| Technology | Version | Purpose                    |
| ---------- | ------- | -------------------------- |
| **dotenv** | 16.5.0  | Load environment variables |

---

## 🏗️ Architecture

### Layered Architecture Pattern

EvenTask API follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│  HTTP Request → Express Routes                                   │
│  - JWT validation middleware                                     │
│  - express-validator rules                                       │
│  - CSRF token verification                                       │
└──────────────────┬──────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│  Controllers (Presentation Layer)                                │
│  - AuthController, TaskController, EventController, etc.         │
│  - toHandler() adapter for Express integration                   │
│  - Validation result aggregation                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│  Services (Business Logic Layer)                                 │
│  - TaskService, EventService, NotificationService, etc.          │
│  - Domain logic (metadata calculation, event sync)               │
│  - Emit domain events via ApplicationEventEmitter                │
│  - MongoDB transactions for atomic operations                    │
└──────────────────┬──────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│  Repositories (Data Access Layer)                                │
│  - MongooseRepository base class                                 │
│  - TaskRepository, UserRepository, EventRepository, etc.         │
│  - CRUD operations with type safety                              │
│  - Session management for transactions                           │
└──────────────────┬──────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────────┐
│  Database (MongoDB with Mongoose)                                │
│  - Schemas with virtuals and indexes                             │
│  - cleanOutput plugin (sanitization)                             │
│  - Automatic _id → id transformation                             │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Injection Container

Located in `src/config/dependencies.ts` (295 lines), the DI container manages all application dependencies:

**Key Features:**
- **Singleton Pattern**: Single instance of each Repository, Service, Controller
- **Lazy Initialization**: Instances created only when first requested
- **Centralized Management**: Easy testing and dependency swapping
- **Type Safety**: Full TypeScript support with interfaces

**Example:**
```typescript
// Repository layer
export function getTaskRepository(): ITaskRepository {
  if (!taskRepository) {
    taskRepository = new TaskRepository()
  }
  return taskRepository
}

// Service layer with dependencies
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

// Controller layer
export function getTaskController(): TaskController {
  if (!taskController) {
    taskController = new TaskController(getTaskService())
  }
  return taskController
}
```

### Event-Driven Architecture

**ApplicationEventEmitter** implements the Observer pattern for loose coupling:

```typescript
// Service emits domain event
await eventEmitter.emit<TaskAssignedEvent>(EVENT_NAMES.TASK_ASSIGNED, {
  taskId: task.id,
  participantIds: newParticipants,
  assignedBy: userId,
})

// NotificationEventSubscriber listens and reacts
eventEmitter.on<TaskAssignedEvent>(
  EVENT_NAMES.TASK_ASSIGNED,
  async (data) => {
    // Create notifications for each participant
    // Send real-time WebSocket message
    // No direct coupling between services
  }
)
```

**Event Flow:**
```
1. User Action (API call)
       ↓
2. Service executes business logic
       ↓
3. Service emits domain event
       ↓
4. NotificationEventSubscriber catches event
       ↓
5. Creates notification in database
       ↓
6. WebSocketService sends real-time update
       ↓
7. Frontend receives instant notification
```

**Benefits:**
- ✅ **Decoupling**: Services don't depend on NotificationService
- ✅ **Extensibility**: Add new subscribers without modifying emitters
- ✅ **Testability**: Mock event emitter in unit tests
- ✅ **Async**: Parallel execution with Promise.allSettled

### Base Classes for Generic Operations

**IBaseRepository** → **MongooseRepository** → Specific Repository

```typescript
// Generic CRUD operations
interface IBaseRepository<E, ID = string> {
  findAll(): Promise<E[]>
  findById(id: ID): Promise<E | null>
  create(dto: CreateDto): Promise<E>
  update(id: ID, dto: UpdateDto): Promise<E | null>
  delete(id: ID): Promise<boolean>
  startSession(): Promise<ClientSession>
}

// MongoDB implementation
class MongooseRepository<E, ID> implements IBaseRepository<E, ID> {
  constructor(protected readonly model: Model<any>) {}
  // Implementation with toJSON() for sanitization
}

// Specific repository with custom methods
class TaskRepository extends MongooseRepository<ITask, string> {
  async findAllByUser(userId: string): Promise<ITask[]> {
    // Custom query with population
  }
}
```

**Same pattern for Services and Controllers** → DRY principle

---

## 📁 Project Structure

```
eventask-api/
├── .github/
│   ├── instructions/
│   │   └── copilot-instructions.md  # Development guidelines and standards
│   └── workflows/
│       ├── ci.yml                    # CI/CD pipeline (lint, typecheck, build)
│       └── codeql.yml                # Security code scanning
│
├── uploads/
│   └── avatars/                      # User profile pictures (generated)
│
├── dist/                             # Compiled JavaScript output (generated)
│
├── src/
│   ├── app.ts                        # Application entry point - HTTP + Socket.io server
│   │
│   ├── config/                       # Configuration modules
│   │   ├── dependencies.ts           # DI Container (295 lines) - Singleton management
│   │   ├── env.ts                    # Environment validation with required variables
│   │   ├── uploads.ts                # File upload paths and static middleware
│   │   │
│   │   ├── middlewares/              # Global middleware configuration
│   │   │   ├── ApiError.ts           # Custom error class with statusCode
│   │   │   ├── cors.ts               # CORS configuration (origins, credentials)
│   │   │   ├── errorRequestHandler.ts    # Centralized error handler
│   │   │   ├── expressAdapter.ts     # toHandler() - Controller to Express adapter
│   │   │   ├── notFoundRouteHandler.ts   # 404 handler
│   │   │   ├── session.ts            # Express session + MongoDB store
│   │   │   ├── JWT/
│   │   │   │   ├── generateJWT.ts    # Create access/refresh tokens
│   │   │   │   ├── validateAccessJWT.ts  # Verify Bearer token middleware
│   │   │   │   └── validateRefreshJWT.ts # Verify refresh token from cookie
│   │   │   └── upload/
│   │   │       └── uploadAvatarMiddleware.ts # Multer config (1MB, JPEG/PNG)
│   │   │
│   │   ├── types/                    # Configuration-related types
│   │   │   ├── cookies.ts            # Cookie type definitions
│   │   │   ├── globalEnv.d.ts        # Global environment types
│   │   │   ├── jwtPayload.ts         # JWT payload interface
│   │   │   ├── pagination.ts         # Pagination query options
│   │   │   └── request.ts            # AuthenticatedRequest type
│   │   │
│   │   └── websocket/                # Socket.io configuration
│   │       ├── SocketServer.ts       # Initialize Socket.io with CORS
│   │       ├── SocketAuth.ts         # JWT authentication for WebSocket
│   │       └── SocketTypes.ts        # Socket types (AuthenticatedSocket, etc.)
│   │
│   ├── controllers/                  # Request handlers (Presentation Layer)
│   │   ├── base/
│   │   │   ├── IBaseController.ts    # Generic CRUD controller interface
│   │   │   └── BaseControllerImpl.ts # Base implementation
│   │   ├── auth/
│   │   │   └── AuthControllerImpl.ts # Login, register, Google OAuth, password reset
│   │   ├── task/
│   │   │   └── TaskController.ts     # Task CRUD + event synchronization
│   │   ├── event/
│   │   │   └── EventController.ts    # Event CRUD operations
│   │   ├── category/
│   │   │   └── CategoryController.ts # Category CRUD operations
│   │   ├── user/
│   │   │   └── UserController.ts     # Profile, contacts, avatar upload
│   │   ├── invitation/
│   │   │   └── InvitationController.ts   # Invitation flow (send, accept, reject)
│   │   └── notification/
│   │       └── NotificationController.ts # Notification CRUD + mark as read
│   │
│   ├── services/                     # Business logic layer
│   │   ├── IBaseService.ts           # Generic service interface
│   │   ├── BaseServiceImpl.ts        # Base service implementation
│   │   ├── auth/
│   │   │   ├── IAuthService.ts
│   │   │   └── AuthServiceImpl.ts    # JWT generation, bcrypt, Google OAuth
│   │   ├── task/
│   │   │   ├── ITaskService.ts
│   │   │   └── TaskServiceImpl.ts    # Task + events sync, metadata computation
│   │   ├── event/
│   │   │   ├── IEventService.ts
│   │   │   └── EventServiceImpl.ts   # Event CRUD, emit domain events
│   │   ├── category/
│   │   │   ├── ICategoryService.ts
│   │   │   └── CategoryServiceImpl.ts
│   │   ├── user/
│   │   │   ├── IUserService.ts
│   │   │   └── UserServiceImpl.ts    # User profile, contacts management
│   │   ├── invitation/
│   │   │   ├── IInvitationService.ts
│   │   │   └── InvitationServiceImpl.ts  # Emit invitation events
│   │   ├── notification/
│   │   │   ├── INotificationService.ts
│   │   │   └── NotificationServiceImpl.ts    # Notification CRUD
│   │   ├── websocket/
│   │   │   └── WebSocketService.ts   # Emit real-time notifications to users
│   │   ├── scheduler/
│   │   │   └── EventNotificationScheduler.ts # Cron job for event reminders
│   │   └── shared/
│   │       └── email/
│   │           ├── IEmailService.ts
│   │           ├── EmailServiceFactory.ts    # Factory pattern
│   │           ├── NodemailerEmailService.ts
│   │           └── templates/
│   │               └── PasswordResetEmail.ts # HTML email templates
│   │
│   ├── repositories/                 # Data access layer
│   │   ├── IBaseRepository.ts        # Generic repository interface
│   │   ├── MongooseRepository.ts     # Base class with MongoDB sessions
│   │   ├── task/
│   │   │   ├── ITaskRepository.ts
│   │   │   └── TaskRepository.ts     # Task queries (pagination, populate)
│   │   ├── event/
│   │   │   ├── IEventRepository.ts
│   │   │   └── EventRepository.ts    # findByTaskId, findInTimeRange
│   │   ├── category/
│   │   │   ├── ICategoryRepository.ts
│   │   │   └── CategoryRepository.ts
│   │   ├── user/
│   │   │   ├── IUserRepository.ts
│   │   │   └── UserRepository.ts     # findByEmail, findByGoogleId
│   │   ├── invitation/
│   │   │   ├── IInvitationRepository.ts
│   │   │   └── InvitationRepository.ts
│   │   ├── notification/
│   │   │   ├── INotificationRepository.ts
│   │   │   └── NotificationRepository.ts # Filter by type, read status
│   │   └── token/
│   │       ├── ITokenRepository.ts
│   │       └── TokenRepository.ts    # Refresh token persistence
│   │
│   ├── databases/
│   │   └── mongo/
│   │       ├── config.ts             # MongoDB connection + plugins
│   │       └── models/
│   │           ├── cleanOutput.ts    # Plugin: _id → id, sanitization
│   │           ├── schemas/          # Mongoose schemas
│   │           │   ├── task.ts       # TaskSchema with virtuals & indexes
│   │           │   ├── event.ts
│   │           │   ├── user.ts       # Unique email index
│   │           │   ├── category.ts
│   │           │   ├── invitation.ts
│   │           │   ├── notification.ts
│   │           │   └── token.ts
│   │           └── doctypes/         # Mongoose document types
│   │               ├── task.ts
│   │               ├── event.ts
│   │               ├── user.ts
│   │               └── ...
│   │
│   ├── routes/                       # Express routers
│   │   ├── auth.ts                   # POST /api/auth/login, /register, /google-login
│   │   ├── tasks.ts                  # CRUD /api/tasks with JWT validation
│   │   ├── events.ts                 # CRUD /api/events
│   │   ├── category.ts               # CRUD /api/categories
│   │   ├── user.ts                   # /api/users (profile, contacts, avatar)
│   │   ├── invitation.ts             # /api/invitations (send, accept, reject)
│   │   ├── notification.ts           # /api/notifications
│   │   └── security.ts               # GET /api/security/csrf-token
│   │
│   ├── middlewares/                  # Custom middlewares
│   │   ├── rateLimits.ts             # 500 req / 15 min per IP
│   │   └── validators/               # express-validator rules
│   │       ├── validationFieldsResult.ts # Aggregate validation errors
│   │       ├── taskValidator.ts
│   │       ├── eventValidator.ts
│   │       ├── loginValidator.ts
│   │       ├── registerValidator.ts
│   │       ├── googleLoginValidator.ts
│   │       ├── categoryValidator.ts
│   │       ├── invitationValidator.ts
│   │       ├── requestPasswordResetValidator.ts
│   │       ├── resetPasswordValidator.ts
│   │       └── validateAvatarMiddleware.ts
│   │
│   ├── sys-events/                   # Domain event system (Observer pattern)
│   │   ├── IApplicationEventEmitter.ts   # Event emitter interface
│   │   ├── ApplicationEventEmitter.ts    # Implementation (Map-based)
│   │   ├── README.md                 # 247 lines of event system docs
│   │   ├── subscribers/
│   │   │   └── NotificationEventSubscriber.ts    # 319 lines - Event handlers
│   │   ├── types/
│   │   │   └── sys-events.ts         # Event names & payload types
│   │   └── utils/
│   │       └── eventNotificationMapping.ts   # Event → Notification type
│   │
│   ├── types/                        # TypeScript interfaces
│   │   ├── IBase.ts                  # Base entity (id, createdAt, updatedAt)
│   │   ├── ITask.ts                  # Task with metadata
│   │   ├── IEvent.ts                 # Event with status
│   │   ├── IUser.ts                  # User with contacts
│   │   ├── ICategory.ts
│   │   ├── IInvitation.ts            # Invitation status (pending, accepted, rejected)
│   │   ├── INotification.ts          # Notification types & data
│   │   ├── IToken.ts                 # Refresh token entity
│   │   ├── IEmail.ts
│   │   └── dtos/                     # Data Transfer Objects
│   │       ├── auth.ts               # Login, register, refresh DTOs
│   │       ├── task.ts               # Create/update task DTOs
│   │       ├── event.ts
│   │       ├── user.ts
│   │       ├── notification.ts
│   │       └── invitation.ts
│   │
│   ├── helpers/                      # Utility functions
│   │   ├── computeTaskMetadata.ts    # Calculate task dates, duration, progress
│   │   └── sendPasswordResetEmail.ts # Email helper
│   │
│   └── models/                       # Deprecated - Use databases/mongo/models
│       └── Category.ts               # Legacy category model
│
├── .eslintrc.cjs                     # ESLint configuration (flat config)
├── .prettierrc                       # Prettier configuration
├── eslint.config.js                  # ESLint 9.x flat config
├── tsconfig.json                     # TypeScript configuration (strict mode)
├── tsconfig-init.json                # TypeScript default config reference
├── package.json                      # Dependencies and scripts
├── pnpm-lock.yaml                    # pnpm lockfile
├── pnpm-workspace.yaml               # pnpm workspace configuration
├── Procfile                          # Heroku/Render deployment (web: node dist/app.js)
├── .gitignore
└── README.md                         # This file
```

### 🏛️ Architecture Patterns

- **Feature-based organization**: Modules grouped by domain (auth, task, event, user)
- **Layered architecture**: Clear separation (Controllers → Services → Repositories → Models)
- **Dependency Injection**: Centralized container in `config/dependencies.ts`
- **Type safety**: All types defined in `types/` with strict TypeScript
- **Event-driven**: Domain events in `sys-events/` for loose coupling
- **Base classes**: Generic implementations (IBaseRepository, IBaseService, IBaseController)

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **pnpm**: v10.x or higher ([Installation guide](https://pnpm.io/installation))
- **MongoDB**: v6.x or higher ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Verify installation
pnpm --version
node --version
```

### Environment Variables

Create a `.env` file in the root directory (or `.env.development` for development) with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database
DB_CONNECTION_STRING=mongodb://localhost:27017/eventask
# Or use MongoDB Atlas:
# DB_CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/eventask

# JWT Secrets (generate strong random strings)
SECRET_JWT_SEED=your_jwt_secret_here_min_32_chars
SESSION_SECRET=your_session_secret_here_min_32_chars

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Accepted Origins (comma-separated for multiple origins)
ACCEPTED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email Configuration (Nodemailer)
EMAIL_PROVIDER=nodemailer
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password_here
EMAIL_FROM_NAME=EvenTask

# Google OAuth (optional - for social login)
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

> **Security Notes:**
> - Never commit `.env` files to version control
> - Use strong random strings for JWT secrets (min 32 characters)
> - For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833) instead of your regular password
> - Generate secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/agusmoya/eventask-api.git
cd eventask-api
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start MongoDB**

```bash
# If using local MongoDB
mongod

# Or start MongoDB service (Linux/macOS)
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Start the development server**

```bash
pnpm dev
```

The API will be available at `http://localhost:4000`

### Available Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `pnpm dev`        | Starts development server with hot reload (tsx)   |
| `pnpm build`      | Compiles TypeScript to JavaScript in `dist/`      |
| `pnpm build:prod` | Clean build (removes dist/ first)                 |
| `pnpm start`      | Runs production server from `dist/` (after build) |
| `pnpm lint`       | Runs ESLint to check for code quality issues      |
| `pnpm lint:fix`   | Automatically fixes ESLint errors where possible  |
| `pnpm format`     | Formats code with Prettier                        |
| `pnpm typecheck`  | Runs TypeScript compiler without emitting files   |

### Development Workflow

```bash
# Start development server (terminal 1)
pnpm dev

# Run linting in watch mode (terminal 2)
pnpm lint --watch

# Before committing, run quality checks
pnpm typecheck
pnpm lint
pnpm format
```

### Production Build

```bash
# Build for production
pnpm build:prod

# Test production build locally
pnpm start

# Or deploy to Heroku/Render
# Procfile is already configured: web: node dist/app.js
```

---

## 🔐 Security

EvenTask API implements multiple layers of security to protect user data and prevent common vulnerabilities.

### Authentication Flow

#### JWT Token Strategy

```
Client Login → Server validates → Returns { accessToken, refreshToken }
├── accessToken: Short-lived (15min), sent in Authorization header
└── refreshToken: Long-lived (7 days), stored in HTTP-only cookie
```

**Token Lifecycle:**
1. **Login**: User receives both tokens
2. **API Requests**: `accessToken` sent in `Authorization: Bearer <token>` header
3. **Token Expiration**: 401 response triggers refresh flow
4. **Refresh**: POST `/api/auth/refresh` with refreshToken cookie → new accessToken
5. **Logout**: POST `/api/auth/logout` invalidates refreshToken in database

#### Automatic Token Refresh (Client-Side)

```typescript
// Frontend should implement refresh logic on 401 responses
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Call /api/auth/refresh with credentials
      const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
      // Retry original request with new token
      error.config.headers['Authorization'] = `Bearer ${data.accessToken}`
      return axios.request(error.config)
    }
    return Promise.reject(error)
  }
)
```

### CSRF Protection

#### Double-Submit Cookie Pattern

```typescript
// 1. Client requests CSRF token on app load
GET /api/security/csrf-token
Response: { csrfToken: "abc123..." }

// 2. Include token in all state-changing requests (POST, PUT, DELETE)
Headers: {
  'X-CSRF-Token': 'abc123...',
  'Cookie': 'eventask.sid=...' // Session cookie with same token
}
```

**Why This Works:**
- CSRF token stored in session cookie (HTTP-only)
- Client includes token in custom header
- Attacker cannot read token from different origin (Same-Origin Policy)
- Server validates both match for state-changing operations

**Implementation:**
```typescript
// Middleware: lusca.csrf() validates automatically
app.use(lusca.csrf())

// Custom header must match session token
if (req.headers['x-csrf-token'] !== req.session.csrfToken) {
  throw new Error('CSRF token mismatch')
}
```

### Route Protection

#### JWT Validation Middleware

```typescript
// src/config/middlewares/JWT/validateAccessJWT.ts
export const validateAccessJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    throw new ApiError(401, 'Access token missing.')
  }
  
  const { uid } = jwt.verify(token, env.SECRET_JWT_SEED)
  req.uid = uid // Inject user ID into request
  next()
}

// Usage in routes
router.get('/api/tasks', validateAccessJWT, taskController.getAll)
```

**Protection Layers:**
1. **Token Presence**: Validates `Authorization` header exists
2. **Signature Verification**: JWT signed with server secret
3. **Expiration Check**: Token must not be expired
4. **User Injection**: `req.uid` available in controllers

### HTTP-Only Cookies

**Refresh Token Storage:**
```typescript
res.cookie('refreshToken', token, {
  httpOnly: true,        // Not accessible via JavaScript (XSS protection)
  secure: NODE_ENV === 'production',  // HTTPS only in production
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',  // CSRF protection
  maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days
  path: '/',
  domain: undefined,     // Browser handles domain automatically
})
```

**Security Benefits:**
- ✅ `httpOnly`: Cannot be accessed via `document.cookie` (XSS protection)
- ✅ `secure`: Only sent over HTTPS in production
- ✅ `sameSite`: Prevents CSRF attacks at cookie level
- ✅ Long expiration: User stays logged in for 7 days

### Input Validation

#### Server-Side Validation with express-validator

```typescript
// src/middlewares/validators/taskValidator.ts
export const taskValidations = () => [
  check('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters.')
    .escape(),
  check('categoryId')
    .notEmpty().withMessage('Category ID is required.')
    .isMongoId().withMessage('Invalid category ID.'),
  validationFieldsResult,  // Aggregate errors
]

// Usage in routes
router.post('/api/tasks', taskValidations(), taskController.create)
```

**Validation Layers:**
1. **Format Validation**: Email regex, MongoDB ID format, password strength
2. **Length Validation**: Minimum/maximum character counts
3. **Sanitization**: Remove HTML tags, trim whitespace
4. **Custom Validators**: Business logic validation (e.g., unique email)

### Password Security

```typescript
// Hash password on registration
const salt = await bcrypt.genSalt()
const hash = await bcrypt.hash(password, salt)

// Verify password on login
const isValid = await bcrypt.compare(password, user.password)
```

**Best Practices:**
- ✅ Salt rounds: 10 (default) - Balance between security and performance
- ✅ Never store plain-text passwords
- ✅ Hash generated per-user (rainbow table protection)

### Rate Limiting

```typescript
// src/middlewares/rateLimits.ts
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 500,                   // 500 requests per windowMs
  standardHeaders: true,      // Return rate limit info in RateLimit-* headers
  message: {
    error: 'Too many requests, please try again later.',
    code: 429,
  },
})

// Applied globally
app.use('/api', apiRateLimiter)
```

**Protection Against:**
- Brute force attacks
- DDoS attempts
- API abuse

### Database Security

#### Mongoose Schema Sanitization

```typescript
// src/databases/mongo/models/cleanOutput.ts
// Plugin applied to all schemas
mongoose.plugin(cleanOutput)

// Transforms output automatically:
// - _id → id (string)
// - Remove __v
// - Remove password field
// - Convert ObjectIds to strings
// - Convert Dates to ISO strings
```

**Benefits:**
- ✅ Sensitive fields never exposed (password, internal IDs)
- ✅ Consistent API responses
- ✅ Frontend-friendly format

### CORS Configuration

```typescript
// src/config/middlewares/cors.ts
export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    if (!origin || env.ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'), false)
  },
  credentials: true,  // Allow cookies
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})
```

### WebSocket Security

#### JWT Authentication on Connection

```typescript
// src/config/websocket/SocketAuth.ts
export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token
  
  if (!token) {
    return next(new Error('Authentication token required'))
  }
  
  const decoded = jwt.verify(token, env.SECRET_JWT_SEED)
  socket.data = { userId: decoded.uid, authenticated: true }
  
  next()
}

// Client connection
const socket = io(API_URL, {
  auth: { token: accessToken },
  transports: ['websocket'],
})
```

**Connection Flow:**
1. Client sends `accessToken` in handshake
2. Server validates token before accepting connection
3. Invalid token → connection rejected
4. Valid token → user joins `user:${userId}` room

### Best Practices Implemented

✅ **JWT in Authorization Header**: Never in URL or localStorage (XSS protection)  
✅ **Refresh Token in HTTP-Only Cookie**: Safe from JavaScript access  
✅ **CSRF Token for Mutations**: Validates state-changing operations  
✅ **Rate Limiting**: Prevents brute force and DDoS  
✅ **Input Validation**: Server-side validation on all endpoints  
✅ **Password Hashing**: bcrypt with salt rounds  
✅ **TypeScript Strict Mode**: Compile-time type safety  
✅ **MongoDB Transactions**: ACID guarantees for critical operations  
✅ **cleanOutput Plugin**: Automatic sanitization of responses  

### Security Considerations

⚠️ **Environment Variables**: Never commit `.env` with real credentials  
⚠️ **HTTPS Required**: Always use HTTPS in production  
⚠️ **Token Expiration**: Monitor and adjust based on security requirements  
⚠️ **Secrets Rotation**: Rotate JWT secrets periodically in production  
⚠️ **Session Store**: MongoDB session store for scalability  

---

## 🌐 API Endpoints

### Base URL

```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

### Authentication Routes (`/api/auth`)

| Method | Endpoint                       | Auth Required | Description                               |
| ------ | ------------------------------ | ------------- | ----------------------------------------- |
| POST   | `/auth/register`               | ❌             | Register new user                         |
| POST   | `/auth/login`                  | ❌             | Login with email/password                 |
| POST   | `/auth/google-login`           | ❌             | Login with Google OAuth token             |
| POST   | `/auth/refresh`                | 🔄 Refresh     | Get new access token using refresh cookie |
| POST   | `/auth/logout`                 | ✅             | Logout and invalidate refresh token       |
| POST   | `/auth/request-password-reset` | ❌             | Send password reset email                 |
| POST   | `/auth/reset-password`         | ❌             | Reset password with token                 |

### Security Routes (`/api/security`)

| Method | Endpoint               | Auth Required | Description    |
| ------ | ---------------------- | ------------- | -------------- |
| GET    | `/security/csrf-token` | ❌             | Get CSRF token |

### User Routes (`/api/users`)

| Method | Endpoint                  | Auth Required | Description                       |
| ------ | ------------------------- | ------------- | --------------------------------- |
| GET    | `/users/profile`          | ✅             | Get authenticated user profile    |
| PUT    | `/users/profile`          | ✅             | Update user profile               |
| POST   | `/users/avatar`           | ✅             | Upload profile avatar (multipart) |
| GET    | `/users/contacts`         | ✅             | Get user's contact list           |
| DELETE | `/users/contacts/:userId` | ✅             | Remove contact from list          |

### Task Routes (`/api/tasks`)

| Method | Endpoint     | Auth Required | Description                               |
| ------ | ------------ | ------------- | ----------------------------------------- |
| GET    | `/tasks`     | ✅             | Get all tasks for authenticated user      |
| GET    | `/tasks/:id` | ✅             | Get task by ID with populated events      |
| POST   | `/tasks`     | ✅             | Create task with events (transaction)     |
| PUT    | `/tasks/:id` | ✅             | Update task and sync events (transaction) |
| DELETE | `/tasks/:id` | ✅             | Delete task and all its events            |

**Query Parameters for GET `/tasks`:**
- `page` (number): Page number for pagination (default: 1)
- `perPage` (number): Items per page (default: 20)

### Event Routes (`/api/events`)

| Method | Endpoint      | Auth Required | Description             |
| ------ | ------------- | ------------- | ----------------------- |
| GET    | `/events`     | ✅             | Get all events for user |
| GET    | `/events/:id` | ✅             | Get event by ID         |
| POST   | `/events`     | ✅             | Create new event        |
| PUT    | `/events/:id` | ✅             | Update event            |
| DELETE | `/events/:id` | ✅             | Delete event            |

### Category Routes (`/api/categories`)

| Method | Endpoint          | Auth Required | Description        |
| ------ | ----------------- | ------------- | ------------------ |
| GET    | `/categories`     | ✅             | Get all categories |
| GET    | `/categories/:id` | ✅             | Get category by ID |
| POST   | `/categories`     | ✅             | Create category    |
| PUT    | `/categories/:id` | ✅             | Update category    |
| DELETE | `/categories/:id` | ✅             | Delete category    |

### Invitation Routes (`/api/invitations`)

| Method | Endpoint                  | Auth Required | Description                  |
| ------ | ------------------------- | ------------- | ---------------------------- |
| GET    | `/invitations`            | ✅             | Get all invitations for user |
| POST   | `/invitations`            | ✅             | Send invitation by email     |
| PUT    | `/invitations/:id/accept` | ✅             | Accept invitation            |
| PUT    | `/invitations/:id/reject` | ✅             | Reject invitation            |

### Notification Routes (`/api/notifications`)

| Method | Endpoint                  | Auth Required | Description               |
| ------ | ------------------------- | ------------- | ------------------------- |
| GET    | `/notifications`          | ✅             | Get all notifications     |
| GET    | `/notifications/:id`      | ✅             | Get notification by ID    |
| PUT    | `/notifications/:id/read` | ✅             | Mark notification as read |
| DELETE | `/notifications/:id`      | ✅             | Delete notification       |

### Request/Response Examples

#### Register User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Note: `refreshToken` also set in HTTP-only cookie*

#### Create Task with Events

**Request:**
```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-CSRF-Token: abc123...

{
  "title": "Develop Authentication System",
  "categoryId": "507f1f77bcf86cd799439011",
  "participantsIds": ["507f191e810c19729de860ea"],
  "events": [
    {
      "title": "Design JWT Flow",
      "start": "2025-11-24T09:00:00.000Z",
      "end": "2025-11-24T11:00:00.000Z",
      "status": "pending",
      "notes": "Research best practices",
      "collaboratorsIds": ["507f191e810c19729de860ea"]
    },
    {
      "title": "Implement JWT Middleware",
      "start": "2025-11-24T11:00:00.000Z",
      "end": "2025-11-24T15:00:00.000Z",
      "status": "pending",
      "notes": "Create access and refresh token logic",
      "collaboratorsIds": []
    }
  ]
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Develop Authentication System",
  "status": "pending",
  "categoryId": "507f1f77bcf86cd799439011",
  "participantsIds": ["507f191e810c19729de860ea"],
  "eventsIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "createdBy": "507f191e810c19729de860ea",
  "beginningDate": "2025-11-24T09:00:00.000Z",
  "completionDate": "2025-11-24T15:00:00.000Z",
  "duration": 6,
  "progress": 0,
  "createdAt": "2025-11-24T08:00:00.000Z",
  "updatedAt": "2025-11-24T08:00:00.000Z"
}
```

#### Error Response

```json
{
  "ok": false,
  "message": "Title must be between 5 and 100 characters.",
  "errors": {
    "title": {
      "msg": "Title must be between 5 and 100 characters.",
      "param": "title",
      "location": "body"
    }
  }
}
```

---

## 🔌 WebSocket Events

### Connection

**Client Connection:**
```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000', {
  auth: { token: accessToken },
  transports: ['websocket'],
})

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason)
})
```

### Server Events (Server → Client)

| Event           | Payload                 | Description                                      |
| --------------- | ----------------------- | ------------------------------------------------ |
| `connected`     | `{ userId, timestamp }` | Emitted after successful authentication          |
| `notification`  | `INotification`         | Real-time notification (task, event, invitation) |
| `disconnect`    | `reason: string`        | Connection closed                                |
| `connect_error` | `error: Error`          | Authentication or connection failed              |

### Event Payloads

#### Notification Event

```typescript
interface INotification {
  id: string
  userId: string
  type: 'task' | 'event' | 'invitation' | 'system'
  title: string
  message: string
  data?: {
    taskId?: string
    eventId?: string
    invitationId?: string
    fromUserId?: string
    fromUserName?: string
  }
  read: boolean
  createdAt: string
}
```

**Example:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "userId": "507f191e810c19729de860ea",
  "type": "task",
  "title": "Task Assigned",
  "message": "You have been assigned to 'Develop Authentication System'",
  "data": {
    "taskId": "507f1f77bcf86cd799439012",
    "fromUserId": "507f191e810c19729de860eb",
    "fromUserName": "Jane Smith"
  },
  "read": false,
  "createdAt": "2025-11-24T08:00:00.000Z"
}
```

### Client-Side Event Handling

```typescript
// Listen for real-time notifications
socket.on('notification', (notification: INotification) => {
  console.log('New notification:', notification)
  
  // Update UI (e.g., Redux store, toast notification)
  dispatch(addNotification(notification))
  showToast(notification.title, notification.message)
})

// Handle connection events
socket.on('connected', (data) => {
  console.log('WebSocket authenticated:', data)
})

socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message)
  // Attempt token refresh and reconnect
})
```

### Room-Based Delivery

Each authenticated user automatically joins a room `user:${userId}`:

```typescript
// Server-side (WebSocketService)
io.to(`user:${userId}`).emit('notification', notification)

// Only users in that room receive the event
// Efficient targeted delivery without broadcasting
```

---

## 📝 Code Conventions

EvenTask API follows strict coding standards to maintain consistency, readability, and maintainability.

### ESLint Configuration

Located in `eslint.config.js` (ESLint 9.x flat config):

```javascript
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
```

**Key Rules:**
- ❌ **No semicolons**: `semi: 'never'`
- ✅ **Single quotes**: `quotes: 'single'`
- ⚠️ **Unused variables**: Warnings to clean up dead code
- ⚠️ **No `any` type**: Encourages strict typing

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src"
  }
}
```

**Strict Mode Features:**
- ✅ `noImplicitAny`: No implicit any types
- ✅ `strictNullChecks`: Null and undefined handled explicitly
- ✅ `strictFunctionTypes`: Strict function type checking
- ✅ `noUnusedLocals`: No unused local variables
- ✅ `noUnusedParameters`: No unused function parameters

### Prettier Configuration

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

### Naming Conventions

#### Files & Folders

| Type           | Convention        | Example                              |
| -------------- | ----------------- | ------------------------------------ |
| **Interfaces** | PascalCase with I | `ITaskService.ts`, `IUser.ts`        |
| **Classes**    | PascalCase        | `TaskServiceImpl.ts`, `UserModel.ts` |
| **Functions**  | camelCase         | `computeTaskMetadata.ts`             |
| **Constants**  | UPPER_SNAKE_CASE  | `TASK_STATUS`, `EVENT_NAMES`         |
| **Folders**    | kebab-case        | `sys-events/`, `config/`             |

#### Variables & Functions

```typescript
// ✅ Variables: camelCase
const taskRepository = getTaskRepository()
const isAuthenticated = true

// ✅ Functions: camelCase with descriptive verbs
const createTask = async (dto: ITaskCreateDto) => { }
const validateAccessJWT = (req, res, next) => { }

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 1024 * 1024
const TASK_STATUS = { PENDING: 'pending', COMPLETED: 'completed' }

// ✅ Classes: PascalCase
class TaskServiceImpl implements ITaskService { }

// ✅ Interfaces: PascalCase with I prefix
interface ITaskService { }
interface IUser { }
```

### File Organization

#### Service Structure

```typescript
// TaskServiceImpl.ts
import { BaseServiceImpl } from '../BaseServiceImpl.js'
import { ITaskService } from './ITaskService.js'
// ... more imports

export class TaskServiceImpl 
  extends BaseServiceImpl<ITask, string>
  implements ITaskService 
{
  protected resourceName: string = 'Task'

  constructor(
    protected readonly repository: ITaskRepository,
    private readonly eventRepository: IEventRepository,
    private readonly eventEmitter: IApplicationEventEmitter
  ) {
    super(repository)
  }

  // Public methods
  async createWithEvents(dto: ITaskCreateDto, userId: string): Promise<ITask> {
    // Implementation
  }

  // Private helper methods
  private async notifyParticipants(task: ITask): Promise<void> {
    // Implementation
  }
}
```

#### Import Order

```typescript
// 1. External libraries
import express from 'express'
import mongoose from 'mongoose'

// 2. Internal absolute imports (config, types)
import { env } from '../config/env.js'
import { ITask } from '../types/ITask.js'

// 3. Relative imports (same domain)
import { TaskRepository } from './TaskRepository.js'
import { computeTaskMetadata } from '../helpers/computeTaskMetadata.js'
```

### JSDoc Comments

Use JSDoc for helpers, utilities, and complex functions:

```typescript
/**
 * Calculates task metadata based on its events.
 * @param events - Array of events belonging to the task
 * @returns Computed metadata (dates, duration, progress, status)
 */
export function computeTaskMetadata(events: IEventDto[]): TaskMetadata {
  // Implementation
}
```

### Error Handling

```typescript
// ✅ Use ApiError for business logic errors
if (!user) {
  throw new ApiError(404, 'User not found.')
}

// ✅ Use try-catch for database operations
try {
  await taskRepository.create(dto)
} catch (error) {
  console.error('Failed to create task:', error)
  throw new ApiError(500, 'Internal server error.')
}

// ✅ Centralized error handler catches all
app.use(errorRequestHandler)
```

### Async/Await

```typescript
// ✅ Always use async/await (no .then() chains)
const task = await taskRepository.findById(id)

// ✅ Parallel operations with Promise.all
const [tasks, categories] = await Promise.all([
  taskRepository.findAll(),
  categoryRepository.findAll(),
])

// ✅ Error handling with try-catch
try {
  await service.createTask(dto)
} catch (error) {
  throw new ApiError(400, getErrorMessage(error))
}
```

### Git Commit Conventions

Recommended commit message format (not enforced):

```
<type>(<scope>): <subject>

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples:**
```
feat(auth): add Google OAuth login
fix(task): prevent duplicate task creation on double-click
docs(readme): update installation instructions
refactor(services): extract common logic to BaseService
chore(deps): upgrade mongoose to 8.18.1
```

---

## 🗺️ Roadmap

### ✅ Completed Features

- [x] **Authentication System** (JWT + Refresh Token + Google OAuth)
- [x] **Task Management** (CRUD with transactions, metadata computation)
- [x] **Event Management** (CRUD, cascade operations with tasks)
- [x] **Real-Time Notifications** (Socket.io with JWT authentication)
- [x] **Event Scheduler** (Cron job for 24h event reminders)
- [x] **Event-Driven Architecture** (Observer pattern with ApplicationEventEmitter)
- [x] **File Upload** (Avatar upload with Multer)
- [x] **Invitation System** (Collaborate via email)
- [x] **Category Management** (Organize tasks and events)
- [x] **Security Hardening** (CSRF, rate limiting, bcrypt, cookie security)
- [x] **Dependency Injection** (Centralized container for scalability)
- [x] **Email Service** (Nodemailer for password reset and invitations)
- [x] **MongoDB Optimization** (Lean queries, virtuals, plugins, indexes)
- [x] **Clean Architecture** (Layered design: Controllers → Services → Repositories → Models)

### 🚧 In Progress

- [ ] **Testing Suite**
  - Unit tests for services and repositories (Jest/Vitest)
  - Integration tests for API endpoints (Supertest)
  - E2E tests for critical flows (authentication, task creation)
  - Code coverage target: 80%+

### 🔮 Planned Features

#### Phase 1: Quality & Observability (Q1 2026)

- [ ] **API Documentation**
  - Swagger/OpenAPI specification
  - Interactive API explorer (Swagger UI)
  - Postman collection export

- [ ] **Logging & Monitoring**
  - Structured logging with Winston
  - Error tracking with Sentry
  - Performance monitoring (APM)
  - Request ID tracing

- [ ] **Testing Infrastructure**
  - CI/CD pipeline with GitHub Actions
  - Automated test runs on PR
  - Code coverage reports
  - Pre-commit hooks (Husky + lint-staged)

#### Phase 2: Features & Scalability (Q2 2026)

- [ ] **Search & Filtering**
  - Full-text search for tasks/events (MongoDB Atlas Search)
  - Advanced filters (date range, status, category, participants)
  - Sorting options (priority, date, completion)

- [ ] **Task Dependencies**
  - Define task prerequisites
  - Gantt chart data structure
  - Dependency validation
  
  **Technical Implementation:**
  ```typescript
  // Extend ITask interface
  interface ITask {
    // ... existing fields
    dependsOn?: string[] // Array of task IDs that must complete first
    blockedBy?: string[] // Auto-computed: tasks waiting for this one
  }
  
  // Validation logic in TaskService
  async validateDependencies(taskId: string, dependsOn: string[]): Promise<void> {
    // 1. Check circular dependencies (A → B → A)
    // 2. Verify all dependency tasks exist and belong to same user
    // 3. Prevent completion if dependencies are incomplete
    // 4. Emit event when task becomes unblocked
  }
  
  // Update computeTaskMetadata helper
  export function computeTaskMetadata(events: IEventDto[], dependencies?: ITask[]): TaskMetadata {
    // Calculate critical path for Gantt chart
    // Adjust beginningDate based on dependency completion dates
  }
  ```
  
  **Database Schema:**
  - Add `dependsOn: [{ type: Schema.Types.ObjectId, ref: 'Task' }]` to Task model
  - Create index on `dependsOn` for efficient queries
  - Add virtual `blockedBy` populated from reverse lookup

- [ ] **Recurring Events**
  - RRULE implementation (daily, weekly, monthly)
  - Exception dates for recurring series
  - Bulk update/delete recurring events
  
  **Technical Implementation:**
  ```typescript
  // Extend IEvent interface
  interface IEvent {
    // ... existing fields
    recurrence?: {
      rule: string // RRULE string (e.g., "FREQ=WEEKLY;BYDAY=MO,WE,FR")
      parentId?: string // Reference to original event (for exceptions)
      exceptions?: Date[] // Dates to skip in series
    }
  }
  
  // Use rrule library (pnpm add rrule)
  import { RRule, rrulestr } from 'rrule'
  
  // EventService method
  async createRecurringSeries(dto: IEventCreateDto, rrule: string): Promise<IEvent[]> {
    const rule = rrulestr(rrule)
    const occurrences = rule.between(new Date(), addMonths(new Date(), 6))
    
    // Create parent event with recurrence rule
    const parent = await eventRepository.create({ ...dto, recurrence: { rule: rrule } })
    
    // Don't create instances; generate on-the-fly in getEvents()
    return [parent]
  }
  
  // Update EventNotificationScheduler
  // Process recurring events: check next occurrence, skip exceptions
  ```
  
  **Integration Points:**
  - Modify `GET /api/events?start=X&end=Y` to expand recurring events into instances
  - Update `computeTaskMetadata` to handle recurring event durations
  - Event-driven: Emit `recurring-event-created` for notification subscribers

- [ ] **Comments & Activity Log**
  - Comment on tasks and events
  - Activity history (who did what, when)
  - Mention users with @username
  
  **Technical Implementation:**
  ```typescript
  // New interfaces in src/types/
  interface IComment {
    id: string
    parentType: 'task' | 'event'
    parentId: string
    authorId: string
    content: string
    mentions: string[] // User IDs mentioned with @
    createdAt: Date
    updatedAt: Date
  }
  
  interface IActivityLog {
    id: string
    entityType: 'task' | 'event' | 'category'
    entityId: string
    action: 'created' | 'updated' | 'deleted' | 'commented'
    userId: string
    changes?: Record<string, { old: any; new: any }> // For updates
    metadata?: Record<string, any>
    timestamp: Date
  }
  
  // New repository/service layer
  CommentRepository → CommentService → CommentController
  ActivityLogRepository (read-only, populated by event subscribers)
  
  // Event-driven integration
  // In sys-events/subscribers/ActivityLogSubscriber.ts
  eventEmitter.on('task-created', async (event) => {
    await activityLogRepository.create({
      entityType: 'task',
      entityId: event.taskId,
      action: 'created',
      userId: event.userId,
      timestamp: new Date()
    })
  })
  ```
  
  **API Endpoints:**
  - `POST /api/tasks/:id/comments` - Add comment
  - `GET /api/tasks/:id/comments` - Get comments with populated author
  - `GET /api/tasks/:id/activity` - Get activity log
  - `GET /api/activity?userId=X` - Global activity feed

#### Phase 3: Advanced Features (Q3-Q4 2026)

- [ ] **Team Workspaces**
  - Multi-tenant architecture
  - Role-based access control (RBAC)
  - Workspace invitations
  - Shared categories and templates

- [ ] **Analytics & Reports**
  - Task completion statistics
  - Time tracking per event
  - Productivity insights (charts, trends)
  - Export reports (PDF, CSV)

- [ ] **Third-Party Integrations**
  - Google Calendar sync
  - Microsoft Outlook sync
  - Slack notifications
  - Zapier webhooks

- [ ] **Mobile Support**
  - Push notifications (Firebase Cloud Messaging)
  - Optimized REST API for mobile clients
  - Offline-first data sync strategy

- [ ] **AI-Powered Features**
  - Smart task suggestions
  - Auto-categorization
  - Priority recommendations
  - Natural language event creation

### 🔧 Technical Debt & Improvements

- [ ] **Microservices Migration** (if scale requires)
  - Separate auth, notification, and task services
  - Event-driven communication (RabbitMQ/Kafka)
  - API Gateway (Kong/NGINX)
  
  **Migration Strategy:**
  ```
  Monolith (Current)          →          Microservices (Target)
  ┌─────────────────┐                    ┌──────────────┐
  │   Express App   │                    │  API Gateway │
  │                 │                    │  (Kong/NGINX)│
  │  ┌───────────┐  │                    └──────┬───────┘
  │  │ Auth      │  │                           │
  │  │ Task      │──┼──→ Extract services       ├─→ Auth Service (Port 4001)
  │  │ Event     │  │    Shared DB → Split      │   - JWT validation
  │  │ Notify    │  │    Sync calls → Async     │   - User management
  │  └───────────┘  │                           │
  │                 │                           ├─→ Task Service (Port 4002)
  │  MongoDB        │                           │   - Task CRUD
  │  (Single DB)    │                           │   - Depends on Auth via API
  └─────────────────┘                           │
                                                 ├─→ Notification Service (Port 4003)
                                                 │   - WebSocket server
                                                 │   - Consumes events from RabbitMQ
                                                 │
                                                 └─→ Event Service (Port 4004)
                                                     - Event CRUD
                                                     - Scheduler (cron)
  ```
  
  **Technical Steps:**
  1. **Preserve DI Container Pattern**: Each service has own `dependencies.ts`
  2. **Event-Driven Communication**:
     ```typescript
     // Replace ApplicationEventEmitter with RabbitMQ
     import amqp from 'amqplib'
     
     // In TaskService (Task microservice)
     await rabbitmq.publish('task.created', { taskId, userId })
     
     // In NotificationService (Notification microservice)
     rabbitmq.subscribe('task.created', async (msg) => {
       await notificationService.createTaskNotification(msg.taskId)
     })
     ```
  3. **Database Strategy**:
     - Option A: Shared MongoDB (initial phase)
     - Option B: Database-per-service (eventual goal)
       - Auth DB: users, tokens
       - Task DB: tasks, events, categories
       - Notification DB: notifications
  4. **Service Discovery**: Consul or Kubernetes DNS
  5. **Distributed Tracing**: OpenTelemetry for request correlation
  
  **Preserve Current Architecture:**
  - Keep layered structure (Controller → Service → Repository)
  - Reuse validation middleware (express-validator)
  - Maintain JWT strategy (access + refresh tokens)
  - Event subscribers become RabbitMQ consumers

- [ ] **Database Optimization**
  - Redis caching layer
  - Read replicas for scalability
  - Database sharding strategy

- [ ] **Security Enhancements**
  - Two-factor authentication (2FA)
  - OAuth2 server implementation
  - API key management for third-party integrations
  - Audit logs for sensitive operations

---

## 🤝 Contributing & Development Workflow

This project enforces strict code quality standards using **Husky** and **Commitlint**.

### Commit Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Your commit messages must follow this format:

```bash
<type>(<scope>): <description>

Allowed Types:

feat: New feature
fix: Bug fix
docs: Documentation only
style: Formatting, missing semi colons, etc; no code change
refactor: Refactoring production code
test: Adding tests, refactoring test; no production code change
chore: Updating build tasks, package manager configs, etc

# Examples:
feat(auth): add google oauth integration
fix(calendar): resolve event overlap issue
chore(deps): update react to v18.3
docs(readme): update installation guide
```
> **Note:** Husky will automatically block any commit that doesn't strictly follow this pattern.

---

## 📄 License

**Copyright © 2024-2025 Agustin Moya. All Rights Reserved.**

This code is made publicly available for **portfolio and demonstration purposes only**.

### ❌ Prohibited Uses

You are **NOT** permitted to:
- ✗ Use this code in commercial projects or products
- ✗ Distribute, sell, or sublicense this code
- ✗ Create derivative works based on this code
- ✗ Deploy this code in production environments
- ✗ Copy or replicate the business logic for commercial purposes

### ✅ Permitted Uses

You **MAY**:
- ✓ View and review the code for educational purposes
- ✓ Reference this project in technical discussions or interviews
- ✓ Analyze the code as part of hiring evaluation processes
- ✓ Study the implementation patterns and architecture

### 📧 Contact for Licensing

For any commercial use, licensing inquiries, or permissions beyond the scope above, please contact:

**Agustin Moya**  
📧 Email: agustin.moya.dev@gmail.com  
💼 LinkedIn: [www.linkedin.com/in/agustin-moya-dev](https://www.linkedin.com/in/agustin-moya-dev)  
🐙 GitHub: [@agusmoya](https://github.com/agusmoya)

> **Note**: This project is part of my professional portfolio. The source code is available for review by potential employers and collaborators. Unauthorized commercial use will be pursued to the full extent of applicable law.

---

<div align="center">

**Built with ❤️ using Node.js, TypeScript, Express, and MongoDB**

[⬆ Back to Top](#-eventask-api)

</div>
