import { requisicaoEstoqueService } from '../../http/RequisicaoEstoqueService'
import { useResourceQuery } from './useResourceQuery'

export function useRequisicaoEstoqueQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'requisicaoEstoque',
    service: requisicaoEstoqueService,
  })

  return {
    ...baseQueries,
  }
}
