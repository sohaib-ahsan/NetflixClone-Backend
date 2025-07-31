import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({ example: "password123", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string
}
