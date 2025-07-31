import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import type { ConfigService } from "@nestjs/config"
import { firstValueFrom } from "rxjs"
import type { MovieSearchResponse, MovieDetails } from "../interfaces/movie.interface"

@Injectable()
export class MoviesService {
  private readonly baseUrl = "https://api.themoviedb.org/3"
  private readonly apiKey: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>("TMDB_API_KEY")
    if (!this.apiKey) {
      throw new Error("TMDB_API_KEY is required")
    }
  }

  async searchMovies(query: string, page = 1): Promise<MovieSearchResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/search/movie`, {
          params: {
            api_key: this.apiKey,
            query,
            page,
          },
        }),
      )
      return response.data
    } catch (error) {
      throw new HttpException("Failed to search movies", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/movie/${movieId}`, {
          params: {
            api_key: this.apiKey,
          },
        }),
      )
      return response.data
    } catch (error) {
      throw new HttpException("Failed to get movie details", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getPopularMovies(page = 1): Promise<MovieSearchResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/movie/popular`, {
          params: {
            api_key: this.apiKey,
            page,
          },
        }),
      )
      return response.data
    } catch (error) {
      throw new HttpException("Failed to get popular movies", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTrendingMovies(timeWindow: "day" | "week" = "week"): Promise<MovieSearchResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/trending/movie/${timeWindow}`, {
          params: {
            api_key: this.apiKey,
          },
        }),
      )
      return response.data
    } catch (error) {
      throw new HttpException("Failed to get trending movies", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
