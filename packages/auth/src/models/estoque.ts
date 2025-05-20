import { z } from 'zod'

export const estoqueSchema = z.object({
  __typename: z.literal('Estoque').default('Estoque'),
  id: z.string(),
})

export type Estoque = z.infer<typeof estoqueSchema>
