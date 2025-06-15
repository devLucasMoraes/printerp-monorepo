import { z } from 'zod'

import { vinculoSchema } from '../models/vinculo'

export const vinculoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Vinculo'), vinculoSchema]),
])

export type VinculoSubject = z.infer<typeof vinculoSubject>
