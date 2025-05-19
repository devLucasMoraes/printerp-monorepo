import { Member } from '@/domain/entities/Member'

import { Requisitante } from '../../entities/Requisitante'
import { repository } from '../../repositories'

export const getAllRequisitanteUseCase = {
  async execute(membership: Member): Promise<Requisitante[]> {
    return await repository.requisitante.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
