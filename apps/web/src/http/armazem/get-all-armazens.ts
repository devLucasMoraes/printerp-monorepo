import { api } from '../api/axios'

export interface GetAllArmazensResponse {
  id: string
  nome: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function getAllArmazens(orgSlug: string) {
  const response = await api.get<GetAllArmazensResponse[]>(
    `/organizations/${orgSlug}/armazens`,
  )
  return response.data
}
