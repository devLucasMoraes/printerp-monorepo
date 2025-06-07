import { AppDataSource } from '@/database/data-source'

import { Fornecedora } from '../entities/Fornecedora'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class FornecedoraRepository extends BaseRepository<Fornecedora> {
  constructor() {
    const repository = AppDataSource.getRepository(Fornecedora)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(
    pageRequest?: PageRequest,
  ): Promise<Page<Fornecedora>> {
    return this.paginate(pageRequest)
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Fornecedora>> {
    return this.paginate(pageRequest, { organizationId })
  }
}
