import { api } from '../api/axios'

export interface GetAllParceirosResponse {
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

export async function getAllParceiros(orgSlug: string) {
  const response = await api.get<GetAllParceirosResponse[]>(
    `/organizations/${orgSlug}/parceiros`,
  )
  return response.data
}
