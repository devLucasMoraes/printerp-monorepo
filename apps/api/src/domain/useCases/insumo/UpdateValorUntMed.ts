import { EntityManager } from 'typeorm'

import { Insumo } from '@/domain/entities/Insumo'
import { BadRequestError } from '@/http/_errors/bad-request-error'

interface UpdateValorUntMedParams {
  insumo: Insumo
  quantidadeEntrada: number
  valorUnitarioEntrada: number
}

export const updateValorUntMedUseCase = {
  async execute(
    {
      insumo,
      quantidadeEntrada,
      valorUnitarioEntrada,
    }: UpdateValorUntMedParams,
    manager: EntityManager,
  ) {
    const insumoWithEstoque = await manager.findOne(Insumo, {
      where: { id: insumo.id },
      relations: ['estoques'],
    })

    if (!insumoWithEstoque) {
      throw new BadRequestError('Insumo não encontrado')
    }

    if (!insumoWithEstoque.valorUntMedAuto) {
      console.log({ insumo, quantidadeEntrada, valorUnitarioEntrada })
      return
    }

    const { quantidadeTotalEstoque, valorTotalEstoque } =
      insumoWithEstoque.estoques.reduce(
        (accumulator, itemEstoque) => {
          const quantidade = Number(itemEstoque.quantidade)
          const valorItem = quantidade * Number(insumoWithEstoque.valorUntMed)

          return {
            quantidadeTotalEstoque:
              accumulator.quantidadeTotalEstoque + quantidade,
            valorTotalEstoque: accumulator.valorTotalEstoque + valorItem,
          }
        },
        { quantidadeTotalEstoque: 0, valorTotalEstoque: 0 },
      )

    const valorTotalEntrada = quantidadeEntrada * valorUnitarioEntrada
    const novoValorTotalEstoque = valorTotalEstoque + valorTotalEntrada
    const novaQuantidadeTotal = quantidadeTotalEstoque + quantidadeEntrada

    if (novaQuantidadeTotal <= 0) {
      throw new BadRequestError(
        'Quantidade total não pode ser negativa ou zero',
      )
    }

    await manager.update(Insumo, insumo.id, {
      valorUntMed: novoValorTotalEstoque / novaQuantidadeTotal,
    })
  },
}
