import { z } from 'zod'

import { requisitanteSchema } from '../models/requisitante'

export const requisitanteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Requisitante'), requisitanteSchema]),
])

export type RequisitanteSubject = z.infer<typeof requisitanteSubject>
