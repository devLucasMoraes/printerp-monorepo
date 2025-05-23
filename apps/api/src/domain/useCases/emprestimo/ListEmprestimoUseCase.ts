import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Emprestimo } from '../../entities/Emprestimo'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listEmprestimoUseCase = {
  async execute(
    membership: Member,
    pageRequest?: PageRequest,
  ): Promise<Page<Emprestimo>> {
    return await repository.emprestimo.findAllPaginatedByOrganizationId(
      membership.organization.id,
      pageRequest,
    )
  },
}
