import { z } from 'zod'

export const nfeCompraSchema = z.object({
  __typename: z.literal('NfeCompra').default('NfeCompra'),
  id: z.string(),
})

export type NfeCompra = z.infer<typeof nfeCompraSchema>
