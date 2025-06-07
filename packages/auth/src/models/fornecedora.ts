import { z } from 'zod'

export const fornecedoraSchema = z.object({
  __typename: z.literal('Fornecedora').default('Fornecedora'),
  id: z.string(),
})

export type Fornecedora = z.infer<typeof fornecedoraSchema>
