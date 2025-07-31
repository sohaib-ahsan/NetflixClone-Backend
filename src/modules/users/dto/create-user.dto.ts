import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
