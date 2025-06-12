import { api } from '../api/axios'

export interface GetFornecedoraByCnpjResponse {
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

export async function getFornecedoraByCnpj(orgSlug: string, cnpj: string) {
  const response = await api.get<GetFornecedoraByCnpjResponse>(
    `/organizations/${orgSlug}/fornecedoras/cnpj/${cnpj}`,
  )
  return response.data
}
