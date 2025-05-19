import { Member } from '@/domain/entities/Member'

import { Setor } from '../../entities/Setor'
import { repository } from '../../repositories'

export const getAllSetorUseCase = {
  async execute(membership: Member): Promise<Setor[]> {
    return await repository.setor.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
