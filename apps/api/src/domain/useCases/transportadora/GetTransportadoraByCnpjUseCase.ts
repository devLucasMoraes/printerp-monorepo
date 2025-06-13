// useCases/transportadora/GetTransportadoraByCnpjUseCase.ts
import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Transportadora } from '../../entities/Transportadora'
import { repository } from '../../repositories'

export const getTransportadoraByCnpjUseCase = {
  async execute(cnpj: string, membership: Member): Promise<Transportadora> {
    const transportadora = await repository.transportadora.findOneBy({
      cnpj,
      organizationId: membership.organization.id,
    })

    if (!transportadora) {
      throw new BadRequestError(
        'Transportadora não encontrada com o CNPJ informado',
      )
    }

    return transportadora
  },
}
