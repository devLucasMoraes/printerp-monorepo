import { api } from '../api/axios'

export interface GetAllCategoriaResponse {
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
export async function getCategoria(orgSlug: string, categoriaId: string) {
  const response = await api.get<GetAllCategoriaResponse>(
    `/organizations/${orgSlug}/categoria${categoriaId}`,
  )
  return response.data
}
