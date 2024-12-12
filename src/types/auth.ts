export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  avatar: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}