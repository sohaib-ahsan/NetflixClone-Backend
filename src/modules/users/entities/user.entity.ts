import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Exclude } from "class-transformer"
import { Favorite } from "../../favorites/entities/favorite.entity"
import { WatchLater } from "../../watch-later/entities/watch-later.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ nullable: true })
  bio?: string

  @Column()
  @Exclude()
  password: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => Favorite,
    (favorite) => favorite.user,
  )
  favorites: Favorite[]

  @OneToMany(
    () => WatchLater,
    (watchLater) => watchLater.user,
  )
  watchLater: WatchLater[]

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
