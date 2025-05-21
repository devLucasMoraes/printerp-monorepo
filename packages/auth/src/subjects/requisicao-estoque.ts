import { z } from 'zod'

import { requisicaoEstoqueSchema } from '../models/requisicao-estoque'

export const requisicaoEstoqueSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('RequisicaoEstoque'), requisicaoEstoqueSchema]),
])

export type RequisicaoEstoqueSubject = z.infer<typeof requisicaoEstoqueSubject>
