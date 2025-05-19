import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Armazem } from '../../entities/Armazem'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listArmazemUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Armazem>> {
    return await repository.armazem.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
