import { z } from 'zod'

export const categoriaSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
})

export type Categoria = z.infer<typeof categoriaSchema>
