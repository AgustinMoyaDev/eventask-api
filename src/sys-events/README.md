# 🎯 System Events Architecture

## 📋 Overview

This document describes the aligned architecture between **System Events** and **Notifications** following professional industry standards.

## 🏗️ Architecture Alignment

### **Event Namespaces → Notification Types**

```typescript
// Event namespaces (lowercase with colons)
'invitation:*' → NOTIFICATION_TYPE.INVITATION
'task:*'       → NOTIFICATION_TYPE.TASK
'event:*'      → NOTIFICATION_TYPE.EVENT
'system:*'     → NOTIFICATION_TYPE.SYSTEM
```

## 📊 Domain Mapping

### **Invitation Domain**

```typescript
// Events
'invitation:accepted' → InvitationAcceptedEvent
'invitation:rejected' → InvitationRejectedEvent
'invitation:sent'     → InvitationSentEvent

// Notifications
NOTIFICATION_TYPE.INVITATION → "invitation"
```

### **Task Domain**

```typescript
// Events
'task:assigned'   → TaskAssignedEvent
'task:completed'  → TaskCompletedEvent
'task:due_soon'   → TaskDueSoonEvent

// Notifications
NOTIFICATION_TYPE.TASK → "task"
```

### **Event Domain** (Calendar Events)

```typescript
// Events
'event:reminder' → EventReminderEvent
'event:created'  → EventCreatedEvent
'event:updated'  → EventUpdatedEvent

// Notifications
NOTIFICATION_TYPE.EVENT → "event"
```

### **System Domain**

```typescript
// Events
'system:maintenance' → SystemMaintenanceEvent
'system:update'      → SystemUpdateEvent
'user:registered'    → UserRegisteredEvent
'user:profile_updated' → UserProfileUpdatedEvent

// Notifications
NOTIFICATION_TYPE.SYSTEM → "system"
```

## 🔄 Event Flow

```
1. Domain Action → 2. System Event → 3. Event Subscriber → 4. Notification Created

   Example:
   User accepts     invitation:accepted    NotificationEvent    Create notification
   invitation    →     event emitted    →    Subscriber      →   with type "invitation"
```

## 🛠️ Usage Examples

### **Creating Notifications from Events**

```typescript
import { getNotificationTypeFromEvent } from 'sys-events/utils/eventNotificationMapping'

// Event occurs
const eventName = EVENT_NAMES.INVITATION_ACCEPTED
const notificationType = getNotificationTypeFromEvent(eventName)
// Result: NOTIFICATION_TYPE.INVITATION

// Create notification
await notificationService.create({
  userId: targetUserId,
  type: notificationType, // "invitation"
  title: 'Invitation Accepted',
  message: 'John accepted your invitation',
})
```

### **Type-Safe Event Handling**

```typescript
// All event names are type-safe
type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES]
// Result: "invitation:accepted" | "task:assigned" | "event:reminder" | ...

// All notification types are aligned
type NotificationType = NOTIFICATION_TYPE
// Result: "invitation" | "task" | "event" | "system"
```

### **Using the Helper Class**

```typescript
import { NotificationFromEventHelper } from 'sys-events/utils/NotificationFromEventHelper'

// Simple notification
const notificationDto = NotificationFromEventHelper.createNotificationDto(
  EVENT_NAMES.INVITATION_ACCEPTED,
  {
    userId: inviter.id,
    title: 'Invitation Accepted',
    message: `${user.name} accepted your invitation`,
    data: { invitationId: '123' },
  }
)

// Multiple users notification
const notifications = NotificationFromEventHelper.createMultipleNotificationDtos(
  EVENT_NAMES.SYSTEM_MAINTENANCE,
  {
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight',
    data: { maintenanceId: '456' },
  },
  ['user1', 'user2', 'user3']
)
```

## 📁 File Structure

```
src/sys-events/
├── ApplicationEventEmitter.ts          # Main event emitter implementation
├── IApplicationEventEmitter.ts         # Event emitter interface
├── subscribers/
│   └── NotificationEventSubscribers.ts # Notification event handlers
├── types/
│   └── sys-events.ts                   # Event types and constants
└── utils/
    ├── eventNotificationMapping.ts     # Event → Notification type mapping
    └── NotificationFromEventHelper.ts  # Helper for creating notifications
```

## 🔧 Adding New Events

### **1. Define the event interface**

```typescript
// sys-events/types/sys-events.ts
export interface TaskCompletedEvent {
  taskId: string
  completedBy: string
  taskTitle: string
  completedAt: Date
}
```

### **2. Add to EVENT_NAMES**

```typescript
export const EVENT_NAMES = {
  // ... existing events
  TASK_COMPLETED: 'task:completed',
} as const
```

### **3. Update the mapping**

```typescript
// sys-events/utils/eventNotificationMapping.ts
export const EVENT_TO_NOTIFICATION_TYPE_MAP = {
  // ... existing mappings
  [EVENT_NAMES.TASK_COMPLETED]: NOTIFICATION_TYPE.TASK,
} as const
```

### **4. Add subscriber (if needed)**

```typescript
// sys-events/subscribers/NotificationEventSubscribers.ts
this.eventEmitter.on<TaskCompletedEvent>(
  EVENT_NAMES.TASK_COMPLETED,
  this.handleTaskCompleted.bind(this)
)
```

## ✅ Benefits

1. **Consistency**: Event namespaces align with notification types
2. **Scalability**: Easy to add new domains without breaking existing code
3. **Type Safety**: Compile-time validation of event→notification mapping
4. **Maintainability**: Clear separation of concerns and predictable patterns
5. **Industry Standards**: Follows established naming conventions
6. **Domain Separation**: Clear distinction between system events and calendar events

## 🔮 Future Extensions

```typescript
// Easy to add new domains
export const EVENT_NAMES = {
  // New domain: User Management
  'user:role_changed'     → UserRoleChangedEvent
  'user:permissions_updated' → UserPermissionsUpdatedEvent

  // New domain: Billing
  'billing:payment_received' → PaymentReceivedEvent
  'billing:subscription_expired' → SubscriptionExpiredEvent
}

export enum NOTIFICATION_TYPE {
  USER = 'user',        // ← New notification type
  BILLING = 'billing',  // ← New notification type
}
```

## 🎯 Key Differences

### **System Events (`sys-events/`) vs Calendar Events (`events/`)**

```typescript
// System Events (Infrastructure)
sys-events/
├── invitation:accepted    # Application event
├── task:assigned         # Application event
└── user:registered       # Application event

// Calendar Events (Domain entities) - Future
events/
├── Event.ts              # Calendar event entity
├── EventController.ts    # Calendar event endpoints
└── EventService.ts       # Calendar event business logic
```

This architecture scales naturally as the application grows and provides clear separation between system infrastructure events and business domain entities! 🚀
