import { z } from 'zod'

import { insumoSchema } from '../models/insumo'

export const insumoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Insumo'), insumoSchema]),
])

export type InsumoSubject = z.infer<typeof insumoSubject>
