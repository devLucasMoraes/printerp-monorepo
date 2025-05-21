import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'

export const getRequisicaoEstoqueUseCase = {
  async execute(id: string): Promise<RequisicaoEstoque> {
    const requisicao =
      await repository.requisicaoEstoque.findOneWithRelations(id)

    if (!requisicao) {
      throw new BadRequestError('RequisicaoEstoque not found')
    }

    return requisicao
  },
}
