import { AppDataSource } from '@/database/data-source'

import { Vinculo } from '../entities/Vinculo'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class VinculoRepository extends BaseRepository<Vinculo> {
  constructor() {
    const repository = AppDataSource.getRepository(Vinculo)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Vinculo>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Vinculo>> {
    return this.paginate(pageRequest, { organizationId })
  }
}
