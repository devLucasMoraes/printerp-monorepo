import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { NfeCompra } from '../../entities/NfeCompra'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const deleteNfeCompraUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.nfeCompra.manager.transaction(async (manager) => {
      const requisicao = await manager.findOne(NfeCompra, {
        where: {
          id,
          organizationId: membership.organization.id,
        },
        relations: {
          itens: {
            vinculo: {
              insumo: true,
            },
          },
          armazem: true,
        },
      })

      if (!requisicao) {
        throw new BadRequestError('Nfe de Compra não encontrada')
      }

      // Reverter movimentações para cada item
      for (const item of requisicao.itens) {
        if (!requisicao.addEstoque) {
          break
        }

        if (!requisicao.armazem)
          throw new BadRequestError('Armazém precisa ser informado')

        const possuiConversao = item.vinculo.possuiConversao

        const quantidade = possuiConversao
          ? item.vinculo.qtdeEmbalagem! * item.qtdeNf
          : item.qtdeNf

        await registrarSaidaEstoqueUseCase.execute(
          {
            insumo: item.vinculo.insumo,
            armazem: requisicao.armazem,
            quantidade,
            valorUnitario: item.valorUnitario,
            undEstoque: item.vinculo.insumo.undEstoque,
            documentoOrigemId: requisicao.id,
            tipoDocumento: 'NFE-COMPRA',
            observacao: `Nfe de compra ${requisicao.id} foi desativada/cancelada `,
            data: requisicao.dataRecebimento,
            estorno: true,
          },
          membership,
          manager,
        )
      }

      await manager.update(NfeCompra, id, {
        deletedBy: membership.user.id,
      })

      await manager.softRemove(NfeCompra, requisicao)
    })
  },
}
