import { Member } from '@/domain/entities/Member'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateFornecedoraDTO } from '@/http/routes/fornecedora/update-fornecedora'

import { Fornecedora } from '../../entities/Fornecedora'
import { repository } from '../../repositories'

export const updateFornecedoraUseCase = {
  async execute(
    id: string,
    dto: UpdateFornecedoraDTO,
    membership: Member,
  ): Promise<Fornecedora> {
    return repository.fornecedora.manager.transaction(async (manager) => {
      const fornecedora = await manager.findOne(Fornecedora, {
        where: { id },
        select: ['id', 'cnpj'],
      })

      if (!fornecedora) {
        throw new BadRequestError('Fornecedora não encontrada')
      }

      if (dto.cnpj && dto.cnpj !== fornecedora.cnpj) {
        const existingFornecedora = await manager.findOne(Fornecedora, {
          where: {
            cnpj: dto.cnpj,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'cnpj', 'deletedAt'],
        })

        if (existingFornecedora && existingFornecedora.id !== id) {
          throw new BadRequestError(
            existingFornecedora.deletedAt
              ? `Fornecedora com o CNPJ "${existingFornecedora.cnpj}" já cadastrada e desativada`
              : `Fornecedora com o CNPJ "${existingFornecedora.cnpj}" já cadastrada`,
          )
        }
      }

      manager.merge(Fornecedora, fornecedora, {
        nomeFantasia: dto.nomeFantasia,
        razaoSocial: dto.razaoSocial,
        cnpj: dto.cnpj,
        fone: dto.fone,
        updatedBy: membership.user.id,
      })

      return await manager.save(fornecedora)
    })
  },
}
