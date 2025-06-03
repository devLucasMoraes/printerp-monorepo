import { Member } from '@/domain/entities/Member'
import { Organization } from '@/domain/entities/Organization'
import { repository } from '@/domain/repositories'
import { Page, PageRequest } from '@/domain/repositories/BaseRepository'

export const listOrganizationUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Organization>> {
    return await repository.organization.findAllPaginatedByUserId(
      membership.user.id,
      pageRequest,
    )
  },
}
