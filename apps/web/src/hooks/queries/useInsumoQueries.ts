import { insumoService } from '../../http/InsumoService'
import { useResourceQuery } from './useResourceQuery'

export function useInsumoQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'insumo',
    service: insumoService,
  })

  return {
    ...baseQueries,
  }
}
