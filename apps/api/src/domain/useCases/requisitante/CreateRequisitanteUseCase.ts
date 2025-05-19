import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { Requisitante } from '@/domain/entities/Requisitante'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateRequisitanteDTO } from '@/http/routes/requisitante/create-requisitante'

export const createRequisitanteUseCase = {
  async execute(
    dto: CreateRequisitanteDTO,
    membership: Member,
  ): Promise<Requisitante> {
    return await repository.requisitante.manager.transaction(
      async (manager) => {
        await validate(dto, membership, manager)
        const requisitante = await createRequisitante(dto, membership, manager)
        return requisitante
      },
    )
  },
}
async function validate(
  dto: CreateRequisitanteDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const requisitante = await manager.getRepository(Requisitante).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  })

  if (
    requisitante &&
    requisitante.deletedAt === null &&
    requisitante.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Requisitante "${requisitante.nome}" já cadastrado`,
    )
  }

  if (
    requisitante &&
    requisitante.deletedAt !== null &&
    requisitante.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Requisitante "${requisitante.nome}" já cadastrado e desativado`,
    )
  }
}

async function createRequisitante(
  dto: CreateRequisitanteDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Requisitante> {
  const requisitanteToCreate = repository.requisitante.create({
    nome: dto.nome,
    fone: dto.fone,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
  })

  return await manager.save(Requisitante, requisitanteToCreate)
}
