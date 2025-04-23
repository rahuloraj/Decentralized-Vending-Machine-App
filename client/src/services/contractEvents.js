/**
 * Simple event system for contract-related events
 * Allows components to subscribe to and be notified of blockchain transactions
 */
const contractEvents = {
  listeners: {},
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  },
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }
};

export default contractEvents;