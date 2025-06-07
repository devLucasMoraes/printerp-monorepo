import { Member } from '@/domain/entities/Member'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listFornecedorasUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Fornecedora>> {
    return await repository.fornecedora.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
