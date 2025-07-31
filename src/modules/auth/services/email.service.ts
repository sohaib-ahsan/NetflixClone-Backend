import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as nodemailer from "nodemailer"
import type { Transporter } from "nodemailer"

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private transporter: Transporter

  constructor(private readonly configService: ConfigService) {
    this.createTransporter()
  }

  private createTransporter() {
    const emailConfig = {
      host: this.configService.get<string>("SMTP_HOST", "smtp.gmail.com"),
      port: this.configService.get<number>("SMTP_PORT", 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>("SMTP_USER"),
        pass: this.configService.get<string>("SMTP_PASS"),
      },
    }

    this.transporter = nodemailer.createTransporter(emailConfig)
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void> {
    const frontendUrl = this.configService.get<string>("FRONTEND_URL", "http://localhost:3000")
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: this.configService.get<string>("SMTP_FROM", "noreply@movieapp.com"),
      to: email,
      subject: "Password Reset Request - Movie App",
      html: this.getPasswordResetEmailTemplate(userName, resetUrl),
    }

    try {
      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Password reset email sent to ${email}`)
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error)
      throw new Error("Failed to send password reset email")
    }
  }

  private getPasswordResetEmailTemplate(userName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
          .content { padding: 20px 0; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
          }
          .footer { font-size: 12px; color: #666; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password for your Movie App account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Movie App Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}
