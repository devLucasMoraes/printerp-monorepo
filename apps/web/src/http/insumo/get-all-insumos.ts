import { api } from '../api/axios'

export interface GetAllInsumosResponse {
  id: string
  descricao: string
  valorUntMed: number
  valorUntMedAuto: boolean
  permiteEstoqueNegativo: boolean
  undEstoque: string
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

export async function getAllInsumos(orgSlug: string) {
  const response = await api.get<GetAllInsumosResponse[]>(
    `/organizations/${orgSlug}/insumos`,
  )

  return response.data
}
