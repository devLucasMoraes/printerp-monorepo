import { Unidade } from '../../constants/Unidade'
import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListInsumosResponse {
  id: string
  descricao: string
  valorUntMed: number
  valorUntMedAuto: boolean
  permiteEstoqueNegativo: boolean
  undEstoque: Unidade
  estoqueMinimo: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
  categoria: {
    id: string
    nome: string
  }
}

export async function listInsumos(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListInsumosResponse>>(
    `/organizations/${orgSlug}/insumos/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
