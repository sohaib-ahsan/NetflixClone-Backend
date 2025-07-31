import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"
import { MoviesService } from "./services/movies.service"
import { MoviesController } from "./controllers/movies.controller"

@Module({
  imports: [HttpModule],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
