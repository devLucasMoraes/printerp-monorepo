import { Member } from '@/domain/entities/Member'

import { Setor } from '../../entities/Setor'
import { repository } from '../../repositories'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listSetorUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Setor>> {
    return await repository.setor.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
