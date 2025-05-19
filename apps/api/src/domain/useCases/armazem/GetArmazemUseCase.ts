import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Armazem } from '../../entities/Armazem'

export const getArmazemUseCase = {
  async execute(id: string): Promise<Armazem> {
    const armazem = await repository.armazem.findOneWithRelations(id)

    if (!armazem) {
      throw new BadRequestError('Armazém não encontrado')
    }

    return armazem
  },
}
