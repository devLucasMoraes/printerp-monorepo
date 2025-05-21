import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'

export const getAllRequisicaoEstoqueUseCase = {
  async execute(membership: Member): Promise<RequisicaoEstoque[]> {
    return await repository.requisicaoEstoque.find({
      where: { organizationId: membership.organization.id },
      relations: {
        itens: {
          insumo: true,
        },
        requisitante: true,
        setor: true,
        armazem: true,
      },
    })
  },
}
