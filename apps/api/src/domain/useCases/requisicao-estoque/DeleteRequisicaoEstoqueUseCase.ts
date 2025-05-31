import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'

export const deleteRequisicaoEstoqueUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.requisicaoEstoque.manager.transaction(
      async (manager) => {
        const requisicaoToDelete = await findRequisicaoToDelete(
          id,
          membership,
          manager,
        )

        await reverterMovimentacoes(requisicaoToDelete, membership, manager)

        await manager.update(RequisicaoEstoque, requisicaoToDelete.id, {
          deletedBy: membership.user.id,
        })

        await manager.softRemove(RequisicaoEstoque, requisicaoToDelete)
      },
    )
  },
}

async function findRequisicaoToDelete(
  id: string,
  membership: Member,
  manager: EntityManager,
): Promise<RequisicaoEstoque> {
  const requisicao = await manager.findOne(RequisicaoEstoque, {
    where: { id, organizationId: membership.organization.id },
    relations: {
      requisitante: true,
      setor: true,
      armazem: true,
      itens: {
        insumo: true,
      },
    },
  })

  if (!requisicao) {
    throw new BadRequestError('RequisicaoEstoque not found')
  }

  return requisicao
}

async function reverterMovimentacoes(
  requisicaoToDelete: RequisicaoEstoque,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of requisicaoToDelete.itens) {
    await registrarEntradaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: requisicaoToDelete.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigemId: requisicaoToDelete.id,
        tipoDocumento: 'REQUISICAO-ESTOQUE',
        observacao: `Estorno da movimentação ${requisicaoToDelete.id} - requisição deletada`,
        data: requisicaoToDelete.dataRequisicao,
        estorno: true,
      },
      membership,
      manager,
    )
  }
}
