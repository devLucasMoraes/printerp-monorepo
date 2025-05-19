import { z } from 'zod'

import { armazemSchema } from '../models/armazem'

export const armazemSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Armazem'), armazemSchema]),
])

export type ArmazemSubject = z.infer<typeof armazemSubject>
