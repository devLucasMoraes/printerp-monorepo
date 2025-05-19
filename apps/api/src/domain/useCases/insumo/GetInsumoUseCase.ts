import { Insumo } from '@/domain/entities/Insumo'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getInsumoUseCase = {
  async execute(id: string): Promise<Insumo> {
    const insumo = await repository.insumo.findOne({
      where: { id },
      relations: ['categoria'],
    })

    if (!insumo) {
      throw new BadRequestError('Insumo não encontrado')
    }

    return insumo
  },
}
