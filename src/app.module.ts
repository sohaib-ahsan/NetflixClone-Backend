import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { MoviesModule } from "./modules/movies/movies.module"
import { FavoritesModule } from "./modules/favorites/favorites.module"
import { WatchLaterModule } from "./modules/watch-later/watch-later.module"
import { User } from "./modules/users/entities/user.entity"
import { Favorite } from "./modules/favorites/entities/favorite.entity"
import { WatchLater } from "./modules/watch-later/entities/watch-later.entity"
import { PasswordReset } from "./modules/auth/entities/password-reset.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "movie_app"),
        entities: [User, Favorite, WatchLater, PasswordReset],
        synchronize: configService.get("NODE_ENV") !== "production",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    FavoritesModule,
    WatchLaterModule,
  ],
})
export class AppModule {}
