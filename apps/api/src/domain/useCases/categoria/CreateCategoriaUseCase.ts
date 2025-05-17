import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateCategoriaDTO } from '@/http/routes/categoria/create-categoria'

import { Categoria } from '../../entities/Categoria'

export const createCategoriaUseCase = {
  async execute(
    dto: CreateCategoriaDTO,
    membership: Member,
  ): Promise<Categoria> {
    return await repository.categoria.manager.transaction(async (manager) => {
      await validate(dto, membership, manager)
      const categoria = await createCategoria(dto, membership, manager)
      return categoria
    })
  },
}

async function validate(
  dto: CreateCategoriaDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const categoria = await manager.getRepository(Categoria).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  })

  if (
    categoria &&
    categoria.ativo === true &&
    categoria.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(`Categoria "${categoria.nome}" já cadastrada`)
  }

  if (
    categoria &&
    categoria.ativo === false &&
    categoria.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Categoria "${categoria.nome}" já cadastrada e desativada`,
    )
  }
}

async function createCategoria(
  dto: CreateCategoriaDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Categoria> {
  const categoriaToCreate = repository.categoria.create({
    nome: dto.nome,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
  })

  return await manager.save(Categoria, categoriaToCreate)
}
