import { z } from 'zod'

export const setorSchema = z.object({
  __typename: z.literal('Setor').default('Setor'),
  id: z.string(),
})

export type Setor = z.infer<typeof setorSchema>
