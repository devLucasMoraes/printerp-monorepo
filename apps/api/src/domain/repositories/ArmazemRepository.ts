import { AppDataSource } from '@/database/data-source'

import { Armazem } from '../entities/Armazem'
import { BaseRepository, Page, PageRequest } from './BaseRepository'

export class ArmazemRepository extends BaseRepository<Armazem> {
  constructor() {
    const repository = AppDataSource.getRepository(Armazem)
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findAllPaginated(pageRequest?: PageRequest): Promise<Page<Armazem>> {
    return this.paginate(pageRequest, {}, {})
  }

  async findAllPaginatedByOrganizationId(
    organizationId: string,
    pageRequest?: PageRequest,
  ): Promise<Page<Armazem>> {
    return this.paginate(pageRequest, { organizationId })
  }

  async findOneWithRelations(id: string): Promise<Armazem | null> {
    return await this.findOne({
      where: { id },
      relations: {
        estoques: true,
        movimentosSaida: true,
        movimentosEntrada: true,
      },
    })
  }
}
