import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { Setor } from '@/domain/entities/Setor'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateSetorDTO } from '@/http/routes/setor/create-setor'

export const createSetorUseCase = {
  async execute(dto: CreateSetorDTO, membership: Member): Promise<Setor> {
    return await repository.setor.manager.transaction(async (manager) => {
      await validate(dto, membership, manager)
      const setor = await createSetor(dto, membership, manager)
      return setor
    })
  },
}

async function validate(
  dto: CreateSetorDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const setor = await manager.getRepository(Setor).findOne({
    where: { nome: dto.nome },
    withDeleted: true,
  })

  if (
    setor &&
    setor.deletedAt === null &&
    setor.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(`Setor "${setor.nome}" já cadastrado`)
  }

  if (
    setor &&
    setor.deletedAt !== null &&
    setor.organizationId === membership.organization.id
  ) {
    throw new BadRequestError(
      `Setor "${setor.nome}" já cadastrado e desativado`,
    )
  }
}

async function createSetor(
  dto: CreateSetorDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Setor> {
  const setorToCreate = repository.setor.create({
    nome: dto.nome,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
  })

  return await manager.save(Setor, setorToCreate)
}
