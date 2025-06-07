import { z } from 'zod'

export const transportadoraSchema = z.object({
  __typename: z.literal('Transportadora').default('Transportadora'),
  id: z.string(),
})

export type Transportadora = z.infer<typeof transportadoraSchema>
