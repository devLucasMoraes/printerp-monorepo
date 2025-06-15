import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export interface GetAllNfesCompraResponse {
  id: string
  nfe: string
  chaveNfe: string
  dataEmissao: string
  dataRecebimento: string
  valorTotalProdutos: number
  valorFrete: number
  valorTotalIpi: number
  valorSeguro: number
  valorDesconto: number
  valorTotalNfe: number
  valorOutros: number
  observacao: string | null
  fornecedora: {
    id: string
    nomeFantasia: string
  }
  transportadora: {
    id: string
    nomeFantasia: string
  }
  armazem: {
    id: string
    nome: string
  }
  itens: {
    id: string
    qtdeNf: number
    unidadeNf: Unidade
    valorUnitario: number
    valorIpi: number
    descricaoFornecedora: string
    codFornecedora: string
    vinculo: {
      id: string
      cod: string
      undCompra: Unidade
      possuiConversao: boolean
      qtdeEmbalagem: number | null
      insumoId: string
      fornecedoraId: string
      insumo: {
        id: string
        descricao: string
        valorUntMed: number
        undEstoque: Unidade
      }
    }
  }[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function getAllNfesCompra(orgSlug: string) {
  const response = await api.get<GetAllNfesCompraResponse[]>(
    `/organizations/${orgSlug}/nfes-compra`,
  )
  return response.data
}
