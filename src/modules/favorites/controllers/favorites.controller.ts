import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { FavoritesService } from "../services/favorites.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { AddToFavoritesDto } from "../dto/add-to-favorites.dto"
import type { PaginationDto } from "../../../common/dto/pagination.dto"
import type { Favorite } from "../entities/favorite.entity"

@ApiTags("Favorites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: "Add movie to favorites" })
  @ApiResponse({ status: 201, description: "Movie added to favorites successfully" })
  @ApiResponse({ status: 409, description: "Movie is already in favorites" })
  async addToFavorites(req, @Body() addToFavoritesDto: AddToFavoritesDto): Promise<Favorite> {
    return this.favoritesService.addToFavorites(req.user.id, addToFavoritesDto)
  }

  @Delete(":movieId")
  @ApiOperation({ summary: "Remove movie from favorites" })
  @ApiResponse({ status: 200, description: "Movie removed from favorites successfully" })
  @ApiResponse({ status: 404, description: "Favorite not found" })
  async removeFromFavorites(req, @Param('movieId') movieId: number): Promise<{ message: string }> {
    await this.favoritesService.removeFromFavorites(req.user.id, movieId)
    return { message: "Movie removed from favorites successfully" }
  }

  @Get()
  @ApiOperation({ summary: "Get user favorites" })
  @ApiResponse({ status: 200, description: "Favorites retrieved successfully" })
  async getUserFavorites(
    req,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    favorites: Favorite[]
    total: number
    page: number
    totalPages: number
  }> {
    return this.favoritesService.getUserFavorites(req.user.id, paginationDto)
  }

  @Get("check/:movieId")
  @ApiOperation({ summary: "Check if movie is in favorites" })
  @ApiResponse({ status: 200, description: "Check completed successfully" })
  async isMovieInFavorites(req, @Param('movieId') movieId: number): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.favoritesService.isMovieInFavorites(req.user.id, movieId)
    return { isFavorite }
  }
}
