import { Member } from '@/domain/entities/Member'

import { Requisitante } from '../../entities/Requisitante'
import { repository } from '../../repositories'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listRequisitanteUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Requisitante>> {
    return await repository.requisitante.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
