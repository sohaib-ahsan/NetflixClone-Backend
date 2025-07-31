import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FavoritesService } from "./services/favorites.service"
import { FavoritesController } from "./controllers/favorites.controller"
import { Favorite } from "./entities/favorite.entity"
import { MoviesModule } from "../movies/movies.module"

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), MoviesModule],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}
