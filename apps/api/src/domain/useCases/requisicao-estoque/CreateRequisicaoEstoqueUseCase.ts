import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateRequisicaoEstoqueDTO } from '@/http/routes/requisicao-estoque/create-requisicao-estoque'

import { Insumo } from '../../entities/Insumo'
import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'
import { Requisitante } from '../../entities/Requisitante'
import { Setor } from '../../entities/Setor'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const createRequisicaoEstoqueUseCase = {
  async execute(
    dto: CreateRequisicaoEstoqueDTO,
    membership: Member,
  ): Promise<RequisicaoEstoque> {
    return repository.requisicaoEstoque.manager.transaction(async (manager) => {
      // Validação
      if (dto.itens.length === 0) {
        throw new BadRequestError(
          'Requisição Estoque deve ter pelo menos um item',
        )
      }

      const requisitante = await manager.findOne(Requisitante, {
        where: {
          id: dto.requisitanteId,
          organizationId: membership.organization.id,
        },
      })
      if (!requisitante) {
        throw new BadRequestError('Requisitante não encontrado')
      }

      const setor = await manager.findOne(Setor, {
        where: {
          id: dto.setorId,
          organizationId: membership.organization.id,
        },
      })
      if (!setor) {
        throw new BadRequestError('Setor não encontrado')
      }

      // Validação de itens
      for (const item of dto.itens) {
        if (item.quantidade <= 0) {
          throw new BadRequestError('Quantidade deve ser maior que zero')
        }

        const insumo = await manager.findOne(Insumo, {
          where: {
            id: item.insumoId,
            organizationId: membership.organization.id,
          },
        })
        if (!insumo) {
          throw new BadRequestError(`Insumo ${item.insumoId} não encontrado`)
        }

        if (item.unidade !== insumo.undEstoque) {
          throw new BadRequestError(
            `Unidade do insumo ${insumo.descricao} deve ser ${insumo.undEstoque}`,
          )
        }
      }

      // Criação da requisição
      const requisicaoToCreate = repository.requisicaoEstoque.create({
        dataRequisicao: dto.dataRequisicao,
        ordemProducao: dto.ordemProducao,
        valorTotal: dto.valorTotal,
        obs: dto.obs,
        requisitante: { id: dto.requisitanteId },
        setor: { id: dto.setorId },
        armazem: { id: dto.armazemId },
        itens: dto.itens.map((itemDTO) => ({
          insumo: { id: itemDTO.insumoId },
          quantidade: itemDTO.quantidade,
          unidade: itemDTO.unidade,
          valorUnitario: itemDTO.valorUnitario,
          createdBy: membership.user.id,
          updatedBy: membership.user.id,
          organizationId: membership.organization.id,
        })),
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      const requisicao = await manager.save(
        RequisicaoEstoque,
        requisicaoToCreate,
      )

      // Processamento das movimentações
      for (const item of requisicao.itens) {
        await registrarSaidaEstoqueUseCase.execute(
          {
            insumo: item.insumo,
            armazem: requisicao.armazem,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            undEstoque: item.unidade,
            documentoOrigemId: requisicao.id,
            tipoDocumento: 'REQUISICAO-ESTOQUE',
            data: requisicao.dataRequisicao,
          },
          membership,
          manager,
        )
      }

      return requisicao
    })
  },
}
