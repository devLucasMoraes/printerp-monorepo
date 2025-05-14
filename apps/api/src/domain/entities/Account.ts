import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { AccountProvider } from './AccountProvider'
import { Organization } from './Organization'
import { User } from './User'

@Entity({ name: 'accounts' })
@Unique(['provider', 'userId'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: AccountProvider })
  provider: AccountProvider

  @Column({ name: 'provider_account_id', unique: true })
  providerAccountId: string

  @ManyToOne(() => User, (user) => user.accounts)
  user: User

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => Organization, (org) => org.accounts, { nullable: true })
  organization?: Organization

  @Column({ name: 'organization_id', nullable: true })
  organizationId?: string
}
