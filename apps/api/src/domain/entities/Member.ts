import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Organization } from './Organization'
import { Role } from './Role'
import { User } from './User'

@Entity({ name: 'members' })
@Unique(['organizationId', 'userId'])
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
  role: Role

  @ManyToOne(() => Organization, (org) => org.members)
  organization: Organization

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string

  @ManyToOne(() => User, (user) => user.memberOn)
  user: User

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string
}
