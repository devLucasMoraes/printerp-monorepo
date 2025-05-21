import { AppDataSource } from '@/database/data-source'

import { RequisicaoEstoque } from '../entities/RequisicaoEstoque'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class RequisicaoEstoqueRepository extends BaseRepository<RequisicaoEstoque> {
  constructor() {
    const repository = AppDataSource.getRepository(RequisicaoEstoque)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<RequisicaoEstoque>> {
    return this.paginate(
      pageRequest,
      {},
      {
        armazem: true,
        requisitante: true,
        setor: true,
        itens: {
          insumo: true,
        },
      },
    )
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<RequisicaoEstoque>> {
    return this.paginate(
      pageRequest,
      { organizationId },
      {
        armazem: true,
        requisitante: true,
        setor: true,
        itens: {
          insumo: true,
        },
      },
    )
  }

  async findOneWithRelations(id: string): Promise<RequisicaoEstoque | null> {
    return await this.findOne({
      where: { id },
      relations: {
        armazem: true,
        requisitante: true,
        setor: true,
        itens: {
          insumo: true,
        },
      },
    })
  }
}
