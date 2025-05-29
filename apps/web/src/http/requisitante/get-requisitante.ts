import { api } from '../api/axios'

export interface GetRequisitanteResponse {
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

export async function getRequisitante(orgSlug: string, requisitanteId: string) {
  const response = await api.get<GetRequisitanteResponse>(
    `/organizations/${orgSlug}/requisitantes/${requisitanteId}`,
  )
  return response.data
}
