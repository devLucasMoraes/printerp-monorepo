import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Categoria } from '../../entities/Categoria'
import { repository } from '../../repositories'

export const deleteCategoriaUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.categoria.manager.transaction(async (manager) => {
      const categoria = await findCategoria(id, manager)
      await disable(categoria, manager, membership)
    })
  },
}

async function findCategoria(
  id: string,
  manager: EntityManager,
): Promise<Categoria> {
  const categoria = await manager.getRepository(Categoria).findOneBy({ id })

  if (!categoria) {
    throw new BadRequestError('Categoria não encontrada')
  }

  return categoria
}

async function disable(
  categoria: Categoria,
  manager: EntityManager,
  membership: Member,
): Promise<void> {
  categoria.deletedBy = membership.user.id

  await manager.save(Categoria, categoria)

  await manager.softDelete(Categoria, categoria.id)
}
