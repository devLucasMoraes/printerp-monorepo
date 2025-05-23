import { z } from 'zod'

import { emprestimoSchema } from '../models/emprestimo'

export const emprestimoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Emprestimo'), emprestimoSchema]),
])

export type EmprestimoSubject = z.infer<typeof emprestimoSubject>
