import { z } from 'zod'

import { fornecedoraSchema } from '../models/fornecedora'

export const fornecedoraSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Fornecedora'), fornecedoraSchema]),
])

export type FornecedoraSubject = z.infer<typeof fornecedoraSubject>
