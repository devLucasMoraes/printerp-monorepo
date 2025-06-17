import { Armazem } from '@/domain/entities/Armazem'
import { Fornecedora } from '@/domain/entities/Fornecedora'
import { Member } from '@/domain/entities/Member'
import { Transportadora } from '@/domain/entities/Transportadora'
import { Vinculo } from '@/domain/entities/Vinculo'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateNfeCompraDTO } from '@/http/routes/nfe-compra/create-nfe-compra'

import { NfeCompra } from '../../entities/NfeCompra'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { updateValorUntMedUseCase } from '../insumo/UpdateValorUntMed'

export const createNfeCompraUseCase = {
  async execute(
    dto: CreateNfeCompraDTO,
    membership: Member,
  ): Promise<NfeCompra> {
    return repository.nfeCompra.manager.transaction(async (manager) => {
      // Validação

      const nfe = await manager.findOne(NfeCompra, {
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

      if (nfe) {
        throw new BadRequestError('Nfe de compra ja cadastrada')
      }

      if (dto.itens.length === 0) {
        throw new BadRequestError(
          'Nota fiscal de compra deve ter pelo menos um item',
        )
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

      const armazem = await manager.findOneBy(Armazem, {
        id: dto.armazemId,
        organizationId: membership.organization.id,
      })
      if (!armazem) {
        throw new BadRequestError('Armazém não encontrado')
      }

      // Carregar e validar vínculos - armazenar em um Map para reutilizar
      const vinculosMap = new Map<string, Vinculo>()

      for (const item of dto.itens) {
        const vinculo = await manager.findOne(Vinculo, {
          where: {
            id: item.vinculoId,
            organizationId: membership.organization.id,
          },
          relations: {
            insumo: true,
          },
        })

        if (!vinculo) {
          throw new BadRequestError('Vinculo não encontrado')
        }

        // Armazenar o vínculo completo para usar depois
        vinculosMap.set(item.vinculoId, vinculo)

        if (item.qtdeNf <= 0) {
          throw new BadRequestError('Quantidade deve ser maior que zero')
        }

        if (vinculo.fornecedoraId !== fornecedora.id) {
          throw new BadRequestError(
            'Vinculo não pertence à Fornecedora informada',
          )
        }

        if (item.unidadeNf !== vinculo.undCompra) {
          throw new BadRequestError(
            `Unidade da NF (${item.unidadeNf}) diferente da unidade de compra (${vinculo.undCompra})`,
          )
        }

        if (vinculo.possuiConversao && !vinculo.qtdeEmbalagem) {
          throw new BadRequestError(
            'Vinculo possui conversão e não possui qtde de embalagem',
          )
        }

        if (
          vinculo.insumo.undEstoque !== item.unidadeNf &&
          !vinculo.possuiConversao
        ) {
          throw new BadRequestError(
            `Vinculo precisa de ter conversão para ${vinculo.insumo.undEstoque}`,
          )
        }
      }

      // Criação da requisição
      const nfeCompraToCreate = repository.nfeCompra.create({
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
        fornecedora, // Objeto completo ao invés de { id: dto.fornecedoraId }
        transportadora, // Objeto completo
        armazem, // Objeto completo
        itens: dto.itens.map((itemDTO) => {
          const vinculo = vinculosMap.get(itemDTO.vinculoId) // Usar o vínculo completo do Map
          return {
            qtdeNf: itemDTO.qtdeNf,
            unidadeNf: itemDTO.unidadeNf,
            valorUnitario: itemDTO.valorUnitario,
            valorIpi: itemDTO.valorIpi,
            descricaoFornecedora: itemDTO.descricaoFornecedora,
            codFornecedora: itemDTO.codFornecedora,
            vinculo, // Objeto completo com todas as propriedades
            createdBy: membership.user.id,
            updatedBy: membership.user.id,
            organizationId: membership.organization.id,
          }
        }),
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      const nfeCompra = await manager.save(NfeCompra, nfeCompraToCreate)

      // Processamento das movimentações
      for (const item of nfeCompra.itens) {
        // Agora item.vinculo terá todas as propriedades carregadas
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
            armazem: nfeCompra.armazem,
            quantidade,
            valorUnitario: item.valorUnitario,
            undEstoque: item.vinculo.insumo.undEstoque,
            documentoOrigemId: nfeCompra.id,
            tipoDocumento: 'NFE-COMPRA',
            data: nfeCompra.dataRecebimento,
          },
          membership,
          manager,
        )
      }

      return nfeCompra
    })
  },
}
