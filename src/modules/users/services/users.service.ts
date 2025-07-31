import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { User } from "../entities/user.entity"
import type { CreateUserDto } from "../dto/create-user.dto"
import type { UpdateUserDto } from "../dto/update-user.dto"

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    })

    if (existingUser) {
      throw new ConflictException("User with this email already exists")
    }

    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundException("User not found")
    }

    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException("User not found")
    }
  }

  async getUserProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["favorites", "watchLater"],
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const result = await this.userRepository.update(id, { password: hashedPassword })
    if (result.affected === 0) {
      throw new NotFoundException("User not found")
    }
  }
}
