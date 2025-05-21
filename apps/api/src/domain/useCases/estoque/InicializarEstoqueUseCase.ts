import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Estoque } from '../../entities/Estoque'

export const inicializarEstoqueUseCase = {
  async execute(
    insumoId: string,
    armazemId: string,
    membership: Member,
    manager: EntityManager,
  ): Promise<Estoque> {
    const estoque = await manager.findOne(Estoque, {
      where: {
        insumo: { id: insumoId },
        armazem: { id: armazemId },
        organizationId: membership.organization.id,
      },
    })

    if (!estoque) {
      const newEstoque = repository.estoque.create({
        insumo: { id: insumoId },
        armazem: { id: armazemId },
        quantidade: 0,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })
      return await manager.save(Estoque, newEstoque)
    }

    return estoque
  },
}
