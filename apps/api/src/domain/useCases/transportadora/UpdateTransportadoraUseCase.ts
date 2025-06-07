import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateTransportadoraDTO } from '@/http/routes/transportadora/update-transportadora'

import { Transportadora } from '../../entities/Transportadora'
import { repository } from '../../repositories'

export const updateTransportadoraUseCase = {
  async execute(
    id: string,
    dto: UpdateTransportadoraDTO,
    membership: Member,
  ): Promise<Transportadora> {
    return repository.transportadora.manager.transaction(async (manager) => {
      const transportadora = await manager.findOne(Transportadora, {
        where: { id },
        select: ['id', 'cnpj'],
      })

      if (!transportadora) {
        throw new BadRequestError('Transportadora não encontrada')
      }

      if (dto.cnpj && dto.cnpj !== transportadora.cnpj) {
        const existingTransportadora = await manager.findOne(Transportadora, {
          where: {
            cnpj: dto.cnpj,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'cnpj', 'deletedAt'],
        })

        if (existingTransportadora && existingTransportadora.id !== id) {
          throw new BadRequestError(
            existingTransportadora.deletedAt
              ? `Transportadora com o CNPJ "${existingTransportadora.cnpj}" já cadastrada e desativada`
              : `Transportadora com o CNPJ "${existingTransportadora.cnpj}" já cadastrada`,
          )
        }
      }

      manager.merge(Transportadora, transportadora, {
        nomeFantasia: dto.nomeFantasia,
        razaoSocial: dto.razaoSocial,
        cnpj: dto.cnpj,
        fone: dto.fone,
        updatedBy: membership.user.id,
      })

      return await manager.save(transportadora)
    })
  },
}
