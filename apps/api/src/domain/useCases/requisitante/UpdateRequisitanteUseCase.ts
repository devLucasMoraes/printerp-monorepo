import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateRequisitanteDTO } from '@/http/routes/requisitante/update-requisitante'

import { Requisitante } from '../../entities/Requisitante'

export const updateRequisitanteUseCase = {
  async execute(
    id: string,
    dto: UpdateRequisitanteDTO,
    membership: Member,
  ): Promise<Requisitante> {
    return await repository.requisitante.manager.transaction(
      async (manager) => {
        const requisitanteToUpdate = await findRequisitanteToUpdate(id, manager)
        await validate(id, dto, membership, manager)
        const requisitante = await update(
          requisitanteToUpdate,
          dto,
          membership,
          manager,
        )
        return requisitante
      },
    )
  },
}

async function findRequisitanteToUpdate(
  id: string,
  manager: EntityManager,
): Promise<Requisitante> {
  const requisitante = await manager.findOne(Requisitante, {
    where: { id },
  })

  if (!requisitante) {
    throw new BadRequestError('Requisitante não encontrado')
  }

  return requisitante
}

async function validate(
  id: string,
  dto: UpdateRequisitanteDTO,
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
    requisitante.organizationId === membership.organization.id &&
    requisitante.id !== id
  ) {
    throw new BadRequestError(
      `Requisitante "${requisitante.nome}" já cadastrado`,
    )
  }

  if (
    requisitante &&
    requisitante.deletedAt !== null &&
    requisitante.organizationId === membership.organization.id &&
    requisitante.id !== id
  ) {
    throw new BadRequestError(
      `Requisitante "${requisitante.nome}" já cadastrado e desativado`,
    )
  }
}

async function update(
  requisitanteToUpdate: Requisitante,
  dto: UpdateRequisitanteDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Requisitante> {
  const requisitanteDTO = repository.requisitante.create({
    nome: dto.nome,
    fone: dto.fone,
    updatedBy: membership.user.id,
  })

  const requisitante = repository.requisitante.merge(
    requisitanteToUpdate,
    requisitanteDTO,
  )

  return await manager.save(Requisitante, requisitante)
}
