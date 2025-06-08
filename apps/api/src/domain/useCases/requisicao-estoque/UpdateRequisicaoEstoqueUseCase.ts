import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateRequisicaoEstoqueDTO } from '@/http/routes/requisicao-estoque/update-requisicao-estoque'

import { Armazem } from '../../entities/Armazem'
import { Insumo } from '../../entities/Insumo'
import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'
import { Requisitante } from '../../entities/Requisitante'
import { Setor } from '../../entities/Setor'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const updateRequisicaoEstoqueUseCase = {
  async execute(
    id: string,
    dto: UpdateRequisicaoEstoqueDTO,
    membership: Member,
  ): Promise<RequisicaoEstoque> {
    return repository.requisicaoEstoque.manager.transaction(
      async (manager: EntityManager) => {
        // Busca a requisição com todas as relações necessárias
        const requisicao = await manager.findOne(RequisicaoEstoque, {
          where: {
            id,
            organizationId: membership.organization.id,
          },
          relations: {
            requisitante: true,
            setor: true,
            armazem: true,
            itens: { insumo: true },
          },
        })

        if (!requisicao) {
          throw new BadRequestError('Requisição de estoque não encontrada')
        }

        // Validações
        if (dto.itens.length === 0) {
          throw new BadRequestError('Requisição deve ter pelo menos um item')
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

        const armazem = await manager.findOne(Armazem, {
          where: {
            id: dto.armazemId,
            organizationId: membership.organization.id,
          },
        })
        if (!armazem) {
          throw new BadRequestError('Armazém não encontrado')
        }

        // Validação de itens
        for (const itemDTO of dto.itens) {
          const insumo = await manager.findOne(Insumo, {
            where: {
              id: itemDTO.insumoId,
              organizationId: membership.organization.id,
            },
          })
          if (!insumo) {
            throw new BadRequestError(
              `Insumo ${itemDTO.insumoId} não encontrado`,
            )
          }

          if (itemDTO.quantidade <= 0) {
            throw new BadRequestError('Quantidade deve ser maior que zero')
          }

          if (itemDTO.unidade !== insumo.undEstoque) {
            throw new BadRequestError(
              `Unidade do insumo ${insumo.descricao} deve ser ${insumo.undEstoque}`,
            )
          }

          // Verifica se o item pertence à requisição
          if (itemDTO.id) {
            const itemExists = requisicao.itens.some(
              (item) => item.id === itemDTO.id,
            )
            if (!itemExists) {
              throw new BadRequestError(
                `Item ${itemDTO.id} não pertence à requisição`,
              )
            }
          }
        }

        // Reverter movimentações antigas
        for (const item of requisicao.itens) {
          await registrarEntradaEstoqueUseCase.execute(
            {
              insumo: item.insumo,
              armazem: requisicao.armazem,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              undEstoque: item.unidade,
              documentoOrigemId: requisicao.id,
              observacao: 'Estorno por atualização de requisição',
              tipoDocumento: 'REQUISICAO-ESTOQUE',
              data: requisicao.dataRequisicao,
              estorno: true,
            },
            membership,
            manager,
          )
        }

        // Atualizar a requisição
        const updatedRequisicao = repository.requisicaoEstoque.merge(
          { id: requisicao.id } as RequisicaoEstoque,
          {
            dataRequisicao: dto.dataRequisicao,
            ordemProducao: dto.ordemProducao,
            valorTotal: dto.valorTotal,
            obs: dto.obs,
            requisitante: { id: dto.requisitanteId },
            setor: { id: dto.setorId },
            armazem: { id: dto.armazemId },
            updatedBy: membership.user.id,
            itens: dto.itens.map((itemDTO) => ({
              id: itemDTO.id || undefined,
              insumo: { id: itemDTO.insumoId },
              quantidade: itemDTO.quantidade,
              unidade: itemDTO.unidade,
              valorUnitario: itemDTO.valorUnitario,
              createdBy: itemDTO.id ? undefined : membership.user.id,
              updatedBy: membership.user.id,
              organizationId: membership.organization.id,
            })),
          },
        )

        const savedRequisicao = await manager.save(
          RequisicaoEstoque,
          updatedRequisicao,
        )

        // Processar novas movimentações
        for (const item of savedRequisicao.itens) {
          await registrarSaidaEstoqueUseCase.execute(
            {
              insumo: item.insumo,
              armazem: savedRequisicao.armazem,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              undEstoque: item.unidade,
              documentoOrigemId: savedRequisicao.id,
              tipoDocumento: 'REQUISICAO-ESTOQUE',
              data: savedRequisicao.dataRequisicao,
            },
            membership,
            manager,
          )
        }

        return savedRequisicao
      },
    )
  },
}
