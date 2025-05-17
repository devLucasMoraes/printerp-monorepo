import { Member } from '@/domain/entities/Member'

import { Categoria } from '../../entities/Categoria'
import { repository } from '../../repositories'

export const getAllCategoriaUseCase = {
  async execute(membership: Member): Promise<Categoria[]> {
    return await repository.categoria.find({
      where: { organizationId: membership.organization.id },
    })
  },
}
