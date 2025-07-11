import { AppDataSource } from '@/database/data-source'

import { Emprestimo } from '../entities/Emprestimo'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class EmprestimoRepository extends BaseRepository<Emprestimo> {
  constructor() {
    const repository = AppDataSource.getRepository(Emprestimo)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Emprestimo>> {
    return this.paginate(
      pageRequest,
      {},
      {
        armazem: true,
        parceiro: true,
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
      },
    )
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Emprestimo>> {
    return this.paginate(
      pageRequest,
      { organizationId },
      {
        armazem: true,
        parceiro: true,
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
      },
    )
  }

  async findOneWithRelations(id: string): Promise<Emprestimo | null> {
    return await this.findOne({
      where: { id },
      relations: {
        armazem: true,
        parceiro: true,
        itens: {
          insumo: true,
          devolucaoItens: {
            insumo: true,
          },
        },
      },
    })
  }
}
