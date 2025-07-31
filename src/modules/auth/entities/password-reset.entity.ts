import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("password_resets")
export class PasswordReset {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column()
  token: string

  @Column({ type: "timestamp" })
  expiresAt: Date

  @Column({ default: false })
  isUsed: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User
}
