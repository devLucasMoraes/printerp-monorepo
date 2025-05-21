import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listRequisicaoEstoqueUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<RequisicaoEstoque>> {
    return await repository.requisicaoEstoque.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
