# NestJS Movie App

A comprehensive NestJS application with authentication, user profile management, and movie favorites/watch later functionality using The Movie Database (TMDB) API.

## Features

- **Authentication**: JWT-based authentication with registration, login, and password reset
- **User Management**: Profile management with CRUD operations
- **Movie Integration**: Integration with TMDB API for movie data
- **Favorites**: Add/remove movies to/from favorites list
- **Watch Later**: Add/remove movies to/from watch later list
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with TypeORM
- **Validation**: Request validation using class-validator
- **Security**: Password hashing with bcrypt

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **External API**: The Movie Database (TMDB)

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Fill in your database credentials, TMDB API key, and email configuration.

4. Set up PostgreSQL database:
   \`\`\`bash
   # Create database using the provided SQL script
   psql -U postgres -f scripts/create-database.sql
   \`\`\`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/validate-reset-token` - Validate password reset token

### Users
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/profile` - Delete user account

### Movies
- `GET /movies/search` - Search movies
- `GET /movies/popular` - Get popular movies
- `GET /movies/trending` - Get trending movies
- `GET /movies/:id` - Get movie details

### Favorites
- `POST /favorites` - Add movie to favorites
- `GET /favorites` - Get user favorites
- `DELETE /favorites/:movieId` - Remove from favorites
- `GET /favorites/check/:movieId` - Check if movie is in favorites

### Watch Later
- `POST /watch-later` - Add movie to watch later
- `GET /watch-later` - Get user watch later list
- `DELETE /watch-later/:movieId` - Remove from watch later
- `GET /watch-later/check/:movieId` - Check if movie is in watch later

## Best Practices Implemented

- **Modular Architecture**: Organized into feature modules
- **DTOs**: Request/response validation and transformation
- **Guards**: JWT authentication protection
- **Services**: Business logic separation
- **Entities**: Database models with relationships
- **Error Handling**: Proper HTTP exceptions
- **Documentation**: Swagger API documentation
- **Security**: Password hashing and JWT tokens
- **Validation**: Input validation with decorators
- **Database**: Proper indexing and relationships

## License

This project is licensed under the MIT License.
