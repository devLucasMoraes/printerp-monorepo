import { api } from '../api/axios'

export interface GetSetorResponse {
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

export async function getSetor(orgSlug: string, setorId: string) {
  const response = await api.get<GetSetorResponse>(
    `/organizations/${orgSlug}/setores/${setorId}`,
  )
  return response.data
}
