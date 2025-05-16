import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Account } from './Account'
import { Member } from './Member'
import { Organization } from './Organization'
import { Token } from './Token'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  username: string

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null

  @Column({ type: 'varchar', length: 255 })
  password: string

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl: string | null

  @Column({ type: 'varchar', length: 255, default: 'user' })
  role: 'user' | 'admin'

  @Column({ type: 'boolean', default: true })
  active: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @ManyToOne(() => Organization, (org) => org.users, { nullable: true })
  organization: Organization | null

  @Column({ type: 'uuid', name: 'organization_id', nullable: true })
  organizationId: string | null

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[]

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[]

  @OneToMany(() => Member, (member) => member.user)
  memberOn: Member[]
}
