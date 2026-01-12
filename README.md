# 🎯 EvenTask API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Commitlint](https://img.shields.io/badge/commitlint-enabled-brightgreen?style=for-the-badge&logo=commitlint)
![Express](https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**RESTful API with real-time WebSocket notifications and event-driven architecture**

[Features](#-key-features) • [Installation](#-installation--setup) • [Architecture](#️-architecture) • [Security](#-security)

</div>

---

## 📖 Overview

**EvenTask API** is a RESTful backend for collaborative task management built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. It follows **Clean Architecture** principles with event-driven design for loose coupling between services.

### 🎯 Core Concept: Event-Based Tasks

Tasks are composed of **Events** (time-boxed work sessions) with an 8-hour workday constraint. The API automatically calculates task metadata (duration, progress, status) based on event completion.

---

## ✨ Key Features

### 🔐 Authentication & Security

- **JWT authentication**: Access tokens (15 min) + Refresh tokens (7 days) stored in MongoDB
- **Google OAuth 2.0**: Social login integration
- **Password reset flow**: One-time tokens sent via email
- **CSRF protection**: Double-submit cookie pattern
- **Rate limiting**: 500 requests per 15 minutes per IP
- **bcrypt hashing**: Secure password storage
- **HTTP-only cookies**: Secure refresh token storage

### 📋 Task & Event Management

- **Atomic transactions**: MongoDB sessions ensure data consistency
- **Automatic metadata**: Calculates `beginningDate`, `completionDate`, `duration`, `progress`, `status`
- **Event synchronization**: Single operation to create, update, and delete events
- **8-hour workday constraint**: Realistic task planning
- **Status tracking**: Pending → In Progress → Completed
- **Category organization**: Group tasks by custom categories

### 👥 Collaboration

- **Invitation system**: Send, accept, reject contact invitations
- **Participant assignment**: Assign collaborators to tasks and events
- **Contact management**: Build user network for collaboration
- **Real-time updates**: Instant notifications via WebSocket

### 🔔 Real-Time Notifications

- **Socket.io with JWT**: WebSocket authentication and bidirectional communication
- **User-specific rooms**: Targeted message delivery to `user:${userId}`
- **Multi-type notifications**: Task, Event, Invitation, System alerts
- **Persistent storage**: All notifications stored in MongoDB
- **Event-driven creation**: Automatically generated from domain events

### 📅 Event Scheduler

- **Automated reminders**: Cron job checks upcoming events every minute
- **10-minute warnings**: Notifies participants before event starts
- **Multi-recipient delivery**: Alerts all collaborators and task creator
- **Duplicate prevention**: Tracks sent notifications to avoid spam

### 🎭 Event-Driven Architecture

- **Observer pattern**: Custom `ApplicationEventEmitter` decouples services
- **Domain events**: `invitation:accepted`, `task:assigned`, `event:created`, etc.
- **Async handling**: Parallel execution with `Promise.allSettled`
- **Extensible**: Add subscribers without modifying emitters

### 📧 Email & File Upload

- **Email factory**: Switch providers (Nodemailer, SendGrid, Resend) via env var
- **HTML templates**: Professional password reset emails
- **Avatar uploads**: Multer middleware with JPEG/PNG validation (max 1MB)
- **Secure storage**: Timestamp-based naming in `/uploads/avatars`

### 🗄️ Database Features

- **Mongoose plugins**: Auto-sanitization (`_id` → `id`), virtual fields, lean queries
- **Indexes**: Optimized queries on `email`, `createdBy`, `categoryId`
- **Timestamps**: Automatic `createdAt` and `updatedAt`
- **Frontend-friendly**: ObjectIds as strings, no internal fields exposed

### 🔧 Developer Experience

- **TypeScript strict mode**: Full type safety
- **ESLint + Prettier**: Automated code quality
- **Hot reload**: tsx + nodemon for instant feedback
- **Centralized errors**: `ApiError` class with status codes
- **Input validation**: express-validator on all endpoints
- **GitHub Actions**: Automated lint, typecheck, build on push/PR

---

## 🛠️ Tech Stack

### Core

| Technology     | Version | Purpose                               |
| -------------- | ------- | ------------------------------------- |
| **Node.js**    | ≥18.0.0 | JavaScript runtime                    |
| **TypeScript** | 5.8.3   | Type-safe development (strict mode)   |
| **Express**    | 5.1.0   | Web framework for RESTful API         |
| **MongoDB**    | 8.18.1  | NoSQL database                        |
| **Mongoose**   | 8.18.1  | MongoDB ODM with schema validation    |
| **Socket.io**  | 4.7.5   | WebSocket server for real-time events |
| **node-cron**  | 4.2.1   | Scheduled tasks (event reminders)     |

### Authentication & Security

| Technology              | Version | Purpose                       |
| ----------------------- | ------- | ----------------------------- |
| **jsonwebtoken**        | 9.0.2   | JWT authentication            |
| **bcryptjs**            | 3.0.2   | Password hashing              |
| **google-auth-library** | 10.3.1  | Google OAuth 2.0              |
| **lusca**               | 1.7.0   | CSRF protection               |
| **express-session**     | 1.18.2  | Session management            |
| **connect-mongo**       | 5.1.0   | MongoDB session store         |
| **express-rate-limit**  | 8.1.0   | Rate limiting (500 req/15min) |
| **cors**                | 2.8.5   | Cross-Origin Resource Sharing |

### Validation & Utilities

| Technology            | Version | Purpose                |
| --------------------- | ------- | ---------------------- |
| **express-validator** | 7.2.1   | Request validation     |
| **multer**            | 2.0.2   | File uploads (avatars) |
| **dayjs**             | 1.11.13 | Date manipulation      |
| **nodemailer**        | 7.0.5   | Email service          |
| **morgan**            | 1.10.1  | HTTP request logging   |
| **dotenv**            | 16.5.0  | Environment variables  |

### Development Tools

| Technology   | Version | Purpose                      |
| ------------ | ------- | ---------------------------- |
| **pnpm**     | 10.x    | Package manager              |
| **tsx**      | 4.19.4  | TypeScript execution for dev |
| **nodemon**  | 3.1.10  | Auto-restart on file changes |
| **ESLint**   | 9.26.0  | Code linting                 |
| **Prettier** | 3.6.2   | Code formatting              |

---

## 🏗️ Architecture

### Layered Architecture

EvenTask API follows **Clean Architecture** with clear separation of concerns:

```
HTTP Request → Routes (JWT + Validation)
       ↓
Controllers (Presentation Layer)
       ↓
Services (Business Logic + Domain Events)
       ↓
Repositories (Data Access Layer)
       ↓
MongoDB (Mongoose Models + Plugins)
```

**Layer Responsibilities:**
- **Routes**: JWT validation, CSRF verification, express-validator rules
- **Controllers**: Request/response handling, validation aggregation
- **Services**: Business logic, metadata computation, domain event emission
- **Repositories**: CRUD operations, MongoDB transactions, type-safe queries
- **Models**: Schemas with virtuals, indexes, sanitization plugins

### Dependency Injection Container

**Centralized singleton management** in [src/config/dependencies.ts](src/config/dependencies.ts):

- Singleton pattern for all Repositories, Services, Controllers
- Lazy initialization (created on first request)
- Easy testing and dependency swapping
- Full TypeScript type safety

### Event-Driven Architecture

**ApplicationEventEmitter** implements Observer pattern for loose coupling:

**Flow:**
1. Service executes business logic
2. Service emits domain event (`task:assigned`, `invitation:accepted`, etc.)
3. `NotificationEventSubscriber` catches event
4. Creates notification in database
5. `WebSocketService` sends real-time update to clients

**Benefits:**
- Services don't depend on NotificationService
- Add new subscribers without modifying emitters
- Testable with mock event emitter
- Async execution with `Promise.allSettled`

### Base Classes

**Generic CRUD operations** reduce code duplication:

- `IBaseRepository` → `MongooseRepository` → Specific Repository
- `IBaseService` → `BaseServiceImpl` → Specific Service
- `IBaseController` → `BaseControllerImpl` → Specific Controller

---

## 📁 Project Structure

```
eventask-api/
├── src/
│   ├── app.ts                        # Application entry point
│   ├── config/                       # Configuration (DI, env, middleware, WebSocket)
│   │   ├── dependencies.ts           # Dependency Injection container
│   │   ├── middlewares/              # CORS, JWT, error handling, CSRF
│   │   ├── websocket/                # Socket.io configuration
│   │   └── types/                    # Config-related types
│   ├── controllers/                  # Request handlers (Presentation Layer)
│   │   └── {domain}/                 # Auth, Task, Event, User, etc.
│   ├── services/                     # Business logic layer
│   │   ├── {domain}/                 # Auth, Task, Event, User, etc.
│   │   ├── scheduler/                # Cron job for event reminders
│   │   ├── websocket/                # Real-time notifications
│   │   └── shared/email/             # Email service (Factory pattern)
│   ├── repositories/                 # Data access layer
│   │   └── {domain}/                 # MongoDB queries and transactions
│   ├── databases/mongo/
│   │   ├── config.ts                 # MongoDB connection
│   │   └── models/                   # Mongoose schemas and plugins
│   ├── routes/                       # Express routers
│   │   └── {domain}.ts               # Auth, tasks, events, etc.
│   ├── middlewares/                  # Custom middleware
│   │   ├── rateLimits.ts             # Rate limiting (500 req/15min)
│   │   └── validators/               # express-validator rules
│   ├── sys-events/                   # Domain event system (Observer pattern)
│   │   ├── ApplicationEventEmitter.ts
│   │   ├── subscribers/              # Event handlers
│   │   └── types/                    # Event names and payloads
│   ├── types/                        # TypeScript interfaces
│   │   ├── I{Entity}.ts              # Domain entities
│   │   └── dtos/                     # Data Transfer Objects
│   └── helpers/                      # Utility functions
├── uploads/avatars/                  # User profile pictures
├── dist/                             # Compiled JavaScript (generated)
├── .github/workflows/                # CI/CD pipelines
├── package.json
├── tsconfig.json
└── README.md
```

### 🏛️ Architecture Patterns

- **Feature-based organization**: Modules grouped by domain (auth, task, event, user)
- **Layered architecture**: Controllers → Services → Repositories → Models
- **Dependency Injection**: Centralized singleton container
- **Event-driven**: Domain events decouple services via Observer pattern
- **Type safety**: Strict TypeScript with interfaces and generics
- **Base classes**: Generic CRUD implementations (DRY principle)

---

## 🔐 Security

EvenTask API implements multiple security layers to protect user data and prevent common vulnerabilities.

### Authentication Flow

**JWT Token Strategy:**
- **Access Token**: Short-lived (15 min), sent in `Authorization: Bearer <token>` header
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
- **Automatic Refresh**: 401 responses trigger token renewal on client-side
- **Token Persistence**: Refresh tokens stored in MongoDB with rotation

### Security Features

| Feature                   | Implementation                  | Protection                                       |
| ------------------------- | ------------------------------- | ------------------------------------------------ |
| **CSRF Protection**       | Double-submit cookie pattern    | Validates state-changing operations              |
| **XSS Prevention**        | Access token in memory only     | Never stored in localStorage                     |
| **HTTP-Only Cookies**     | Refresh token in secure cookie  | JavaScript cannot access                         |
| **Input Validation**      | express-validator on all routes | Sanitization and type checking                   |
| **Rate Limiting**         | 500 req/15min per IP            | Prevents brute force and DDoS                    |
| **Password Hashing**      | bcrypt with salt rounds         | Secure password storage                          |
| **WebSocket Auth**        | JWT in connection handshake     | Token validated before connection                |
| **Route Guards**          | validateAccessJWT middleware    | Protects authenticated endpoints                 |
| **CORS**                  | Whitelist origins               | Allows credentials and custom headers            |
| **Database Sanitization** | cleanOutput plugin              | Removes sensitive fields (_id → id, no password) |

### Best Practices Implemented

✅ JWT in Authorization header (not URL/localStorage)  
✅ Refresh token in HTTP-only cookie  
✅ CSRF token for mutations (POST, PUT, DELETE)  
✅ TypeScript strict mode for compile-time safety  
✅ MongoDB transactions for atomic operations  
✅ Automatic response sanitization  

**Security Considerations:**  
⚠️ Always use HTTPS in production  
⚠️ Never commit credentials in `.env`  
⚠️ Rotate JWT secrets periodically  
⚠️ Frontend security complements backend validation  

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

---

<div align="center">

**Built with ❤️ using Node.js, TypeScript, Express, and MongoDB**

[⬆ Back to Top](#-eventask-api)

</div>
