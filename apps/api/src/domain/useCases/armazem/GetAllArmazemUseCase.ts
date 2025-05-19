import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Armazem } from '../../entities/Armazem'

export const getAllArmazemUseCase = {
  async execute(membership: Member): Promise<Armazem[]> {
    return await repository.armazem.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
