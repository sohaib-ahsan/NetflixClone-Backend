import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { MoviesService } from "../services/movies.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { MovieSearchResponse, MovieDetails } from "../interfaces/movie.interface"

@ApiTags("Movies")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("movies")
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get("search")
  @ApiOperation({ summary: "Search movies" })
  @ApiResponse({ status: 200, description: "Movies found successfully" })
  async searchMovies(query: string, page = 1): Promise<MovieSearchResponse> {
    return this.moviesService.searchMovies(query, page)
  }

  @Get("popular")
  @ApiOperation({ summary: "Get popular movies" })
  @ApiResponse({ status: 200, description: "Popular movies retrieved successfully" })
  async getPopularMovies(page = 1): Promise<MovieSearchResponse> {
    return this.moviesService.getPopularMovies(page)
  }

  @Get("trending")
  @ApiOperation({ summary: "Get trending movies" })
  @ApiResponse({ status: 200, description: "Trending movies retrieved successfully" })
  async getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<MovieSearchResponse> {
    return this.moviesService.getTrendingMovies(timeWindow)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie details' })
  @ApiResponse({ status: 200, description: 'Movie details retrieved successfully' })
  async getMovieDetails(@Param('id') id: number): Promise<MovieDetails> {
    return this.moviesService.getMovieDetails(id);
  }
}
