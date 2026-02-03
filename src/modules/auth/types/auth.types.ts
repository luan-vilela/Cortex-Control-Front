export interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
  role: string;
  provider?: string;
  socialId?: string;
  avatar?: string;
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  companyId?: string;
  companyName?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface DeactivateAccountDto {
  password: string;
}
