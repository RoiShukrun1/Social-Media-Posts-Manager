/**
 * Custom event types for window events
 */

// Define custom event map
export interface CustomEventMap {
  openAddPostModal: CustomEvent;
}

// Extend global WindowEventMap to include custom events
declare global {
  interface WindowEventMap extends CustomEventMap {}
}

// Export empty object to make this a module
export {};
