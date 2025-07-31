import { Controller, Get, Put, Delete, Body, UseGuards, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { UsersService } from "../services/users.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import type { UpdateUserDto } from "../dto/update-user.dto"
import type { User } from "../entities/user.entity"

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Req() req): Promise<User> {
    return this.usersService.getUserProfile(req.user.id);
  }

  @Put("profile")
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto)
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  async deleteAccount(@Req() req): Promise<{ message: string }> {
    await this.usersService.remove(req.user.id);
    return { message: 'Account deleted successfully' };
  }
}
