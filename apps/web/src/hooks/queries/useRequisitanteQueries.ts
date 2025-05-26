import { requisitanteService } from '../../http/RequisitanteService'
import { useResourceQuery } from './useResourceQuery'

export function useRequisitanteQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'requisitante',
    service: requisitanteService,
  })

  return {
    ...baseQueries,
  }
}
