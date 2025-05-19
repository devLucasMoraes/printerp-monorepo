import { AppDataSource } from '@/database/data-source'

import { Insumo } from '../entities/Insumo'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class InsumoRepository extends BaseRepository<Insumo> {
  constructor() {
    const repository = AppDataSource.getRepository(Insumo)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Insumo>> {
    return this.paginate(pageRequest, {}, { categoria: true })
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Insumo>> {
    return this.paginate(pageRequest, { organizationId }, { categoria: true })
  }
}
