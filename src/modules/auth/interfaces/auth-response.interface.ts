export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    bio?: string
  }
}
