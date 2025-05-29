import { z } from 'zod'

import { api } from '../api/axios'

export const updateCategoriaSchema = z.object({
  nome: z.string(),
})

export type UpdateCategoriaDTO = z.infer<typeof updateCategoriaSchema>

export async function updateCategoria(
  id: string,
  orgSlug: string,
  { nome }: UpdateCategoriaDTO,
) {
  await api.put(`/organizations/${orgSlug}/categorias/${id}`, {
    nome,
  })
}
