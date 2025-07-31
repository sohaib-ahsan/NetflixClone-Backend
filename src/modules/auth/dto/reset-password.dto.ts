import { IsNotEmpty, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ResetPasswordDto {
  @ApiProperty({ example: "reset-token-here" })
  @IsString()
  @IsNotEmpty()
  token: string

  @ApiProperty({ example: "newPassword123", minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string
}
