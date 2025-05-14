import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Organization } from './Organization'
import { TokenType } from './TokenType'
import { User } from './User'

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.tokens)
  user: User

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => Organization, (org) => org.tokens, { nullable: true })
  organization?: Organization

  @Column({ name: 'organization_id', nullable: true })
  organizationId?: string
}
