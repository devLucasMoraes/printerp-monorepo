import { api } from '../api/axios'

export interface GetAllCategoriasResponse {
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

export async function getAllCategorias(orgSlug: string) {
  const response = await api.get<GetAllCategoriasResponse[]>(
    `/organizations/${orgSlug}/categorias`,
  )
  return response.data
}
