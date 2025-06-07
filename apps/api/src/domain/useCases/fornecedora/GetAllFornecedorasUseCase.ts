import { Member } from '@/domain/entities/Member'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'

export const getAllFornecedorasUseCase = {
  async execute(membership: Member): Promise<Fornecedora[]> {
    return await repository.fornecedora.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
