import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { Parceiro } from '@/domain/entities/Parceiro'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateParceiroDTO } from '@/http/routes/parceiro/create-parceiro'

export const createParceiroUseCase = {
  async execute(dto: CreateParceiroDTO, membership: Member): Promise<Parceiro> {
    return await repository.parceiro.manager.transaction(async (manager) => {
      await validate(dto, membership, manager)
      const parceiro = await createParceiro(dto, membership, manager)
      return parceiro
    })
  },
}
async function validate(
  dto: CreateParceiroDTO,
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
    parceiro.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(`Parceiro "${parceiro.nome}" já cadastrado`)
  }

  if (
    parceiro &&
    parceiro.deletedAt !== null &&
    parceiro.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Parceiro "${parceiro.nome}" já cadastrado e desativado`,
    )
  }
}

async function createParceiro(
  dto: CreateParceiroDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Parceiro> {
  const parceiroToCreate = repository.parceiro.create({
    nome: dto.nome,
    fone: dto.fone,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
  })

  return await manager.save(Parceiro, parceiroToCreate)
}
