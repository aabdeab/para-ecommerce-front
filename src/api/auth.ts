export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class AuthAPI {
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return response.json();
  }

  async login(loginData: LoginRequest): Promise<string> {
    const response = await this.request<ApiResponse<string>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }

    return response.data;
  }

  async register(registerData: RegisterRequest): Promise<string> {
    const response = await this.request<ApiResponse<string>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }

    return response.data;
  }
}

export const authAPI = new AuthAPI();