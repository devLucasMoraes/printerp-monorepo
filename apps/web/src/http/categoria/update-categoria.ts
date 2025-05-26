import { z } from 'zod'

import { api } from '../api/axios'

export const updateCategoriaSchema = z.object({
  nome: z.string(),
})

export type UpdateCategoriaDTO = z.infer<typeof updateCategoriaSchema>

export interface UpdateCategoriaResponse {
  categoriaId: string
}

export async function updateCategoria(
  id: string,
  orgSlug: string,
  { nome }: UpdateCategoriaDTO,
) {
  const result = await api.put<UpdateCategoriaResponse>(
    `/organizations/${orgSlug}/categorias/${id}`,
    {
      nome,
    },
  )
  return result.data
}
