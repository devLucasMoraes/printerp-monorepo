import { z } from 'zod'

export const requisitanteSchema = z.object({
  __typename: z.literal('Requisitante').default('Requisitante'),
  id: z.string(),
})

export type Requisitante = z.infer<typeof requisitanteSchema>
