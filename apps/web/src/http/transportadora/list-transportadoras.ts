import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListTransportadorasResponse {
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

export async function listTransportadoras(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListTransportadorasResponse>>(
    `/organizations/${orgSlug}/transportadoras/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
