import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Favorite } from "../entities/favorite.entity"
import type { MoviesService } from "../../movies/services/movies.service"
import type { AddToFavoritesDto } from "../dto/add-to-favorites.dto"
import type { PaginationDto } from "../../../common/dto/pagination.dto"

@Injectable()
export class FavoritesService {
  private readonly favoriteRepository: Repository<Favorite>
  private readonly moviesService: MoviesService

  constructor(favoriteRepository: Repository<Favorite>, moviesService: MoviesService) {
    this.favoriteRepository = favoriteRepository
    this.moviesService = moviesService
  }

  async addToFavorites(userId: string, addToFavoritesDto: AddToFavoritesDto): Promise<Favorite> {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { userId, movieId: addToFavoritesDto.movieId },
    })

    if (existingFavorite) {
      throw new ConflictException("Movie is already in favorites")
    }

    // Get movie details from TMDB
    const movieDetails = await this.moviesService.getMovieDetails(addToFavoritesDto.movieId)

    const favorite = this.favoriteRepository.create({
      userId,
      movieId: addToFavoritesDto.movieId,
      movieTitle: movieDetails.title,
      moviePoster: movieDetails.poster_path,
      movieRating: movieDetails.vote_average,
      movieYear: movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : null,
    })

    return this.favoriteRepository.save(favorite)
  }

  async removeFromFavorites(userId: string, movieId: number): Promise<void> {
    const result = await this.favoriteRepository.delete({ userId, movieId })
    if (result.affected === 0) {
      throw new NotFoundException("Favorite not found")
    }
  }

  async getUserFavorites(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    favorites: Favorite[]
    total: number
    page: number
    totalPages: number
  }> {
    const { page = 1, limit = 10 } = paginationDto
    const skip = (page - 1) * limit

    const [favorites, total] = await this.favoriteRepository.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    })

    return {
      favorites,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async isMovieInFavorites(userId: string, movieId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, movieId },
    })
    return !!favorite
  }
}
