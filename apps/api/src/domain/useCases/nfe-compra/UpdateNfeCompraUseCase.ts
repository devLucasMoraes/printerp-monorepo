import { EntityManager } from 'typeorm'

import { Fornecedora } from '@/domain/entities/Fornecedora'
import { Member } from '@/domain/entities/Member'
import { Transportadora } from '@/domain/entities/Transportadora'
import { Vinculo } from '@/domain/entities/Vinculo'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateNfeCompraDTO } from '@/http/routes/nfe-compra/update-nfe-compra'

import { Armazem } from '../../entities/Armazem'
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
            itens: { vinculo: { insumo: true } },
          },
        })

        if (!nfeCompra) {
          throw new BadRequestError('Nfe de compra de estoque não encontrada')
        }

        // Validações

        const existingNfe = await manager.findOne(NfeCompra, {
          where: [
            {
              nfe: dto.nfe,
              organizationId: membership.organization.id,
            },
            {
              chaveNfe: dto.chaveNfe,
              organizationId: membership.organization.id,
            },
          ],
        })

        if (existingNfe && existingNfe.id !== id) {
          const isDuplicateNfe = existingNfe.nfe === dto.nfe
          const isDuplicateChave = existingNfe.chaveNfe === dto.chaveNfe

          if (isDuplicateNfe && isDuplicateChave) {
            throw new BadRequestError(
              'NFe de compra já cadastrada (número e chave duplicados)',
            )
          } else if (isDuplicateNfe) {
            throw new BadRequestError('Número da NFe já cadastrado')
          } else {
            throw new BadRequestError('Chave da NFe já cadastrada')
          }
        }

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
        const vinculosMap = new Map<string, Vinculo>()
        for (const itemDTO of dto.itens) {
          const vinculo = await manager.findOne(Vinculo, {
            where: {
              id: itemDTO.vinculoId,
              organizationId: membership.organization.id,
            },
            relations: {
              insumo: true,
            },
          })

          if (!vinculo) {
            throw new BadRequestError('Vinculo não encontrado')
          }

          vinculosMap.set(itemDTO.vinculoId, vinculo)

          if (itemDTO.qtdeNf <= 0) {
            throw new BadRequestError('Quantidade deve ser maior que zero')
          }

          if (itemDTO.unidadeNf !== vinculo.undCompra) {
            throw new BadRequestError(
              `Unidade da NF (${itemDTO.unidadeNf}) diferente da unidade de compra (${vinculo.undCompra})`,
            )
          }

          if (vinculo.possuiConversao && !vinculo.qtdeEmbalagem) {
            throw new BadRequestError(
              'Vinculo possui conversão e não possui qtde de embalagem',
            )
          }

          if (
            vinculo.insumo.undEstoque !== itemDTO.unidadeNf &&
            !vinculo.possuiConversao
          ) {
            throw new BadRequestError(
              `Vinculo precisa de ter conversão para ${vinculo.insumo.undEstoque}`,
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
          const possuiConversao = item.vinculo.possuiConversao

          const quantidade = possuiConversao
            ? item.vinculo.qtdeEmbalagem! * item.qtdeNf
            : item.qtdeNf

          await registrarSaidaEstoqueUseCase.execute(
            {
              insumo: item.vinculo.insumo,
              armazem: nfeCompra.armazem,
              quantidade,
              valorUnitario: item.valorUnitario,
              undEstoque: item.vinculo.insumo.undEstoque,
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
            itens: dto.itens.map((itemDTO) => {
              const vinculo = vinculosMap.get(itemDTO.vinculoId)! // Usar o vínculo completo do Map
              return {
                id: itemDTO.id || undefined,
                vinculo, // Objeto completo com todas as propriedades
                qtdeNf: itemDTO.qtdeNf,
                unidadeNf: itemDTO.unidadeNf,
                valorUnitario: itemDTO.valorUnitario,
                valorIpi: itemDTO.valorIpi,
                descricaoFornecedora: itemDTO.descricaoFornecedora,
                codFornecedora: itemDTO.codFornecedora,
                createdBy: itemDTO.id ? undefined : membership.user.id,
                updatedBy: membership.user.id,
                organizationId: membership.organization.id,
              }
            }),
          },
        )

        const savedNfe = await manager.save(NfeCompra, updatedNfe)

        // Processar novas movimentações
        for (const item of savedNfe.itens) {
          const possuiConversao = item.vinculo.possuiConversao

          const quantidade = possuiConversao
            ? item.vinculo.qtdeEmbalagem! * item.qtdeNf
            : item.qtdeNf
          await updateValorUntMedUseCase.execute(
            {
              insumo: item.vinculo.insumo,
              valorUnitarioEntrada: item.valorUnitario,
              quantidadeEntrada: quantidade,
            },
            manager,
          )
          await registrarEntradaEstoqueUseCase.execute(
            {
              insumo: item.vinculo.insumo,
              armazem: savedNfe.armazem,
              quantidade,
              valorUnitario: item.valorUnitario,
              undEstoque: item.vinculo.insumo.undEstoque,
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
