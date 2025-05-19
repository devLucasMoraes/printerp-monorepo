import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Setor } from '../../entities/Setor'
import { repository } from '../../repositories'

export const deleteSetorUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.setor.manager.transaction(async (manager) => {
      const setor = await findSetor(id, manager)
      await disable(setor, manager, membership.user.id)
    })
  },
}

async function findSetor(id: string, manager: EntityManager): Promise<Setor> {
  const setor = await manager.getRepository(Setor).findOneBy({ id })

  if (!setor) {
    throw new BadRequestError('Setor não encontrado')
  }

  return setor
}

async function disable(
  setor: Setor,
  manager: EntityManager,
  userId: string,
): Promise<void> {
  setor.deletedBy = userId

  await manager.save(Setor, setor)

  await manager.softDelete(Setor, setor.id)
}
