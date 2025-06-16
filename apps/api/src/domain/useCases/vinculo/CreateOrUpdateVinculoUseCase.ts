import { Fornecedora } from '@/domain/entities/Fornecedora'
import { Insumo } from '@/domain/entities/Insumo'
import { Member } from '@/domain/entities/Member'
import { Vinculo } from '@/domain/entities/Vinculo'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateOrUpdateVinculoDto } from '@/http/routes/vinculo/create-or-update-vinculo'

export const createOrUpdateVinculoUseCase = {
  async execute(
    dto: CreateOrUpdateVinculoDto,
    membership: Member,
  ): Promise<Vinculo> {
    return repository.vinculo.manager.transaction(async (manager) => {
      const existingFornecedora = await manager.findOne(Fornecedora, {
        where: {
          id: dto.fornecedoraId,
          organizationId: membership.organization.id,
        },
        select: ['id', 'nomeFantasia'],
      })

      if (!existingFornecedora) {
        throw new BadRequestError('Fornecedora não encontrada')
      }

      const existingInsumo = await manager.findOne(Insumo, {
        where: {
          id: dto.insumoId,
          organizationId: membership.organization.id,
        },
        select: ['id', 'descricao', 'undEstoque'],
      })

      if (!existingInsumo) {
        throw new BadRequestError('Insumo não encontrado')
      }

      const existingVinculo = await manager.findOne(Vinculo, {
        where: {
          cod: dto.cod,
          fornecedoraId: dto.fornecedoraId,
          insumoId: dto.insumoId,
          undCompra: dto.undCompra,
          organizationId: membership.organization.id,
        },
      })

      if (existingVinculo) {
        manager.merge(Vinculo, existingVinculo, {
          cod: dto.cod,
          fornecedoraId: dto.fornecedoraId,
          insumoId: dto.insumoId,
          undCompra: dto.undCompra,
          updatedBy: membership.user.id,
          organizationId: membership.organization.id,
          fornecedora: {
            id: dto.fornecedoraId,
          },
          insumo: existingInsumo,
          possuiConversao: dto.possuiConversao,
          qtdeEmbalagem: dto.qtdeEmbalagem,
        })

        return await manager.save(Vinculo, existingVinculo)
      }

      const vinculo = repository.vinculo.create({
        cod: dto.cod,
        fornecedoraId: dto.fornecedoraId,
        insumoId: dto.insumoId,
        undCompra: dto.undCompra,
        fornecedora: {
          id: dto.fornecedoraId,
        },
        insumo: existingInsumo,
        possuiConversao: dto.possuiConversao,
        qtdeEmbalagem: dto.qtdeEmbalagem,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      return await manager.save(Vinculo, vinculo)
    })
  },
}
