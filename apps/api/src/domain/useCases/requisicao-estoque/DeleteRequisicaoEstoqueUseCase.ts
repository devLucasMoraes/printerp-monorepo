import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'

export const deleteRequisicaoEstoqueUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.requisicaoEstoque.manager.transaction(async (manager) => {
      const requisicao = await manager.findOne(RequisicaoEstoque, {
        where: {
          id,
          organizationId: membership.organization.id,
        },
        relations: {
          itens: { insumo: true },
          armazem: true,
        },
        withDeleted: true,
      })

      if (!requisicao) {
        throw new BadRequestError('Requisição de estoque não encontrada')
      }

      if (requisicao.deletedAt) {
        throw new BadRequestError('Requisição de estoque já está desativada')
      }

      // Reverter movimentações para cada item
      for (const item of requisicao.itens) {
        await registrarEntradaEstoqueUseCase.execute(
          {
            insumo: item.insumo,
            armazem: requisicao.armazem,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            undEstoque: item.unidade,
            documentoOrigemId: requisicao.id,
            tipoDocumento: 'REQUISICAO-ESTOQUE',
            observacao: `Estorno da requisição ${requisicao.id}`,
            data: requisicao.dataRequisicao,
            estorno: true,
          },
          membership,
          manager,
        )
      }

      await manager.update(RequisicaoEstoque, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(RequisicaoEstoque, id)
    })
  },
}
