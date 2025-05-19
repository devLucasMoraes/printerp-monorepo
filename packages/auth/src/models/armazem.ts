import { z } from 'zod'

export const armazemSchema = z.object({
  __typename: z.literal('Armazem').default('Armazem'),
  id: z.string(),
})

export type Armazem = z.infer<typeof armazemSchema>
