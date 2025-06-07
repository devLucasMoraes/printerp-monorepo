import { z } from 'zod'

import { transportadoraSchema } from '../models/transportadora'

export const transportadoraSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Transportadora'), transportadoraSchema]),
])

export type TransportadoraSubject = z.infer<typeof transportadoraSubject>
