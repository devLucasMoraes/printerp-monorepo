import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListArmazensResponse {
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

export async function listArmazens(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams,
) {
  const response = await api.get<Page<ListArmazensResponse>>(
    `/organizations/${orgSlug}/armazens/list`,
    {
      params: {
        page,
        size,
        sort,
      },
    },
  )

  return response.data
}
