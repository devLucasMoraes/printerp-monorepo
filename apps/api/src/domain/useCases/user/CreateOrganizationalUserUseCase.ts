import { hash } from 'bcryptjs'
import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateUserDTO } from '@/http/routes/user/create-organizational-user'

import { User, UserType } from '../../entities/User'

export const createOrganizationalUserUseCase = {
  async execute(dto: CreateUserDTO, membership: Member): Promise<User> {
    return await repository.user.manager.transaction(async (manager) => {
      await validate(dto, manager)
      const user = await createUser(dto, membership, manager)
      return user
    })
  },
}

async function validate(
  dto: CreateUserDTO,
  manager: EntityManager,
): Promise<void> {
  const user = await manager.getRepository(User).findOne({
    where: { email: dto.email },
    withDeleted: true,
  })

  if (user && user.deletedAt === null) {
    throw new BadRequestError(`Usuário "${user.name}" já cadastrado`)
  }

  if (user && user.deletedAt !== null) {
    throw new BadRequestError(`Usuário "${user.name}" desativado`)
  }
}

async function createUser(
  dto: CreateUserDTO,
  membership: Member,
  manager: EntityManager,
): Promise<User> {
  const passwordHash = await hash(dto.password, 6)
  const userToCreate = repository.user.create({
    name: dto.name,
    email: dto.email,
    password: passwordHash,
    userType: UserType.ORGANIZATIONAL,
  })

  const user = await manager.save(User, userToCreate)

  const memberData = manager.create(Member, {
    user: { id: user.id },
    role: dto.role,
    organization: { id: membership.organization.id },
  })

  await manager.save(Member, memberData)

  return user
}
