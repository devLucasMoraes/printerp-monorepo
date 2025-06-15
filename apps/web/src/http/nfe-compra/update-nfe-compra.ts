import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const updateNfeCompraSchema = z.object({
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
      id: z.string().uuid().nullable(),
      qtdeNf: z.number().nonnegative(),
      unidadeNf: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      valorIpi: z.number().nonnegative(),
      descricaoFornecedora: z.string(),
      codFornecedora: z.string(),
      vinculoId: z.string().uuid(),
    }),
  ),
})

export type UpdateNfeCompraDTO = z.infer<typeof updateNfeCompraSchema>

export async function updateNfeCompra(
  id: string,
  orgSlug: string,
  dto: UpdateNfeCompraDTO,
) {
  await api.put(`/organizations/${orgSlug}/nfes-compra/${id}`, dto)
}
