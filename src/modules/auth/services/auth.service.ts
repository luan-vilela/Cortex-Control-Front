import {
  AuthResponse,
  ChangePasswordDto,
  DeactivateAccountDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  User,
} from '../types/auth.types'

import api from '@/lib/api'

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.patch<User>('/auth/profile', data)
    return response.data
  },

  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>('/auth/password', data)
    return response.data
  },

  async deactivateAccount(data: DeactivateAccountDto): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>('/auth/account', {
      data,
    })
    return response.data
  },

  loginWithGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  },

  loginWithFacebook() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/logout'
    }
  },
}
