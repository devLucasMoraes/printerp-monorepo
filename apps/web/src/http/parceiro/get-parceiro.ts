import { api } from '../api/axios'

export interface GetParceiroResponse {
  id: string
  nome: string
  fone: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function getParceiro(orgSlug: string, parceiroId: string) {
  const response = await api.get<GetParceiroResponse>(
    `/organizations/${orgSlug}/parceiros/${parceiroId}`,
  )
  return response.data
}
