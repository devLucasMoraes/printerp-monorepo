import { EntityManager } from 'typeorm'

import { Fornecedora } from '@/domain/entities/Fornecedora'
import { Member } from '@/domain/entities/Member'
import { Transportadora } from '@/domain/entities/Transportadora'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateNfeCompraDTO } from '@/http/routes/nfe-compra/update-nfe-compra'

import { Armazem } from '../../entities/Armazem'
import { Insumo } from '../../entities/Insumo'
import { NfeCompra } from '../../entities/NfeCompra'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'
import { updateValorUntMedUseCase } from '../insumo/UpdateValorUntMed'

export const updateNfeCompraUseCase = {
  async execute(
    id: string,
    dto: UpdateNfeCompraDTO,
    membership: Member,
  ): Promise<NfeCompra> {
    return repository.nfeCompra.manager.transaction(
      async (manager: EntityManager) => {
        // Busca a requisição com todas as relações necessárias
        const nfeCompra = await manager.findOne(NfeCompra, {
          where: {
            id,
            organizationId: membership.organization.id,
          },
          relations: {
            fornecedora: true,
            transportadora: true,
            armazem: true,
            itens: { insumo: true },
          },
        })

        if (!nfeCompra) {
          throw new BadRequestError('Nfe de compra de estoque não encontrada')
        }

        // Validações
        if (dto.itens.length === 0) {
          throw new BadRequestError('Nfe de compra deve ter pelo menos um item')
        }

        const fornecedora = await manager.findOne(Fornecedora, {
          where: {
            id: dto.fornecedoraId,
            organizationId: membership.organization.id,
          },
        })
        if (!fornecedora) {
          throw new BadRequestError('Fornecedora não encontrada')
        }

        const transportadora = await manager.findOne(Transportadora, {
          where: {
            id: dto.transportadoraId,
            organizationId: membership.organization.id,
          },
        })
        if (!transportadora) {
          throw new BadRequestError('Transportadora não encontrada')
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
            throw new BadRequestError(`Insumo não encontrado`)
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
            const itemExists = nfeCompra.itens.some(
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
        for (const item of nfeCompra.itens) {
          await registrarSaidaEstoqueUseCase.execute(
            {
              insumo: item.insumo,
              armazem: nfeCompra.armazem,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              undEstoque: item.unidade,
              documentoOrigemId: nfeCompra.id,
              observacao: `Nfe de compra ${nfeCompra.id} foi alterada, estorno referente ao item ${item.id}`,
              tipoDocumento: 'NFE-COMPRA',
              data: nfeCompra.dataRecebimento,
              estorno: true,
            },
            membership,
            manager,
          )
        }

        // Atualizar a requisição
        const updatedNfe = repository.nfeCompra.merge(
          { id: nfeCompra.id } as NfeCompra,
          {
            nfe: dto.nfe,
            chaveNfe: dto.chaveNfe,
            dataEmissao: dto.dataEmissao,
            dataRecebimento: dto.dataRecebimento,
            valorTotalProdutos: dto.valorTotalProdutos,
            valorFrete: dto.valorFrete,
            valorTotalIpi: dto.valorTotalIpi,
            valorSeguro: dto.valorSeguro,
            valorDesconto: dto.valorDesconto,
            valorTotalNfe: dto.valorTotalNfe,
            valorOutros: dto.valorOutros,
            observacao: dto.observacao,
            fornecedora: { id: dto.fornecedoraId },
            transportadora: { id: dto.transportadoraId },
            armazem: { id: dto.armazemId },
            itens: dto.itens.map((itemDTO) => ({
              id: itemDTO.id || undefined,
              insumo: { id: itemDTO.insumoId },
              quantidade: itemDTO.quantidade,
              unidade: itemDTO.unidade,
              valorUnitario: itemDTO.valorUnitario,
              valorIpi: itemDTO.valorIpi,
              descricaoFornecedora: itemDTO.descricaoFornecedora,
              referenciaFornecedora: itemDTO.referenciaFornecedora,
              createdBy: itemDTO.id ? undefined : membership.user.id,
              updatedBy: membership.user.id,
              organizationId: membership.organization.id,
            })),
          },
        )

        const savedNfe = await manager.save(NfeCompra, updatedNfe)

        // Processar novas movimentações
        for (const item of savedNfe.itens) {
          await updateValorUntMedUseCase.execute(
            {
              insumo: item.insumo,
              valorUnitarioEntrada: item.valorUnitario,
              quantidadeEntrada: item.quantidade,
            },
            manager,
          )
          await registrarEntradaEstoqueUseCase.execute(
            {
              insumo: item.insumo,
              armazem: savedNfe.armazem,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              undEstoque: item.unidade,
              documentoOrigemId: savedNfe.id,
              tipoDocumento: 'NFE-COMPRA',
              observacao: `Nfe de compra ${savedNfe.id} foi alterada, entrada referente ao item ${item.id}`,
              data: savedNfe.dataRecebimento,
            },
            membership,
            manager,
          )
        }

        return savedNfe
      },
    )
  },
}
