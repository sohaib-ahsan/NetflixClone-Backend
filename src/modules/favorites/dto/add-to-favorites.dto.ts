import { IsNotEmpty, IsNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class AddToFavoritesDto {
  @ApiProperty({ example: 550 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  movieId: number
}
