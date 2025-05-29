import { api } from '../api/axios'

export interface GetAllRequisitantesResponse {
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

export async function getAllRequisitantes(orgSlug: string) {
  const response = await api.get<GetAllRequisitantesResponse[]>(
    `/organizations/${orgSlug}/requisitantes`,
  )
  return response.data
}
