import type { Unidade } from '../../constants/Unidade'
import type { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListEstoquesResponse {
  id: string
  quantidade: number
  consumoMedioDiario: number | null
  ultimaAtualizacaoConsumo: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
  abaixoMinimo: boolean
  diasRestantes: number | null
  previsaoFimEstoque: string | null
  previsaoEstoqueMinimo: string | null
  armazem: {
    id: string
    nome: string
  }
  insumo: {
    id: string
    descricao: string
    undEstoque: Unidade
    categoria: {
      id: string
      nome: string
    }
    abaixoMinimo: boolean
  }
}

export async function listEstoques(
  orgSlug: string,
  { page = 0, size = 20, sort, filters }: PageParams = {},
) {
  const response = await api.get<Page<ListEstoquesResponse>>(
    `/organizations/${orgSlug}/estoques/list`,
    {
      params: { page, size, sort, ...filters },
    },
  )
  return response.data
}
