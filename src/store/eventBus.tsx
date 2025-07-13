export type EventCallback = (...args: any[]) => void;

class EventBus {
  private listeners: { [event: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  once(event: string, callback: EventCallback): void {
    const wrapperCallback: EventCallback = (...args) => {
      callback(...args);
      this.off(event, wrapperCallback);
    };
    this.on(event, wrapperCallback);
  }

  off(event: string, callback?: EventCallback): void {
    if (!this.listeners[event]) return;
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
    } else {
      delete this.listeners[event];
    }
  }

  emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }
}

export const eventBus = new EventBus();