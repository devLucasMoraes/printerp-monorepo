import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'

export const getFornecedoraUseCase = {
  async execute(id: string): Promise<Fornecedora> {
    const fornecedora = await repository.fornecedora.findOneBy({ id })

    if (!fornecedora) {
      throw new BadRequestError('Fornecedora não encontrada')
    }

    return fornecedora
  },
}
