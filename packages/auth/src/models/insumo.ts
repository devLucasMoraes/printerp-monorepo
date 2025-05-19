import { z } from 'zod'

export const insumoSchema = z.object({
  __typename: z.literal('Insumo').default('Insumo'),
  id: z.string(),
})

export type Insumo = z.infer<typeof insumoSchema>
