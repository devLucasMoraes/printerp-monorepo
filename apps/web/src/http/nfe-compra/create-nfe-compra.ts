import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const createNfeCompraSchema = z.object({
  nfe: z.string(),
  chaveNfe: z.string(),
  dataEmissao: z.date(),
  dataRecebimento: z.date(),
  valorTotalProdutos: z.number().nonnegative(),
  valorFrete: z.number().nonnegative(),
  valorTotalIpi: z.number().nonnegative(),
  valorSeguro: z.number().nonnegative(),
  valorDesconto: z.number().nonnegative(),
  valorTotalNfe: z.number().nonnegative(),
  valorOutros: z.number().nonnegative(),
  observacao: z.string().nullable(),
  fornecedoraId: z.string().uuid(),
  transportadoraId: z.string().uuid(),
  armazemId: z.string().uuid(),
  itens: z.array(
    z.object({
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      valorIpi: z.number().nonnegative(),
      descricaoFornecedora: z.string(),
      referenciaFornecedora: z.string(),
      insumoId: z.string().uuid(),
    }),
  ),
})

export type CreateNfeCompraDTO = z.infer<typeof createNfeCompraSchema>

export interface CreateNfeCompraResponse {
  nfeCompraId: string
}

export async function createNfeCompra(
  orgSlug: string,
  dto: CreateNfeCompraDTO,
) {
  const result = await api.post<CreateNfeCompraResponse>(
    `/organizations/${orgSlug}/nfes-compra`,
    dto,
  )
  return result.data
}
