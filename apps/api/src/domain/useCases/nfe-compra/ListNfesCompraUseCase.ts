import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { NfeCompra } from '../../entities/NfeCompra'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listNfeCompraUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<NfeCompra>> {
    return await repository.nfeCompra.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
