import { api } from '../api/axios'

export interface GetCategoriaResponse {
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
export async function getCategoria(orgSlug: string, categoriaId: string) {
  const response = await api.get<GetCategoriaResponse>(
    `/organizations/${orgSlug}/categoria${categoriaId}`,
  )
  return response.data
}
