import { api } from '../api/axios'

export interface GetTransportadoraByCnpjResponse {
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

export async function getTransportadoraByCnpj(orgSlug: string, cnpj: string) {
  const response = await api.get<GetTransportadoraByCnpjResponse>(
    `/organizations/${orgSlug}/transportadoras/cnpj/${cnpj}`,
  )
  return response.data
}
