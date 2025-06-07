import { Fornecedora } from '@/domain/entities/Fornecedora'
import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateFornecedoraDTO } from '@/http/routes/fornecedora/create-fornecedora'

export const createFornecedoraUseCase = {
  async execute(
    dto: CreateFornecedoraDTO,
    membership: Member,
  ): Promise<Fornecedora> {
    return repository.fornecedora.manager.transaction(async (manager) => {
      const existingFornecedora = await manager.findOne(Fornecedora, {
        where: {
          cnpj: dto.cnpj,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'nomeFantasia', 'deletedAt'],
      })

      if (existingFornecedora) {
        throw new BadRequestError(
          existingFornecedora.deletedAt
            ? `Fornecedora "${existingFornecedora.nomeFantasia}" já cadastrada e desativada`
            : `Fornecedora "${existingFornecedora.nomeFantasia}" já cadastrada`,
        )
      }

      const fornecedora = repository.fornecedora.create({
        nomeFantasia: dto.nomeFantasia,
        razaoSocial: dto.razaoSocial,
        cnpj: dto.cnpj,
        fone: dto.fone,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      return await manager.save(Fornecedora, fornecedora)
    })
  },
}
