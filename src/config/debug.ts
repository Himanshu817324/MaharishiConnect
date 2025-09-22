// Debug configuration for release builds
export const DEBUG_CONFIG = {
  // Enable detailed logging in release builds for debugging
  ENABLE_RELEASE_LOGS: true,
  
  // Log levels
  LOG_LEVEL: {
    ERROR: true,
    WARN: true,
    INFO: true,
    DEBUG: true,
  },
  
  // Network debugging
  LOG_NETWORK_REQUESTS: true,
  LOG_NETWORK_RESPONSES: true,
  
  // Firebase debugging
  LOG_FIREBASE_AUTH: true,
  
  // Redux debugging
  LOG_REDUX_ACTIONS: true,
};

// Enhanced console logging for release builds
export const debugLog = (level: 'error' | 'warn' | 'info' | 'debug', message: string, data?: any) => {
  if (!DEBUG_CONFIG.ENABLE_RELEASE_LOGS) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case 'error':
      if (DEBUG_CONFIG.LOG_LEVEL.ERROR) {
        console.error(prefix, message, data || '');
      }
      break;
    case 'warn':
      if (DEBUG_CONFIG.LOG_LEVEL.WARN) {
        console.warn(prefix, message, data || '');
      }
      break;
    case 'info':
      if (DEBUG_CONFIG.LOG_LEVEL.INFO) {
        console.log(prefix, message, data || '');
      }
      break;
    case 'debug':
      if (DEBUG_CONFIG.LOG_LEVEL.DEBUG) {
        console.log(prefix, message, data || '');
      }
      break;
  }
};

// Network debugging helper
export const logNetworkCall = (url: string, method: string, data?: any) => {
  if (DEBUG_CONFIG.LOG_NETWORK_REQUESTS) {
    debugLog('info', `🌐 ${method} ${url}`, data);
  }
};

// Firebase debugging helper
export const logFirebaseAuth = (action: string, data?: any) => {
  if (DEBUG_CONFIG.LOG_FIREBASE_AUTH) {
    debugLog('info', `🔥 Firebase Auth: ${action}`, data);
  }
};
