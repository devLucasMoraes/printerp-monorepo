import { Member } from '@/domain/entities/Member'
import { Transportadora } from '@/domain/entities/Transportadora'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateTransportadoraDTO } from '@/http/routes/transportadora/create-transportadora'

export const createTransportadoraUseCase = {
  async execute(
    dto: CreateTransportadoraDTO,
    membership: Member,
  ): Promise<Transportadora> {
    return repository.transportadora.manager.transaction(async (manager) => {
      const existingTransportadora = await manager.findOne(Transportadora, {
        where: {
          cnpj: dto.cnpj,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'nomeFantasia', 'deletedAt'],
      })

      if (existingTransportadora) {
        throw new BadRequestError(
          existingTransportadora.deletedAt
            ? `Transportadora "${existingTransportadora.nomeFantasia}" já cadastrada e desativada`
            : `Transportadora "${existingTransportadora.nomeFantasia}" já cadastrada`,
        )
      }

      const transportadora = repository.transportadora.create({
        nomeFantasia: dto.nomeFantasia,
        razaoSocial: dto.razaoSocial,
        cnpj: dto.cnpj,
        fone: dto.fone,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      return await manager.save(Transportadora, transportadora)
    })
  },
}
