import { Member } from '@/domain/entities/Member'

import { Categoria } from '../../entities/Categoria'
import { repository } from '../../repositories'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listCategoriaUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Categoria>> {
    return await repository.categoria.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
