import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Setor } from '../../entities/Setor'
import { repository } from '../../repositories'

export const getSetorUseCase = {
  async execute(id: string): Promise<Setor> {
    const setor = await repository.setor.findOneBy({ id })

    if (!setor) {
      throw new BadRequestError('Setor não encontrado')
    }

    return setor
  },
}
