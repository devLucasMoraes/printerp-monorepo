import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Parceiro } from '../../entities/Parceiro'

export const getAllParceiroUseCase = {
  async execute(membership: Member): Promise<Parceiro[]> {
    return await repository.parceiro.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
