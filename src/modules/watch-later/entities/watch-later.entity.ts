import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("watch_later")
@Index(["userId", "movieId"], { unique: true })
export class WatchLater {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column("int")
  movieId: number

  @Column()
  movieTitle: string

  @Column({ nullable: true })
  moviePoster?: string

  @Column("decimal", { precision: 3, scale: 1, nullable: true })
  movieRating?: number

  @Column("int", { nullable: true })
  movieYear?: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.watchLater,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  user: User
}
