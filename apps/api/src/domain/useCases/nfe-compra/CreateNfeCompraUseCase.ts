import { Fornecedora } from '@/domain/entities/Fornecedora'
import { Member } from '@/domain/entities/Member'
import { Transportadora } from '@/domain/entities/Transportadora'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateNfeCompraDTO } from '@/http/routes/nfe-compra/create-nfe-compra'

import { Insumo } from '../../entities/Insumo'
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

      // Validação de itens
      for (const item of dto.itens) {
        if (item.quantidade <= 0) {
          throw new BadRequestError('Quantidade deve ser maior que zero')
        }

        const insumo = await manager.findOne(Insumo, {
          where: {
            id: item.insumoId,
            organizationId: membership.organization.id,
          },
        })
        if (!insumo) {
          throw new BadRequestError(`Insumo ${item.insumoId} não encontrado`)
        }

        if (item.unidade !== insumo.undEstoque) {
          throw new BadRequestError(
            `Unidade do insumo ${insumo.descricao} deve ser ${insumo.undEstoque}`,
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
        fornecedora: { id: dto.fornecedoraId },
        transportadora: { id: dto.transportadoraId },
        armazem: { id: dto.armazemId },
        itens: dto.itens.map((itemDTO) => ({
          insumo: { id: itemDTO.insumoId },
          quantidade: itemDTO.quantidade,
          unidade: itemDTO.unidade,
          valorUnitario: itemDTO.valorUnitario,
          valorIpi: itemDTO.valorIpi,
          descricaoFornecedora: itemDTO.descricaoFornecedora,
          referenciaFornecedora: itemDTO.referenciaFornecedora,
          createdBy: membership.user.id,
          updatedBy: membership.user.id,
          organizationId: membership.organization.id,
        })),
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      })

      const nfeCompra = await manager.save(NfeCompra, nfeCompraToCreate)

      // Processamento das movimentações
      for (const item of nfeCompra.itens) {
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
            armazem: nfeCompra.armazem,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            undEstoque: item.unidade,
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
