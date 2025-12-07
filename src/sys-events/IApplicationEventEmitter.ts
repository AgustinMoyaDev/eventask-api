/**
 * Contract for application-wide event management.
 * Enables loose coupling between services through event-driven architecture.
 */
export interface IApplicationEventEmitter {
  /**
   * Subscribe to specific event type with callback function.
   * @param event - Event name to listen for
   * @param callback - Function to execute when event occurs
   */
  on<T = unknown>(event: string, callback: (data: T) => void | Promise<void>): void

  /**
   * Emit event to all registered subscribers.
   * @param event - Event name to emit
   * @param data - Event payload data
   * @returns Promise that resolves when all callbacks complete
   */
  emit<T = unknown>(event: string, data: T): Promise<void>

  /**
   * Remove specific callback from event listeners.
   * @param event - Event name to unsubscribe from
   * @param callback - Specific callback function to remove
   */
  off<T = unknown>(event: string, callback: (data: T) => void | Promise<void>): void

  /**
   * Remove all listeners for specific event type.
   * @param event - Event name to clear all listeners
   */
  removeAllListeners(event: string): void
}
