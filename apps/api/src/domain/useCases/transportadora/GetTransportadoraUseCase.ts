import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Transportadora } from '../../entities/Transportadora'
import { repository } from '../../repositories'

export const getTransportadoraUseCase = {
  async execute(id: string): Promise<Transportadora> {
    const transportadora = await repository.transportadora.findOneBy({ id })

    if (!transportadora) {
      throw new BadRequestError('Transportadora não encontrada')
    }

    return transportadora
  },
}
