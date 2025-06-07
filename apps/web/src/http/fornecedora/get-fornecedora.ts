import { api } from '../api/axios'

export interface GetFornecedoraResponse {
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

export async function getFornecedora(orgSlug: string, fornecedoraId: string) {
  const response = await api.get<GetFornecedoraResponse>(
    `/organizations/${orgSlug}/fornecedoras/${fornecedoraId}`,
  )
  return response.data
}
