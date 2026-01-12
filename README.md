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

### 🏗️ Architecture Highlights

- **Layered Architecture**: Controllers → Services → Repositories → Models
- **Dependency Injection**: Centralized singleton container for testability
- **Event-Driven Design**: Observer pattern decouples services via domain events
- **Real-Time Communication**: Socket.io with JWT authentication
- **Automated Scheduling**: Cron-based event reminders

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

This project enforces strict code quality standards using **Husky** and **Commitlint**, following the **GitHub Flow**.
Development focuses on Continuous Integration (CI) and rapid deployment to production.

### Branching Strategy

1.  **Main (`main`)**: The single source of truth. Contains production-ready code. Any merge into this branch triggers an automatic deployment to Netlify. Direct commits to this branch are restricted.
2.  **Feature/Fix Branches**: Short-lived, independent branches created from `main` for specific tasks.

### Branch Naming Convention

We follow a strict convention to link code changes with project issues:

* `feat/feature-name-ID`: For new features.
    * *Example:* `feat/google-auth-login-23`
* `fix/bug-name-ID`: For bug fixes.
    * *Example:* `fix/cors-header-error-12`
* `chore/maintenance-task-ID`: For configuration or maintenance tasks (no production code changes).
    * *Example:* `chore/update-dependencies-45`
* `refactor/description-ID`: For code restructuring without behavior changes.
    * *Example:* `refactor/middleware-organization-24`

### Pre-commit Hooks (Husky)

Before each commit, Husky automatically validates:
- ✅ **Linting** (ESLint)
- ✅ **Type checking** (TypeScript)
- ✅ **Commit message format** (Commitlint)

If validation fails, the commit is blocked. Fix issues and retry.

### Linking Issues

Include `Closes #<issue-number>` in your commit message to auto-close issues:

```bash
git commit -m "feat(auth): add security settings

- Add SetPasswordForm and ChangePasswordForm
- Implement password validation with current password check

Closes #125"
```

### Contribution Cycle

1.  Create an **Issue** describing the task.
2.  Create a local branch following the naming convention.
3.  Develop and commit changes.
4.  Open a **Pull Request (PR)** targeting `main`.
5.  Ensure all **CI Checks** (Netlify Build, Linter) pass successfully.
6.  Perform a **Squash and Merge** into `main`.
7.  Delete the feature branch.

### Commit Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Your commit messages must follow this format:

**Rules:**
* Use the imperative mood in the description ("add" not "added", "fix" not "fixed").
* No period at the end of the subject line.

```bash
Format: <type>(<scope>): <description>

Allowed Types (by impact):

Production Code:
  feat: New feature
  fix: Bug fix
  refactor: Refactoring production code
  perf: Perfomance improvements

Development & Infrastructure:  
  test: Adding tests, refactoring test; no production code change
  build: Chnage to build systems or dependencies
  ci: Changes to CI/CD configuration
  chore: Updating build tasks, package manager configs, etc

Documentation & Style:
  docs: Documentation only changes
  style: Code formatting (no logic change)

# Examples:
feat(auth): add google oauth integration
feat(tasks): implement drag and drop sorting
fix(calendar): resolve event overlap issue
test(mocks): create MSW handlers for API endpoints
build(vite): update to v6.0
chore(deps): update react to v18.3
docs(readme): update installation guide
refactor(hooks): simplify useForm validation logic
perf(table): optimize rendering with useMemo
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
