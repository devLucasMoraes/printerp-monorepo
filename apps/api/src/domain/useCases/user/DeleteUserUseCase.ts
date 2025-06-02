import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { User } from '../../entities/User'

export const deleteUserUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.user.manager.transaction(async (manager) => {
      const user = await findUser(id, manager)
      await disable(user, membership, manager)
    })
  },
}

async function findUser(id: string, manager: EntityManager): Promise<User> {
  const user = await manager.getRepository(User).findOneBy({ id })

  if (!user) {
    throw new BadRequestError('Usuário não encontrado')
  }

  return user
}

async function disable(
  user: User,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  user.deletedBy = membership.user.id

  await manager.save(User, user)

  await manager.softDelete(User, user.id)
}
