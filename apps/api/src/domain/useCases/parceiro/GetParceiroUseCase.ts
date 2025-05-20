import { Parceiro } from '@/domain/entities/Parceiro'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export const getParceiroUseCase = {
  async execute(id: string): Promise<Parceiro> {
    const parceiro = await repository.parceiro.findOneBy({ id })

    if (!parceiro) {
      throw new BadRequestError('Parceiro não encontrado')
    }

    return parceiro
  },
}
