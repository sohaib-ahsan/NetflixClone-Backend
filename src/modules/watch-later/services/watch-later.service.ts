import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { WatchLater } from "../entities/watch-later.entity"
import type { MoviesService } from "../../movies/services/movies.service"
import type { AddToWatchLaterDto } from "../dto/add-to-watch-later.dto"
import type { PaginationDto } from "../../../common/dto/pagination.dto"

@Injectable()
export class WatchLaterService {
  constructor(
    private readonly watchLaterRepository: Repository<WatchLater>,
    private readonly moviesService: MoviesService,
  ) {}

  async addToWatchLater(userId: string, addToWatchLaterDto: AddToWatchLaterDto): Promise<WatchLater> {
    const existingWatchLater = await this.watchLaterRepository.findOne({
      where: { userId, movieId: addToWatchLaterDto.movieId },
    })

    if (existingWatchLater) {
      throw new ConflictException("Movie is already in watch later list")
    }

    // Get movie details from TMDB
    const movieDetails = await this.moviesService.getMovieDetails(addToWatchLaterDto.movieId)

    const watchLater = this.watchLaterRepository.create({
      userId,
      movieId: addToWatchLaterDto.movieId,
      movieTitle: movieDetails.title,
      moviePoster: movieDetails.poster_path,
      movieRating: movieDetails.vote_average,
      movieYear: movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : null,
    })

    return this.watchLaterRepository.save(watchLater)
  }

  async removeFromWatchLater(userId: string, movieId: number): Promise<void> {
    const result = await this.watchLaterRepository.delete({ userId, movieId })
    if (result.affected === 0) {
      throw new NotFoundException("Watch later item not found")
    }
  }

  async getUserWatchLater(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<{
    watchLater: WatchLater[]
    total: number
    page: number
    totalPages: number
  }> {
    const { page = 1, limit = 10 } = paginationDto
    const skip = (page - 1) * limit

    const [watchLater, total] = await this.watchLaterRepository.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    })

    return {
      watchLater,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async isMovieInWatchLater(userId: string, movieId: number): Promise<boolean> {
    const watchLater = await this.watchLaterRepository.findOne({
      where: { userId, movieId },
    })
    return !!watchLater
  }
}
