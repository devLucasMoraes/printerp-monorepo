import { Member } from '@/domain/entities/Member'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listTransportadorasUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Fornecedora>> {
    return await repository.transportadora.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
