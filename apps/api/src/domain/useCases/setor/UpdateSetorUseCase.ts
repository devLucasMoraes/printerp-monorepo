import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateSetorDTO } from '@/http/routes/setor/update-setor'

import { Setor } from '../../entities/Setor'
import { repository } from '../../repositories'

export const updateSetorUseCase = {
  async execute(
    id: string,
    dto: UpdateSetorDTO,
    membership: Member,
  ): Promise<Setor> {
    return await repository.setor.manager.transaction(async (manager) => {
      const setorToUpdate = await findSetorToUpdate(id, manager)
      await validate(id, dto, membership, manager)
      const setor = await update(setorToUpdate, dto, membership, manager)
      return setor
    })
  },
}

async function findSetorToUpdate(
  id: string,
  manager: EntityManager,
): Promise<Setor> {
  const setor = await manager.findOne(Setor, {
    where: { id },
  })

  if (!setor) {
    throw new BadRequestError('Setor não encontrado')
  }

  return setor
}

async function validate(
  id: string,
  dto: UpdateSetorDTO,
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
    setor.organizationId === membership.organization.id &&
    setor.id !== id
  ) {
    throw new BadRequestError(`Setor "${setor.nome}" já cadastrado`)
  }

  if (
    setor &&
    setor.deletedAt !== null &&
    setor.organizationId === membership.organization.id &&
    setor.id !== id
  ) {
    throw new BadRequestError(
      `Setor "${setor.nome}" já cadastrado e desativado`,
    )
  }
}

async function update(
  setorToUpdate: Setor,
  dto: UpdateSetorDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Setor> {
  const setorDTO = repository.setor.create({
    nome: dto.nome,
    updatedBy: membership.user.id,
  })

  const setor = repository.setor.merge(setorToUpdate, setorDTO)

  return await manager.save(Setor, setor)
}
