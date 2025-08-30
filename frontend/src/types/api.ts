// src/types/api.ts
export interface SignUpResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
