import { api } from '../api/axios'

export interface GetTransportadoraResponse {
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

export async function getTransportadora(
  orgSlug: string,
  transportadoraId: string,
) {
  const response = await api.get<GetTransportadoraResponse>(
    `/organizations/${orgSlug}/transportadoras/${transportadoraId}`,
  )
  return response.data
}
