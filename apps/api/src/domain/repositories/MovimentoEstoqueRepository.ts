import { AppDataSource } from '@/database/data-source'

import { MovimentoEstoque } from '../entities/MovimentoEstoque'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class MovimentoEstoqueRepository extends BaseRepository<MovimentoEstoque> {
  constructor() {
    const repository = AppDataSource.getRepository(MovimentoEstoque)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<MovimentoEstoque>> {
    return this.paginate(
      pageRequest,
      {},
      {
        insumo: true,
      },
    )
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<MovimentoEstoque>> {
    return this.paginate(
      pageRequest,
      { organizationId },
      {
        insumo: true,
        armazemOrigem: true,
        armazemDestino: true,
      },
    )
  }
}
