import { z } from 'zod'

import { estoqueSchema } from '../models/estoque'

export const estoqueSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('adjust')]),
  z.union([z.literal('Estoque'), estoqueSchema]),
])

export type EstoqueSubject = z.infer<typeof estoqueSubject>
