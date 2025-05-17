import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Account } from './Account'
import { Member } from './Member'
import { Token } from './Token'
import { User } from './User'

@Entity({ name: 'organizations' })
@Index('IDX_ORGANIZATION_SLUG', ['slug'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  domain: string | null

  @Column({
    type: 'boolean',
    name: 'should_attach_users_by_domain',
    default: false,
  })
  shouldAttachUsersByDomain: boolean

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl: string | null

  @Column({ type: 'boolean', default: true })
  active: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Token, (token) => token.organization)
  tokens: Token[]

  @OneToMany(() => Account, (account) => account.organization)
  accounts: Account[]

  @OneToMany(() => Member, (member) => member.organization)
  members: Member[]

  @OneToMany(() => User, (user) => user.organization)
  users: User[]
}
