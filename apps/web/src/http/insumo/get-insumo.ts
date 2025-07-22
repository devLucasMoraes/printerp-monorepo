import type { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export interface GetInsumoResponse {
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

export async function getInsumo(orgSlug: string, insumoId: string) {
  const response = await api.get<GetInsumoResponse>(
    `/organizations/${orgSlug}/insumos/${insumoId}`,
  )
  return response.data
}
