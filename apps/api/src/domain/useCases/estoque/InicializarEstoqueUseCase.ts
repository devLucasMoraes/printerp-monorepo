import { EntityManager } from 'typeorm'

import { repository } from '@/domain/repositories'

import { Estoque } from '../../entities/Estoque'

export const inicializarEstoqueUseCase = {
  async execute(
    insumoId: string,
    armazemId: string,
    manager: EntityManager,
  ): Promise<Estoque> {
    const estoque = await manager.findOne(Estoque, {
      where: {
        insumo: { id: insumoId },
        armazem: { id: armazemId },
      },
    })

    if (!estoque) {
      const newEstoque = repository.estoque.create({
        insumo: { id: insumoId },
        armazem: { id: armazemId },
        quantidade: 0,
      })
      return await manager.save(Estoque, newEstoque)
    }

    return estoque
  },
}
