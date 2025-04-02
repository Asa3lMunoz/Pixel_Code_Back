export interface User {
  uid?: string;
  email: string;
  password?: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  disabled?: boolean;
  emailVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  details?: string;
  message?: string;
}
