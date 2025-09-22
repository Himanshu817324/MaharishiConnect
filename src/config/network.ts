// Network configuration and debugging utilities

export const NETWORK_CONFIG = {
  BASE_URL: "http://65.1.30.2:3000/api", // Using HTTP since server doesn't support HTTPS
  TIMEOUT: 15000, // 15 seconds for better reliability
  RETRY_ATTEMPTS: 3,
};

// Network debugging utility
export const logNetworkRequest = (url: string, config: RequestInit) => {
  console.log("🌐 Network Request:");
  console.log("URL:", url);
  console.log("Method:", config.method || "GET");
  console.log("Headers:", config.headers);
  console.log("Body:", config.body);
};

export const logNetworkResponse = (response: Response, data?: any) => {
  console.log("📡 Network Response:");
  console.log("Status:", response.status);
  console.log("Status Text:", response.statusText);
  console.log("Headers:", Object.fromEntries(response.headers.entries()));
  console.log("Data:", data);
};

// Common network error messages
export const NETWORK_ERRORS = {
  TIMEOUT: "Request timeout: Please check your internet connection",
  NETWORK_FAILED: "Network error: Please check your internet connection",
  CORS_ERROR: "Server configuration error: Please contact support",
  SERVER_ERROR: "Server error: Please try again later",
  INVALID_RESPONSE: "Invalid response from server",
};

// Network status checker (you can implement this with NetInfo if needed)
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch("https://www.google.com", {
      method: "HEAD",
      mode: "no-cors",
    });
    return true;
  } catch {
    return false;
  }
};
