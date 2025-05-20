import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { AdjustEstoqueDTO } from '@/http/routes/estoque/adjust-estoque'

import { Estoque } from '../../entities/Estoque'
import { MovimentoEstoque } from '../../entities/MovimentoEstoque'
import { atualizarConsumoMedioDiarioUseCase } from './AtualizarConsumoMedioDiarioUseCase'

export const adjustEstoqueUseCase = {
  async execute(
    id: string,
    dto: AdjustEstoqueDTO,
    membership: Member,
  ): Promise<Estoque> {
    return await repository.estoque.manager.transaction(async (manager) => {
      const estoqueToAdjust = await findEstoque(id, manager)
      await validate(estoqueToAdjust, dto)
      await processarMovimentacoes(estoqueToAdjust, dto, membership, manager)
      const adjustedEstoque = await adjustEstoque(
        estoqueToAdjust,
        dto,
        membership,
        manager,
      )
      await atualizarConsumoMedioDiario(adjustedEstoque, manager)

      return adjustedEstoque
    })
  },
}

async function findEstoque(
  id: string,
  manager: EntityManager,
): Promise<Estoque> {
  const estoque = await manager.findOne(Estoque, {
    where: { id },
    relations: {
      insumo: true,
      armazem: true,
    },
  })

  if (!estoque) {
    throw new BadRequestError('RequisicaoEstoque not found')
  }

  return estoque
}

async function validate(
  estoqueToAdjust: Estoque,
  dto: AdjustEstoqueDTO,
): Promise<void> {
  const diferenca = Number(dto.quantidade) - Number(estoqueToAdjust.quantidade)

  if (diferenca === 0) {
    throw new BadRequestError('Quantidade a ser ajustada não pode ser a mesma')
  }
}

async function adjustEstoque(
  estoqueToAdjust: Estoque,
  dto: AdjustEstoqueDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Estoque> {
  const ajustEstoqueDto = repository.estoque.create({
    quantidade: dto.quantidade,
    updatedBy: membership.user.id,
  })

  const ajustedEstoque = repository.estoque.merge(
    estoqueToAdjust,
    ajustEstoqueDto,
  )

  return await manager.save(Estoque, ajustedEstoque)
}

async function processarMovimentacoes(
  estoque: Estoque,
  dto: AdjustEstoqueDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const diferenca = Number(dto.quantidade) - Number(estoque.quantidade)

  if (diferenca > 0) {
    const movimentacaoEntrada = repository.movimentoEstoque.create({
      tipo: 'ENTRADA',
      data: new Date(),
      quantidade: Math.abs(diferenca),
      valorUnitario: estoque.insumo.valorUntMed,
      undidade: estoque.insumo.undEstoque,
      documentoOrigemId: estoque.id.toString(),
      tipoDocumento: 'ESTOQUE',
      observacao: 'Ajuste de estoque',
      armazemDestino: estoque.armazem,
      insumo: estoque.insumo,
      createdBy: membership.user.id,
      updatedBy: membership.user.id,
      organizationId: membership.organization.id,
    })

    await manager.save(MovimentoEstoque, movimentacaoEntrada)
  }

  if (diferenca < 0) {
    const movimentacaoSaida = repository.movimentoEstoque.create({
      tipo: 'SAIDA',
      data: new Date(),
      quantidade: Math.abs(diferenca),
      valorUnitario: estoque.insumo.valorUntMed,
      undidade: estoque.insumo.undEstoque,
      documentoOrigemId: estoque.id.toString(),
      tipoDocumento: 'ESTOQUE',
      observacao: 'Ajuste de estoque',
      armazemOrigem: estoque.armazem,
      insumo: estoque.insumo,
      createdBy: membership.user.id,
      updatedBy: membership.user.id,
      organizationId: membership.organization.id,
    })

    await manager.save(MovimentoEstoque, movimentacaoSaida)
  }
}

async function atualizarConsumoMedioDiario(
  estoque: Estoque,
  manager: EntityManager,
): Promise<void> {
  await atualizarConsumoMedioDiarioUseCase.execute(
    estoque.insumo.id,
    estoque.armazem.id,
    manager,
    true, // Forçar atualização
  )
}
