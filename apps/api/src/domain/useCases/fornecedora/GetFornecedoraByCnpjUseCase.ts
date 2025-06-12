// useCases/fornecedora/GetFornecedoraByCnpjUseCase.ts
import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'

export const getFornecedoraByCnpjUseCase = {
  async execute(cnpj: string, membership: Member): Promise<Fornecedora> {
    const fornecedora = await repository.fornecedora.findOneBy({
      cnpj,
      organizationId: membership.organization.id,
    })

    if (!fornecedora) {
      throw new BadRequestError(
        'Fornecedora não encontrada com o CNPJ informado',
      )
    }

    return fornecedora
  },
}
