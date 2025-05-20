import { Member } from '@/domain/entities/Member'
import { Parceiro } from '@/domain/entities/Parceiro'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listParceiroUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Parceiro>> {
    return await repository.parceiro.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
