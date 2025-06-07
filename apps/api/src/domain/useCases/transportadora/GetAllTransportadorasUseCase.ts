import { Member } from '@/domain/entities/Member'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'

export const getAllTransportadorasUseCase = {
  async execute(membership: Member): Promise<Fornecedora[]> {
    return await repository.transportadora.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
