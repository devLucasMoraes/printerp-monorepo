import { parceiroService } from '../../http/ParceiroService'
import { useResourceQuery } from './useResourceQuery'

export function useParceiroQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'parceiro',
    service: parceiroService,
  })

  return {
    ...baseQueries,
  }
}
