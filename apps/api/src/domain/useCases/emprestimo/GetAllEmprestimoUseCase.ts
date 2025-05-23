import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Emprestimo } from '../../entities/Emprestimo'

export const getAllEmprestimoUseCase = {
  async execute(membership: Member): Promise<Emprestimo[]> {
    return await repository.emprestimo.find({
      where: { organizationId: membership.organization.id },
      relations: {
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
        parceiro: true,
        armazem: true,
      },
    })
  },
}
