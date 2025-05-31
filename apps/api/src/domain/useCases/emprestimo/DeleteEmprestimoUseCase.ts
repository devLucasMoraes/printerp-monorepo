import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Emprestimo } from '../../entities/Emprestimo'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const deleteEmprestimoUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    return await repository.emprestimo.manager.transaction(async (manager) => {
      const emprestimoToDelete = await findEmprestimoToDelete(
        id,
        membership,
        manager,
      )

      await reverterMovimentacoes(emprestimoToDelete, membership, manager)

      await manager.update(Emprestimo, emprestimoToDelete.id, {
        deletedBy: membership.user.id,
      })

      await manager.softRemove(Emprestimo, emprestimoToDelete)
    })
  },
}

async function findEmprestimoToDelete(
  id: string,
  membership: Member,
  manager: EntityManager,
): Promise<Emprestimo> {
  const emprestimo = await manager.findOne(Emprestimo, {
    where: { id, organizationId: membership.organization.id },
    relations: {
      parceiro: true,
      armazem: true,
      itens: {
        insumo: true,
        devolucaoItens: {
          insumo: true,
        },
      },
    },
  })

  if (!emprestimo) {
    throw new BadRequestError('Emprestimo not found')
  }

  return emprestimo
}

async function reverterMovimentacoes(
  emprestimoToDelete: Emprestimo,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of emprestimoToDelete.itens) {
    for (const devolucaoItem of item.devolucaoItens) {
      const params = {
        insumo: devolucaoItem.insumo,
        armazem: emprestimoToDelete.armazem,
        quantidade: devolucaoItem.quantidade,
        valorUnitario: devolucaoItem.valorUnitario,
        undEstoque: devolucaoItem.unidade,
        documentoOrigemId: emprestimoToDelete.id,
        observacao: 'Movimentação gerada por atualização de emprestimo',
        data: emprestimoToDelete.dataEmprestimo,
        estorno: true,
      }

      if (emprestimoToDelete.tipo === 'SAIDA') {
        await registrarSaidaEstoqueUseCase.execute(
          { ...params, tipoDocumento: 'EMPRESTIMO' },
          membership,
          manager,
        )
      }

      if (emprestimoToDelete.tipo === 'ENTRADA') {
        await registrarEntradaEstoqueUseCase.execute(
          { ...params, tipoDocumento: 'EMPRESTIMO' },
          membership,
          manager,
        )
      }
    }

    const params = {
      insumo: item.insumo,
      armazem: emprestimoToDelete.armazem,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      undEstoque: item.unidade,
      documentoOrigemId: emprestimoToDelete.id.toString(),
      observacao: 'Movimentação gerada por atualização de emprestimo',
      data: emprestimoToDelete.dataEmprestimo,
      estorno: true,
    }

    if (emprestimoToDelete.tipo === 'SAIDA') {
      await registrarEntradaEstoqueUseCase.execute(
        { ...params, tipoDocumento: 'EMPRESTIMO' },
        membership,
        manager,
      )
    }

    if (emprestimoToDelete.tipo === 'ENTRADA') {
      await registrarSaidaEstoqueUseCase.execute(
        { ...params, tipoDocumento: 'EMPRESTIMO' },
        membership,
        manager,
      )
    }
  }
}
