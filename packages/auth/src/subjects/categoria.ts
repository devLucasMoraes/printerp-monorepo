import { z } from 'zod'

import { categoriaSchema } from '../models/categoria'

export const categoriaSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Categoria'), categoriaSchema]),
])

export type CategoriaSubject = z.infer<typeof categoriaSubject>
