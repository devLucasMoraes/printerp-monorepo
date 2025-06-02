import { hash } from 'bcryptjs'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateUserDTO } from '@/http/routes/user/create-organizational-user'

import { User, UserType } from '../../entities/User'

export const createOrganizationalUserUseCase = {
  async execute(dto: CreateUserDTO, membership: Member): Promise<User> {
    return repository.user.manager.transaction(async (manager) => {
      const existingUser = await manager
        .createQueryBuilder(User, 'user')
        .select(['user.id', 'user.name', 'user.deletedAt'])
        .where('user.email = :email', { email: dto.email })
        .withDeleted()
        .getOne()

      if (existingUser) {
        throw new BadRequestError(
          existingUser.deletedAt
            ? `Usuário "${existingUser.name}" desativado`
            : `Usuário "${existingUser.name}" já cadastrado`,
        )
      }

      const [passwordHash] = await Promise.all([hash(dto.password, 6)])

      const user = repository.user.create({
        name: dto.name,
        email: dto.email,
        password: passwordHash,
        userType: UserType.ORGANIZATIONAL,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
      })

      await manager.save(user)

      const member = repository.member.create({
        user: { id: user.id },
        role: dto.role,
        organization: { id: membership.organization.id },
      })

      await manager.save(member)

      return user
    })
  },
}
