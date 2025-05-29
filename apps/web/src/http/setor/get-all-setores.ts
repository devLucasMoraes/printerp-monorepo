import { api } from '../api/axios'

export interface GetAllSetoresResponse {
  id: string
  nome: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function getAllSetores(orgSlug: string) {
  const response = await api.get<GetAllSetoresResponse[]>(
    `/organizations/${orgSlug}/setores`,
  )
  return response.data
}
