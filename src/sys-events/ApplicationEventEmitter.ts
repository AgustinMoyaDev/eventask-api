import { IApplicationEventEmitter } from './IApplicationEventEmitter.js'

type EventCallback = (data: unknown) => void | Promise<void>

/**
 * Application-wide event emitter for decoupled service communication.
 * Implements Observer pattern for notification system integration.
 */
export class ApplicationEventEmitter implements IApplicationEventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map()

  /**
   * Subscribe to specific event type with callback function.
   * @param event - Event name to listen for
   * @param callback - Function to execute when event occurs
   */
  on<T = unknown>(event: string, callback: (data: T) => void | Promise<void>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    const eventCallbacks = this.events.get(event)!
    eventCallbacks.add(callback as EventCallback)
  }

  /**
   * Emit event to all registered subscribers asynchronously.
   * @param event - Event name to emit
   * @param data - Event payload data
   * @returns Promise that resolves when all callbacks complete
   */
  async emit<T = unknown>(event: string, data: T): Promise<void> {
    const callbacks = this.events.get(event) || new Set()
    const callbacksArray = Array.from(callbacks)

    // Execute all callbacks in parallel for performance
    const promises = callbacksArray.map(async (callback, index) => {
      try {
        await callback(data)
      } catch (error) {
        console.error(
          `### Event callback error for event "${event}" (listener ${index + 1}):`,
          error
        )
        // Continue with other callbacks even if one fails
      }
    })

    await Promise.allSettled(promises)
  }

  /**
   * Remove specific callback from event listeners.
   * @param event - Event name to unsubscribe from
   * @param callback - Specific callback function to remove
   */
  off<T = unknown>(event: string, callback: (data: T) => void | Promise<void>): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.delete(callback as EventCallback)
    }
  }

  /**
   * Remove all listeners for specific event type.
   * @param event - Event name to clear all listeners
   */
  removeAllListeners(event: string): void {
    this.events.delete(event)
  }
}
