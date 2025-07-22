import type { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListSetoresResponse {
  id: string
  nome: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function listSetores(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListSetoresResponse>>(
    `/organizations/${orgSlug}/setores/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
