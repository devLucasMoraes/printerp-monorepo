import { EntityManager } from 'typeorm'

import { Categoria } from '@/domain/entities/Categoria'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateInsumoDTO } from '@/http/routes/insumo/update-insumo'

import { Insumo } from '../../entities/Insumo'

export const updateInsumoUseCase = {
  async execute(
    id: string,
    dto: UpdateInsumoDTO,
    membership: Member,
  ): Promise<Insumo> {
    return await repository.insumo.manager.transaction(async (manager) => {
      const insumoToUpdate = await findInsumoToUpdate(id, manager)
      await validate(id, dto, membership, manager)
      const insumo = await update(insumoToUpdate, dto, membership, manager)
      return insumo
    })
  },
}

async function findInsumoToUpdate(
  id: string,
  manager: EntityManager,
): Promise<Insumo> {
  const insumo = await manager.findOne(Insumo, {
    where: { id },
  })

  if (!insumo) {
    throw new BadRequestError('Insumo não encontrado')
  }

  return insumo
}

async function validate(
  id: string,
  dto: UpdateInsumoDTO,
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
    insumo.organizationId === membership.organization.id &&
    insumo.id !== id
  ) {
    throw new BadRequestError(`Insumo "${insumo.descricao}" já cadastrado`)
  }

  if (
    insumo &&
    insumo.deletedAt === null &&
    insumo.organizationId === membership.organization.id &&
    insumo.id !== id
  ) {
    throw new BadRequestError(
      `Insumo "${insumo.descricao}" já cadastrado e desativado`,
    )
  }
}

async function update(
  insumoToUpdate: Insumo,
  dto: UpdateInsumoDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Insumo> {
  const insumoDTO = repository.insumo.create({
    descricao: dto.descricao,
    undEstoque: dto.undEstoque,
    valorUntMed: dto.valorUntMed,
    valorUntMedAuto: dto.valorUntMedAuto,
    estoqueMinimo: dto.estoqueMinimo,
    permiteEstoqueNegativo: dto.permiteEstoqueNegativo,
    updatedBy: membership.user.id,
    categoria: { id: dto.categoriaId },
  })

  const insumo = repository.insumo.merge(insumoToUpdate, insumoDTO)

  return await manager.save(Insumo, insumo)
}
