import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListCategoriasResponse {
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

export async function listCategorias(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListCategoriasResponse>>(
    `/organizations/${orgSlug}/categorias/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
