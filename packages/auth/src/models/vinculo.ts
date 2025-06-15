import { z } from 'zod'

export const vinculoSchema = z.object({
  __typename: z.literal('Vinculo').default('Vinculo'),
  id: z.string(),
})

export type Vinculo = z.infer<typeof vinculoSchema>
