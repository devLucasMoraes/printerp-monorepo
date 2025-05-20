import { z } from 'zod'

import { parceiroSchema } from '../models/parceiro'

export const parceiroSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Parceiro'), parceiroSchema]),
])

export type ParceiroSubject = z.infer<typeof parceiroSubject>
