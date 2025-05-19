import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateArmazemDTO } from '@/http/routes/armazem/create-armazem'

import { Armazem } from '../../entities/Armazem'

export const createArmazemUseCase = {
  async execute(dto: CreateArmazemDTO, membership: Member): Promise<Armazem> {
    return await repository.armazem.manager.transaction(async (manager) => {
      await validate(dto, membership, manager)
      const armazem = await createArmazem(dto, membership, manager)
      return armazem
    })
  },
}
async function validate(
  dto: CreateArmazemDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const armazem = await manager.getRepository(Armazem).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  })

  if (
    armazem &&
    armazem.deletedAt === null &&
    armazem.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(`Armazém "${armazem.nome}" já cadastrado`)
  }

  if (
    armazem &&
    armazem.deletedAt !== null &&
    armazem.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Armazém "${armazem.nome}" já cadastrado e desativado`,
    )
  }
}

async function createArmazem(
  dto: CreateArmazemDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Armazem> {
  const armazemToCreate = repository.armazem.create({
    nome: dto.nome,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
  })

  return await manager.save(Armazem, armazemToCreate)
}
