import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const createInsumoSchema = z.object({
  descricao: z.string().nonempty(),
  undEstoque: z.nativeEnum(Unidade),
  valorUntMed: z.number().optional(),
  valorUntMedAuto: z.boolean().optional(),
  permiteEstoqueNegativo: z.boolean().optional(),
  estoqueMinimo: z.number().optional(),
  categoriaId: z.string().uuid(),
})

export type CreateInsumoDTO = z.infer<typeof createInsumoSchema>

export type CreateInsumoResponse = {
  insumoId: string
}

export async function createInsumo(orgSlug: string, data: CreateInsumoDTO) {
  const result = await api.post<CreateInsumoResponse>(
    `/organizations/${orgSlug}/insumos`,
    data,
  )
  return result.data
}
