import { AppDataSource } from '@/database/data-source'

import { NfeCompra } from '../entities/NfeCompra'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class NfeCompraRepository extends BaseRepository<NfeCompra> {
  constructor() {
    const repository = AppDataSource.getRepository(NfeCompra)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<NfeCompra>> {
    return this.paginate(
      pageRequest,
      {},
      {
        armazem: true,
        fornecedora: true,
        transportadora: true,
        itens: {
          insumo: true,
        },
      },
    )
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<NfeCompra>> {
    return this.paginate(
      pageRequest,
      { organizationId },
      {
        armazem: true,
        fornecedora: true,
        transportadora: true,
        itens: {
          insumo: true,
        },
      },
    )
  }

  async findOneWithRelations(id: string): Promise<NfeCompra | null> {
    return await this.findOne({
      where: { id },
      relations: {
        armazem: true,
        fornecedora: true,
        transportadora: true,
        itens: {
          insumo: true,
        },
      },
    })
  }
}
