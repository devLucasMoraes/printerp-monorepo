import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Requisitante } from '../../entities/Requisitante'
import { repository } from '../../repositories'

export const deleteRequisitanteUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.requisitante.manager.transaction(
      async (manager) => {
        const requisitante = await findRequisitante(id, manager)
        await disable(requisitante, manager, membership.user.id)
      },
    )
  },
}

async function findRequisitante(
  id: string,
  manager: EntityManager,
): Promise<Requisitante> {
  const requisitante = await manager
    .getRepository(Requisitante)
    .findOneBy({ id })

  if (!requisitante) {
    throw new BadRequestError('Requisitante não encontrado')
  }

  return requisitante
}

async function disable(
  requisitante: Requisitante,
  manager: EntityManager,
  userId: string,
): Promise<void> {
  requisitante.deletedBy = userId

  await manager.save(Requisitante, requisitante)

  await manager.softDelete(Requisitante, requisitante.id)
}
