import type { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListFornecedorasResponse {
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

export async function listFornecedoras(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListFornecedorasResponse>>(
    `/organizations/${orgSlug}/fornecedoras/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
