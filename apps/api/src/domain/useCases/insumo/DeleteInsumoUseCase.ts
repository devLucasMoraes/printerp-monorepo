import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Insumo } from '../../entities/Insumo'

export const deleteInsumoUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.insumo.manager.transaction(async (manager) => {
      const insumo = await findInsumo(id, manager)
      await disable(insumo, manager, membership.user.id)
    })
  },
}

async function findInsumo(id: string, manager: EntityManager): Promise<Insumo> {
  const insumo = await manager.getRepository(Insumo).findOneBy({ id })

  if (!insumo) {
    throw new BadRequestError('Insumo não encontrado')
  }

  return insumo
}

async function disable(
  insumo: Insumo,
  manager: EntityManager,
  userId: string,
): Promise<void> {
  insumo.deletedBy = userId

  await manager.save(Insumo, insumo)

  await manager.softDelete(Insumo, insumo.id)
}
