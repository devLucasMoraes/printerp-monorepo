import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { NfeCompra } from '../../entities/NfeCompra'

export const getAllNfesCompraUseCase = {
  async execute(membership: Member): Promise<NfeCompra[]> {
    return await repository.nfeCompra.find({
      where: { organizationId: membership.organization.id },
      relations: {
        itens: {
          insumo: true,
        },
        fornecedora: true,
        transportadora: true,
        armazem: true,
      },
    })
  },
}
