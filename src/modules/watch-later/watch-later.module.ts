import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { WatchLaterService } from "./services/watch-later.service"
import { WatchLaterController } from "./controllers/watch-later.controller"
import { WatchLater } from "./entities/watch-later.entity"
import { MoviesModule } from "../movies/movies.module"

@Module({
  imports: [TypeOrmModule.forFeature([WatchLater]), MoviesModule],
  providers: [WatchLaterService],
  controllers: [WatchLaterController],
  exports: [WatchLaterService],
})
export class WatchLaterModule {}
