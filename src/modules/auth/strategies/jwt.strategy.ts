import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import type { ConfigService } from "@nestjs/config"
import { ExtractJwt, Strategy } from "passport-jwt"
import type { AuthService } from "../services/auth.service"
import type { JwtPayload } from "../interfaces/jwt-payload.interface"
import type { User } from "../../users/entities/user.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "your-secret-key"),
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateJwtPayload(payload)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
