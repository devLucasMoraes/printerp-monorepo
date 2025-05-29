import { api } from '../api/axios'

export interface GetArmazemResponse {
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

export async function getArmazem(orgSlug: string, armazemId: string) {
  const response = await api.get<GetArmazemResponse>(
    `/organizations/${orgSlug}/armazens/${armazemId}`,
  )
  return response.data
}
