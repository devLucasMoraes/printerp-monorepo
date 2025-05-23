import { z } from 'zod'

export const emprestimoSchema = z.object({
  __typename: z.literal('Emprestimo').default('Emprestimo'),
  id: z.string(),
})

export type Emprestimo = z.infer<typeof emprestimoSchema>
