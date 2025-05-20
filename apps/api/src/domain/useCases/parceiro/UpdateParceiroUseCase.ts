import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateParceiroDTO } from '@/http/routes/parceiro/update-parceiro'

import { Parceiro } from '../../entities/Parceiro'

export const updateParceiroUseCase = {
  async execute(
    id: string,
    dto: UpdateParceiroDTO,
    membership: Member,
  ): Promise<Parceiro> {
    return await repository.parceiro.manager.transaction(async (manager) => {
      const parceiroToUpdate = await findParceiroToUpdate(id, manager)
      await validate(id, dto, membership, manager)
      const parceiro = await update(parceiroToUpdate, dto, membership, manager)
      return parceiro
    })
  },
}

async function findParceiroToUpdate(
  id: string,
  manager: EntityManager,
): Promise<Parceiro> {
  const parceiro = await manager.findOne(Parceiro, {
    where: { id },
  })

  if (!parceiro) {
    throw new BadRequestError('Parceiro não encontrado')
  }

  return parceiro
}

async function validate(
  id: string,
  dto: UpdateParceiroDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const parceiro = await manager.getRepository(Parceiro).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  })

  if (
    parceiro &&
    parceiro.deletedAt === null &&
    parceiro.organizationId === membership.organization.id &&
    parceiro.id !== id
  ) {
    throw new BadRequestError(`Parceiro "${parceiro.nome}" já cadastrado`)
  }

  if (
    parceiro &&
    parceiro.deletedAt !== null &&
    parceiro.organizationId === membership.organization.id &&
    parceiro.id !== id
  ) {
    throw new BadRequestError(
      `Parceiro "${parceiro.nome}" já cadastrado e desativado`,
    )
  }
}

async function update(
  parceiroToUpdate: Parceiro,
  dto: UpdateParceiroDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Parceiro> {
  const parceiroDTO = repository.parceiro.create({
    nome: dto.nome,
    fone: dto.fone,
    updatedBy: membership.user.id,
  })

  const parceiro = repository.parceiro.merge(parceiroToUpdate, parceiroDTO)

  return await manager.save(Parceiro, parceiro)
}
