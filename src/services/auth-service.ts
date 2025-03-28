import api from "../utils/api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials)
    localStorage.setItem("token", response.data.token)
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data)
    localStorage.setItem("token", response.data.token)
    return response.data
  },

  logout: (): void => {
    localStorage.removeItem("token")
  },

  getCurrentUser: async (): Promise<AuthResponse["user"] | null> => {
    try {
      const response = await api.get<AuthResponse["user"]>("/auth/me")
      return response.data
    } catch (error) {
      return null
    }
  },
}

export default AuthService

