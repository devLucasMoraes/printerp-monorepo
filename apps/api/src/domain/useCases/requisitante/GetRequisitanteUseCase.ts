import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Requisitante } from '../../entities/Requisitante'
import { repository } from '../../repositories'

export const getRequisitanteUseCase = {
  async execute(id: string): Promise<Requisitante> {
    const requisitante = await repository.requisitante.findOneBy({ id })

    if (!requisitante) {
      throw new BadRequestError('Requisitante não encontrado')
    }

    return requisitante
  },
}
