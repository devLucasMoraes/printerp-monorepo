import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { User } from '@/domain/entities/User'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateUserDTO } from '@/http/routes/user/update-user'

export const updateUserUseCase = {
  async execute(
    id: string,
    dto: UpdateUserDTO,
    membership: Member,
  ): Promise<User> {
    return await repository.user.manager.transaction(async (manager) => {
      const userToUpdate = await findUserToUpdate(id, manager)
      await validate(id, dto, manager)
      const user = await update(userToUpdate, dto, membership, manager)
      return user
    })
  },
}

async function findUserToUpdate(
  id: string,
  manager: EntityManager,
): Promise<User> {
  const user = await manager.findOne(User, {
    where: { id },
  })

  if (!user) {
    throw new BadRequestError('Usuário nao encontrado')
  }

  return user
}

async function validate(
  id: string,
  dto: UpdateUserDTO,
  manager: EntityManager,
): Promise<void> {
  const user = await manager.getRepository(User).findOne({
    where: { email: dto.email },
    withDeleted: true,
  })

  if (user && user.deletedAt === null && user.id !== id) {
    throw new BadRequestError(`Usuário "${user.name}" já cadastrado`)
  }

  if (user && user.deletedAt !== null && user.id !== id) {
    throw new BadRequestError(`Usuário "${user.name}" desativado`)
  }
}

async function update(
  userToUpdate: User,
  dto: UpdateUserDTO,
  membership: Member,
  manager: EntityManager,
): Promise<User> {
  const userDTO = repository.user.create({
    name: dto.name,
    email: dto.email,
    password: dto.password,
    updatedBy: membership.user.id,
    avatarUrl: dto.avatarUrl,
  })

  const user = repository.user.merge(userToUpdate, userDTO)

  const existingMember = await manager.findOne(Member, {
    where: {
      user: { id: user.id },
      organization: { id: membership.organization.id },
    },
  })

  if (!existingMember) {
    throw new BadRequestError('Usuário nao encontrado')
  }

  await manager.update(Member, existingMember.id, { role: dto.role })

  return await manager.save(User, user)
}
