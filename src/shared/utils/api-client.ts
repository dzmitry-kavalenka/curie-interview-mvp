const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface ApiClientOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: TBody;
  params?: Record<string, string>;
}

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<TResponse, TBody = unknown>(
    endpoint: string,
    options: ApiClientOptions<TBody> = {}
  ): Promise<ApiResponse<TResponse>> {
    const { method = "GET", headers = {}, body, params } = options;

    try {
      // Build URL with query parameters
      let url = `${this.baseUrl}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };

      // Add body for non-GET requests
      if (body && method !== "GET") {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        return {
          error:
            data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { data };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Convenience methods for common HTTP methods
  async get<TResponse>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { method: "GET", params });
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    params?: Record<string, string>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      method: "POST",
      body,
      params,
    });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    params?: Record<string, string>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      method: "PUT",
      body,
      params,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>(endpoint, { method: "DELETE", params });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    params?: Record<string, string>
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      method: "PATCH",
      body,
      params,
    });
  }
}

// Export a default instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export default ApiClient;
