import { z } from 'zod'

export const chartSchema = z.object({
  __typename: z.literal('Chart').default('Chart'),
  id: z.string(),
})

export type Chart = z.infer<typeof chartSchema>
