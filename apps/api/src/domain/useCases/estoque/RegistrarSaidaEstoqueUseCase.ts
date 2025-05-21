import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'

import { Armazem } from '../../entities/Armazem'
import { Estoque } from '../../entities/Estoque'
import { Insumo } from '../../entities/Insumo'
import { MovimentoEstoque } from '../../entities/MovimentoEstoque'
import { Unidade } from '../../entities/Unidade'
import { atualizarConsumoMedioDiarioUseCase } from './AtualizarConsumoMedioDiarioUseCase'
import { inicializarEstoqueUseCase } from './InicializarEstoqueUseCase'

export const registrarSaidaEstoqueUseCase = {
  async execute(
    params: {
      insumo: Insumo
      armazem: Armazem
      quantidade: number
      valorUnitario: number
      undEstoque: Unidade
      tipoDocumento: string
      documentoOrigemId: string
      observacao?: string
      userId: string
      data: Date
      estorno?: boolean
    },
    membership: Member,
    manager: EntityManager,
  ): Promise<void> {
    const {
      insumo,
      armazem,
      quantidade,
      valorUnitario,
      undEstoque,
      tipoDocumento,
      documentoOrigemId,
      observacao,
      userId,
      data,
      estorno,
    } = params

    const estoque = await inicializarEstoqueUseCase.execute(
      insumo.id,
      armazem.id,
      membership,
      manager,
    )

    /*
    if (estoque.quantidade < quantidade) {
      throw new Error(
        `Saldo insuficiente para o insumo ${insumo.id} no armazém ${armazem.id}`
      );
    }
    */

    const movimento = repository.movimentoEstoque.create({
      tipo: 'SAIDA',
      data,
      quantidade,
      valorUnitario,
      undidade: undEstoque,
      documentoOrigemId,
      tipoDocumento,
      estorno,
      observacao,
      armazemOrigem: armazem,
      insumo,
      createdBy: userId,
      updatedBy: userId,
      organizationId: membership.organization.id,
    })

    await manager.save(MovimentoEstoque, movimento)

    estoque.quantidade = Number(estoque.quantidade) - Number(quantidade)
    await manager.save(Estoque, estoque)

    await atualizarConsumoMedioDiarioUseCase.execute(
      insumo.id,
      armazem.id,
      manager,
      true, // Forçar atualização
    )
  },
}
