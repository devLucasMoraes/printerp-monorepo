import { z } from 'zod'

import { api } from '../api/axios'

export const createCategoriaSchema = z.object({
  nome: z.string(),
})

export type CreateCategoriaDTO = z.infer<typeof createCategoriaSchema>

export interface CreateCategoriaResponse {
  categoriaId: string
}

export async function createCategoria(
  orgSlug: string,
  { nome }: CreateCategoriaDTO,
) {
  const result = await api.post<CreateCategoriaResponse>(
    `/organizations/${orgSlug}/categorias`,
    {
      nome,
    },
  )
  return result.data
}
