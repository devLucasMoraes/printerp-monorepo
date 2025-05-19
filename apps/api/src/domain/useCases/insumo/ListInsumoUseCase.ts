import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Insumo } from '../../entities/Insumo'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listInsumoUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Insumo>> {
    return await repository.insumo.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
