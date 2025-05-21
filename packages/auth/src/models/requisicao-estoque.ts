import { z } from 'zod'

export const requisicaoEstoqueSchema = z.object({
  __typename: z.literal('RequisicaoEstoque').default('RequisicaoEstoque'),
  id: z.string(),
})

export type RequisicaoEstoque = z.infer<typeof requisicaoEstoqueSchema>
