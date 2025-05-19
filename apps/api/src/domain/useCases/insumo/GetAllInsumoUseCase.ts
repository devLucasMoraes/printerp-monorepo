import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Insumo } from '../../entities/Insumo'

export const getAllInsumoUseCase = {
  async execute(membership: Member): Promise<Insumo[]> {
    return await repository.insumo.find({
      where: { organizationId: membership.organization.id },
      relations: ['categoria'],
    })
  },
}
