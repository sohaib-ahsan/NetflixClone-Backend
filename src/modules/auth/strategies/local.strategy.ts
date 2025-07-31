import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import type { AuthService } from "../services/auth.service"
import type { User } from "../../users/entities/user.entity"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "email" })
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return user
  }
}
