import { api } from '../api/axios'

export async function deleteCategoria(categoriaId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/categorias/${categoriaId}`)
}
