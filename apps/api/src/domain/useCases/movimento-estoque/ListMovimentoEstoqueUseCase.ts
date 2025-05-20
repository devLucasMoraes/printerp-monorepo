import { repository } from '@/domain/repositories'

import { MovimentoEstoque } from '../../entities/MovimentoEstoque'
import { Page, PageRequest } from '../../repositories/BaseRepository'

export const listMovimentoEstoqueUseCase = {
  async execute(pageRequest?: PageRequest): Promise<Page<MovimentoEstoque>> {
    return await repository.movimentoEstoque.findAllPaginated(pageRequest)
  },
}
