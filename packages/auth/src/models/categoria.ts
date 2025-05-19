import { z } from 'zod'

export const categoriaSchema = z.object({
  __typename: z.literal('Categoria').default('Categoria'),
  id: z.string(),
})

export type Categoria = z.infer<typeof categoriaSchema>
