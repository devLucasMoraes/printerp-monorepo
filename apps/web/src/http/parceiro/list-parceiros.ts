import type { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListParceirosResponse {
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

export async function listParceiros(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListParceirosResponse>>(
    `/organizations/${orgSlug}/parceiros/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
