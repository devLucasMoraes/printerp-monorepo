import { EntityManager } from 'typeorm'

import { Categoria } from '@/domain/entities/Categoria'
import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateInsumoDTO } from '@/http/routes/insumo/create-insumo'

import { Insumo } from '../../entities/Insumo'
import { repository } from '../../repositories'

export const createInsumoUseCase = {
  async execute(dto: CreateInsumoDTO, membership: Member): Promise<Insumo> {
    return await repository.insumo.manager.transaction(async (manager) => {
      await validate(dto, membership, manager)
      const insumo = await createInsumo(dto, membership, manager)
      return insumo
    })
  },
}

async function validate(
  dto: CreateInsumoDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const categoria = await manager.getRepository(Categoria).findOne({
    where: { id: dto.categoriaId },
  })

  if (!categoria) {
    throw new BadRequestError(`Categoria "${dto.categoriaId}" não encontrada`)
  }

  const insumo = await manager.getRepository(Insumo).findOne({
    where: { descricao: dto.descricao },
    withDeleted: true,
  })

  if (
    insumo &&
    insumo.deletedAt !== null &&
    insumo.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(`Insumo "${insumo.descricao}" já cadastrado`)
  }

  if (
    insumo &&
    insumo.deletedAt === null &&
    insumo.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Insumo "${insumo.descricao}" já cadastrado e desativado`,
    )
  }
}

async function createInsumo(
  dto: CreateInsumoDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Insumo> {
  const insumoToCreate = repository.insumo.create({
    descricao: dto.descricao,
    undEstoque: dto.undEstoque,
    valorUntMed: dto.valorUntMed,
    valorUntMedAuto: dto.valorUntMedAuto,
    estoqueMinimo: dto.estoqueMinimo,
    permiteEstoqueNegativo: dto.permiteEstoqueNegativo,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
    categoria: { id: dto.categoriaId },
  })

  return await manager.save(Insumo, insumoToCreate)
}
