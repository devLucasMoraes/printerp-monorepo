import { AppDataSource } from '@/database/data-source'

import { Transportadora } from '../entities/Transportadora'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class TransportadoraRepository extends BaseRepository<Transportadora> {
  constructor() {
    const repository = AppDataSource.getRepository(Transportadora)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<Transportadora>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Transportadora>> {
    return this.paginate(pageRequest, { organizationId })
  }
}
