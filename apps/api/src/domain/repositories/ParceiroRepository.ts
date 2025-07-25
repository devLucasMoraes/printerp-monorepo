import { AppDataSource } from '@/database/data-source'

import { Parceiro } from '../entities/Parceiro'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class ParceiroRepository extends BaseRepository<Parceiro> {
  constructor() {
    const repository = AppDataSource.getRepository(Parceiro)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Parceiro>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Parceiro>> {
    return this.paginate(pageRequest, { organizationId })
  }
}
