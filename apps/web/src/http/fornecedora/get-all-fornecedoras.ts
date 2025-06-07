import { api } from '../api/axios'

export interface GetAllFornecedorasResponse {
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

export async function getAllFornecedoras(orgSlug: string) {
  const response = await api.get<GetAllFornecedorasResponse[]>(
    `/organizations/${orgSlug}/fornecedoras`,
  )
  return response.data
}
