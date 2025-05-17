import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateCategoriaDTO } from '@/http/routes/categoria/update-categoria'

import { Categoria } from '../../entities/Categoria'
import { repository } from '../../repositories'

export const updateCategoriaUseCase = {
  async execute(
    id: string,
    dto: UpdateCategoriaDTO,
    membership: Member,
  ): Promise<Categoria> {
    return await repository.categoria.manager.transaction(async (manager) => {
      const categoriaToUpdate = await findCategoriaToUpdate(id, manager)
      await validate(id, dto, membership, manager)
      const categoria = await update(
        categoriaToUpdate,
        dto,
        membership,
        manager,
      )
      return categoria
    })
  },
}

async function findCategoriaToUpdate(
  id: string,
  manager: EntityManager,
): Promise<Categoria> {
  const categoria = await manager.findOne(Categoria, {
    where: { id },
  })

  if (!categoria) {
    throw new BadRequestError('Armazém não encontrado')
  }

  return categoria
}

async function validate(
  id: string,
  dto: UpdateCategoriaDTO,
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
    categoria.organizationId === membership.organization.id &&
    categoria.id !== id
  ) {
    throw new BadRequestError(`Armazém "${categoria.nome}" já cadastrado`)
  }

  if (
    categoria &&
    categoria.ativo === false &&
    categoria.organizationId === membership.organization.id &&
    categoria.id !== id
  ) {
    throw new BadRequestError(
      `Armazém "${categoria.nome}" já cadastrado e desativado`,
    )
  }
}

async function update(
  categoriaToUpdate: Categoria,
  dto: UpdateCategoriaDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Categoria> {
  const categoria = repository.categoria.create({
    nome: dto.nome,
    updatedBy: membership.user.id,
  })

  const categoriaToSave = repository.categoria.merge(
    categoriaToUpdate,
    categoria,
  )

  return await manager.save(Categoria, categoriaToSave)
}
