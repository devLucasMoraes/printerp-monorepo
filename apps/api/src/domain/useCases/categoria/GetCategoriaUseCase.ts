import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Categoria } from '../../entities/Categoria'
import { repository } from '../../repositories'

export const getCategoriaUseCase = {
  async execute(id: string): Promise<Categoria> {
    const categoria = await repository.categoria.findOneBy({ id })

    if (!categoria) {
      throw new BadRequestError('Categoria não encontrada')
    }

    return categoria
  },
}
