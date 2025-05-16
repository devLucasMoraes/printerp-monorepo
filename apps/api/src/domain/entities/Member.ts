import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Organization } from './Organization'
import { Role } from './Role'
import { User } from './User'

@Entity({ name: 'members' })
@Unique(['organization', 'user'])
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
  role: Role

  @ManyToOne(() => Organization, (org) => org.members)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization

  @ManyToOne(() => User, (user) => user.memberOn)
  @JoinColumn({ name: 'user_id' })
  user: User
}
