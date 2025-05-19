import { z } from 'zod'

import { setorSchema } from '../models/setor'

export const setorSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Setor'), setorSchema]),
])

export type SetorSubject = z.infer<typeof setorSubject>
