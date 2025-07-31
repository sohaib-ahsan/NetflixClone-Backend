export interface PasswordResetResponse {
  message: string
}

export interface TokenValidationResponse {
  valid: boolean
  expired?: boolean
}
