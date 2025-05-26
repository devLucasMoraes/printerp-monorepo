import { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListCatgoriasResponse {
  id: string
  nome: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  deletedBy: string
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function listCategorias(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListCatgoriasResponse>>(
    `/organizations/${orgSlug}/categorias/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
