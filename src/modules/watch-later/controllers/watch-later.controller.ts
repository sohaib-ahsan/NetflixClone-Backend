import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { WatchLaterService } from "../services/watch-later.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { AddToWatchLaterDto } from "../dto/add-to-watch-later.dto"
import type { PaginationDto } from "../../../common/dto/pagination.dto"
import type { WatchLater } from "../entities/watch-later.entity"

@ApiTags("Watch Later")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("watch-later")
export class WatchLaterController {
  constructor(private readonly watchLaterService: WatchLaterService) {}

  @Post()
  @ApiOperation({ summary: "Add movie to watch later" })
  @ApiResponse({ status: 201, description: "Movie added to watch later successfully" })
  @ApiResponse({ status: 409, description: "Movie is already in watch later list" })
  async addToWatchLater(@Req() req, @Body() addToWatchLaterDto: AddToWatchLaterDto): Promise<WatchLater> {
    return this.watchLaterService.addToWatchLater(req.user.id, addToWatchLaterDto)
  }

  @Delete(":movieId")
  @ApiOperation({ summary: "Remove movie from watch later" })
  @ApiResponse({ status: 200, description: "Movie removed from watch later successfully" })
  @ApiResponse({ status: 404, description: "Watch later item not found" })
  async removeFromWatchLater(@Req() req, @Param('movieId') movieId: number): Promise<{ message: string }> {
    await this.watchLaterService.removeFromWatchLater(req.user.id, movieId)
    return { message: "Movie removed from watch later successfully" }
  }

  @Get()
  @ApiOperation({ summary: "Get user watch later list" })
  @ApiResponse({ status: 200, description: "Watch later list retrieved successfully" })
  async getUserWatchLater(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<{
    watchLater: WatchLater[]
    total: number
    page: number
    totalPages: number
  }> {
    return this.watchLaterService.getUserWatchLater(req.user.id, paginationDto)
  }

  @Get("check/:movieId")
  @ApiOperation({ summary: "Check if movie is in watch later" })
  @ApiResponse({ status: 200, description: "Check completed successfully" })
  async isMovieInWatchLater(@Req() req, @Param('movieId') movieId: number): Promise<{ isInWatchLater: boolean }> {
    const isInWatchLater = await this.watchLaterService.isMovieInWatchLater(req.user.id, movieId)
    return { isInWatchLater }
  }
}
