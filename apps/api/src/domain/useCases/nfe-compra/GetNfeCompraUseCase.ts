import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { NfeCompra } from '../../entities/NfeCompra'

export const getNfeCompraUseCase = {
  async execute(id: string): Promise<NfeCompra> {
    const nfeCompra = await repository.nfeCompra.findOneWithRelations(id)

    if (!nfeCompra) {
      throw new BadRequestError('Nfe de Compra não encontrada')
    }

    return nfeCompra
  },
}
