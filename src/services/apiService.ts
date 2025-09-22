import { logNetworkRequest, logNetworkResponse, NETWORK_CONFIG, NETWORK_ERRORS } from "../config/network";

const API_BASE_URL = NETWORK_CONFIG.BASE_URL;

interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  user?: T;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      logNetworkRequest(url, config);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.TIMEOUT);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      let data: ApiResponse<T>;
      
      try {
        data = await response.json();
        logNetworkResponse(response, data);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        const textResponse = await response.text();
        console.log("Raw response text:", textResponse);
        throw new Error(NETWORK_ERRORS.INVALID_RESPONSE);
      }

      if (!response.ok) {
        const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(NETWORK_ERRORS.TIMEOUT);
        } else if (error.message.includes('Network request failed')) {
          throw new Error(NETWORK_ERRORS.NETWORK_FAILED);
        } else if (error.message.includes('CORS')) {
          throw new Error(NETWORK_ERRORS.CORS_ERROR);
        }
      }
      
      throw error;
    }
  }

  async signup(userData: {
    firebaseUid: string;
    profilePicture: string; // Backend expects 'profilePicture'
    fullName: string;
    mobileNo: string; // Backend expects 'mobileNo'
    location: {
      country: string;
      state: string;
    }; // Backend expects location as object
    status: string;
    isVerified: boolean;
    isActive: boolean;
  }): Promise<ApiResponse> {
    return this.makeRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(mobileNo: string): Promise<ApiResponse> {
    try {
      return await this.makeRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ mobileNo }),
      });
    } catch (error) {
      console.error("🚨 API Login failed:", error);
      
      // If it's a network error, try with HTTP as fallback
      if (error instanceof Error && 
          (error.message.includes('Network request failed') || 
           error.message.includes('timeout') ||
           error.message.includes('CORS') ||
           error.message.includes('Network error'))) {
        console.log("🔄 Attempting fallback to HTTP...");
        
        // Try HTTP fallback
        const fallbackUrl = API_BASE_URL.replace('https://', 'http://');
        
        try {
          const response = await fetch(`${fallbackUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ mobileNo }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Fallback HTTP request successful");
            return data;
          } else {
            console.error("❌ Fallback HTTP request failed with status:", response.status);
            const errorText = await response.text();
            console.error("❌ Error response:", errorText);
          }
        } catch (fallbackError) {
          console.error("❌ Fallback HTTP request also failed:", fallbackError);
        }
      }
      
      throw error;
    }
  }

  async filterContacts(phoneNumbers: string[]): Promise<ApiResponse> {
    return this.makeRequest("/contacts/filter", {
      method: "POST",
      body: JSON.stringify({ phoneNumbers }),
    });
  }
}

export const apiService = new ApiService();
