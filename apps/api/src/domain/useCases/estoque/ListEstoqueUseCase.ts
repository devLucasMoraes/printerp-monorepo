import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Estoque } from '../../entities/Estoque'
import { Page, PageRequest } from '../../repositories/BaseRepository'
import { atualizarConsumoMedioDiarioUseCase } from './AtualizarConsumoMedioDiarioUseCase'

export const listEstoqueUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Estoque>> {
    return await repository.estoque.manager.transaction(async (manager) => {
      const estoques = await repository.estoque.find({
        where: { organizationId: membership.organization.id },
        relations: {
          insumo: true,
          armazem: true,
        },
      })
      for (const estoque of estoques) {
        await atualizarConsumoMedioDiarioUseCase.execute(
          estoque.insumo.id,
          estoque.armazem.id,
          manager,
        )
      }
      return await repository.estoque.findAllPaginatedByOrganizationId(
        membership.organization.id,
        pageRequest,
      )
    })
  },
}
