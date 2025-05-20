import { FindOptionsWhere, ILike } from 'typeorm'

import { AppDataSource } from '@/database/data-source'

import { Estoque } from '../entities/Estoque'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class EstoqueRepository extends BaseRepository<Estoque> {
  constructor() {
    const repository = AppDataSource.getRepository(Estoque)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Estoque>> {
    const filters = pageRequest?.filters || {}

    const where: FindOptionsWhere<Estoque> = {}

    if (Object.keys(filters).length > 0) {
      where.insumo = {}

      if (filters.insumo) {
        where.insumo.descricao = ILike(`%${filters.insumo}%`)
      }
    }

    return this.paginate(pageRequest, where, {
      armazem: true,
      insumo: {
        categoria: true,
      },
    })
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Estoque>> {
    const filters = pageRequest?.filters || {}

    const where: FindOptionsWhere<Estoque> = {}
    where.organizationId = organizationId

    if (Object.keys(filters).length > 0) {
      where.insumo = {}

      if (filters.insumo) {
        where.insumo.descricao = ILike(`%${filters.insumo}%`)
      }
    }

    return this.paginate(pageRequest, where, {
      armazem: true,
      insumo: {
        categoria: true,
      },
    })
  }
}
