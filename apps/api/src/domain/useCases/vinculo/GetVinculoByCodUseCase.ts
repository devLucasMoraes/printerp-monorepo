// useCases/vinculo/GetVinculoByCnpjUseCase.ts
import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Vinculo } from '../../entities/Vinculo'
import { repository } from '../../repositories'

export const getVinculoByCodUseCase = {
  async execute(cod: string, membership: Member): Promise<Vinculo> {
    const vinculo = await repository.vinculo.findOne({
      where: { cod, organizationId: membership.organization.id },
      relations: { insumo: true },
    })

    if (!vinculo) {
      throw new BadRequestError('Vinculo não encontrado')
    }

    return vinculo
  },
}
