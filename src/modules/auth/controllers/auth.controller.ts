import { Controller, Post, Get } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { AuthService } from "../services/auth.service"
import type { LoginDto } from "../dto/login.dto"
import type { RegisterDto } from "../dto/register.dto"
import type { AuthResponse } from "../interfaces/auth-response.interface"
import type { ForgotPasswordDto } from "../dto/forgot-password.dto"
import type { ResetPasswordDto } from "../dto/reset-password.dto"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto)
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "Registration successful" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto)
  }

  @Post("forgot-password")
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent if email exists" })
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password with token" })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  @ApiResponse({ status: 400, description: "Invalid or expired token" })
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Get("validate-reset-token")
  @ApiOperation({ summary: "Validate password reset token" })
  @ApiResponse({ status: 200, description: "Token validation result" })
  async validateResetToken(token: string): Promise<{ valid: boolean; expired?: boolean }> {
    return this.authService.validatePasswordResetToken(token)
  }
}
