import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Parceiro } from '../../entities/Parceiro'
import { repository } from '../../repositories'

export const deleteParceiroUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.parceiro.manager.transaction(async (manager) => {
      const parceiro = await findParceiro(id, manager)
      await disable(parceiro, manager, membership.user.id)
    })
  },
}

async function findParceiro(
  id: string,
  manager: EntityManager,
): Promise<Parceiro> {
  const parceiro = await manager.getRepository(Parceiro).findOneBy({ id })

  if (!parceiro) {
    throw new BadRequestError('Parceiro não encontrado')
  }

  return parceiro
}

async function disable(
  parceiro: Parceiro,
  manager: EntityManager,
  userId: string,
): Promise<void> {
  parceiro.deletedBy = userId

  await manager.save(Parceiro, parceiro)

  await manager.softDelete(Parceiro, parceiro.id)
}
