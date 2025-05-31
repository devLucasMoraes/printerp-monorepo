import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { MovimentoEstoque } from '../../entities/MovimentoEstoque'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listMovimentoEstoqueUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<MovimentoEstoque>> {
    return await repository.movimentoEstoque.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
