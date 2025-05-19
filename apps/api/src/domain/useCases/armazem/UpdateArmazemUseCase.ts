import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateArmazemDTO } from '@/http/routes/armazem/update-armazem'

import { Armazem } from '../../entities/Armazem'

export const updateArmazemUseCase = {
  async execute(
    id: string,
    dto: UpdateArmazemDTO,
    membership: Member,
  ): Promise<Armazem> {
    return await repository.armazem.manager.transaction(async (manager) => {
      const armazemToUpdate = await findArmazemToUpdate(id, manager)
      await validate(id, dto, membership, manager)
      const armazem = await update(armazemToUpdate, dto, membership, manager)
      return armazem
    })
  },
}
async function findArmazemToUpdate(
  id: string,
  manager: EntityManager,
): Promise<Armazem> {
  const armazem = await manager.findOne(Armazem, {
    where: { id },
  })

  if (!armazem) {
    throw new BadRequestError('Armazém não encontrado')
  }

  return armazem
}

async function validate(
  id: string,
  dto: UpdateArmazemDTO,
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
    armazem.organizationId === membership.organization.id &&
    armazem.id !== id
  ) {
    throw new BadRequestError(`Armazém "${armazem.nome}" já cadastrado`)
  }

  if (
    armazem &&
    armazem.deletedAt == null &&
    armazem.organizationId === membership.organization.id &&
    armazem.id !== id
  ) {
    throw new BadRequestError(
      `Armazém "${armazem.nome}" já cadastrado e desativado`,
    )
  }
}

async function update(
  armazemToUpdate: Armazem,
  dto: UpdateArmazemDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Armazem> {
  const armazemDTO = repository.armazem.create({
    nome: dto.nome,
    updatedBy: membership.user.id,
  })

  const armazem = repository.armazem.merge(armazemToUpdate, armazemDTO)

  return await manager.save(Armazem, armazem)
}
