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
          itens: { insumo: true },
          armazem: true,
        },
        withDeleted: true,
      })

      if (!requisicao) {
        throw new BadRequestError('Nfe de Compra não encontrada')
      }

      if (requisicao.deletedAt) {
        throw new BadRequestError('Nfe de Compra já está desativada')
      }

      // Reverter movimentações para cada item
      for (const item of requisicao.itens) {
        await registrarSaidaEstoqueUseCase.execute(
          {
            insumo: item.insumo,
            armazem: requisicao.armazem,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            undEstoque: item.unidade,
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

      await manager.softDelete(NfeCompra, id)
    })
  },
}
