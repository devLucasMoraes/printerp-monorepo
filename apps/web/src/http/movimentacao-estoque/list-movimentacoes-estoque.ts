import { Unidade } from '../../constants/Unidade'
import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListMovimentacoesEstoqueResponse {
  id: string
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA'
  data: string
  quantidade: number
  valorUnitario: number
  unidade: Unidade
  documentoOrigemId: string
  tipoDocumento: string
  estorno: boolean
  observacao: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
  armazemOrigem: {
    id: string
    nome: string
  } | null
  armazemDestino: {
    id: string
    nome: string
  } | null
  insumo: {
    id: string
    descricao: string
    undEstoque: Unidade
  }
}

export async function listMovimentacoesEstoque(
  orgSlug: string,
  { page = 0, size = 20, sort, filters }: PageParams = {},
) {
  const response = await api.get<Page<ListMovimentacoesEstoqueResponse>>(
    `/organizations/${orgSlug}/movimentacoes-estoque/list`,
    {
      params: { page, size, sort, ...filters },
    },
  )
  return response.data
}
