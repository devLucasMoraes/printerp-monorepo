import { z } from 'zod'

import { nfeCompraSchema } from '../models/nfe-compra'

export const nfeCompraSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('NfeCompra'), nfeCompraSchema]),
])

export type NfeCompraSubject = z.infer<typeof nfeCompraSubject>
