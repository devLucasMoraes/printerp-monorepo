import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Armazem } from '../../entities/Armazem'

export const deleteArmazemUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.armazem.manager.transaction(async (manager) => {
      const armazem = await findArmazem(id, manager)
      await disable(armazem, manager, membership.user.id)
    })
  },
}

async function findArmazem(
  id: string,
  manager: EntityManager,
): Promise<Armazem> {
  const armazem = await manager.getRepository(Armazem).findOneBy({ id })

  if (!armazem) {
    throw new BadRequestError('Armazém não encontrado')
  }

  return armazem
}

async function disable(
  armazem: Armazem,
  manager: EntityManager,
  userId: string,
): Promise<void> {
  armazem.deletedBy = userId

  await manager.save(Armazem, armazem)

  await manager.softDelete(Armazem, armazem.id)
}
