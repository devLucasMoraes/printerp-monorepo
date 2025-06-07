import { api } from '../api/axios'

export interface GetAllTransportadorasResponse {
  id: string
  nomeFantasia: string
  razaoSocial: string
  cnpj: string
  fone: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function getAllTransportadoras(orgSlug: string) {
  const response = await api.get<GetAllTransportadorasResponse[]>(
    `/organizations/${orgSlug}/transportadoras`,
  )
  return response.data
}
