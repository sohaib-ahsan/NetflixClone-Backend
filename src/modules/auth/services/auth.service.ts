import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import * as crypto from "crypto"
import type { Repository } from "typeorm"
import type { UsersService } from "../../users/services/users.service"
import type { User } from "../../users/entities/user.entity"
import type { LoginDto } from "../dto/login.dto"
import type { RegisterDto } from "../dto/register.dto"
import type { JwtPayload } from "../interfaces/jwt-payload.interface"
import type { AuthResponse } from "../interfaces/auth-response.interface"
import type { PasswordReset } from "../entities/password-reset.entity"
import type { EmailService } from "./email.service"
import type { ForgotPasswordDto } from "../dto/forgot-password.dto"
import type { ResetPasswordDto } from "../dto/reset-password.dto"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user
    }
    return null
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload: JwtPayload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
      },
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 12)

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    })

    const payload: JwtPayload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
      },
    }
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub)
    if (!user) {
      throw new UnauthorizedException("User not found")
    }
    return user
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email)
    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: "If the email exists, a password reset link has been sent." }
    }

    // Invalidate any existing password reset tokens for this user
    await this.passwordResetRepository.update({ userId: user.id, isUsed: false }, { isUsed: true })

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Save the password reset token
    const passwordReset = this.passwordResetRepository.create({
      userId: user.id,
      token: resetToken,
      expiresAt,
    })
    await this.passwordResetRepository.save(passwordReset)

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.fullName)
    } catch (error) {
      // Log error but don't reveal email sending failure to user
      console.error("Failed to send password reset email:", error)
    }

    return { message: "If the email exists, a password reset link has been sent." }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto

    // Find the password reset token
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token, isUsed: false },
      relations: ["user"],
    })

    if (!passwordReset) {
      throw new BadRequestException("Invalid or expired reset token")
    }

    // Check if token has expired
    if (new Date() > passwordReset.expiresAt) {
      throw new BadRequestException("Reset token has expired")
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user's password
    await this.usersService.updatePassword(passwordReset.userId, hashedPassword)

    // Mark the token as used
    passwordReset.isUsed = true
    await this.passwordResetRepository.save(passwordReset)

    return { message: "Password has been reset successfully" }
  }

  async validatePasswordResetToken(token: string): Promise<{ valid: boolean; expired?: boolean }> {
    const passwordReset = await this.passwordResetRepository.findOne({
      where: { token, isUsed: false },
    })

    if (!passwordReset) {
      return { valid: false }
    }

    if (new Date() > passwordReset.expiresAt) {
      return { valid: false, expired: true }
    }

    return { valid: true }
  }
}
