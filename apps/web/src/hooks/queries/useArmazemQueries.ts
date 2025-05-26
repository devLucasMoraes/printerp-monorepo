import { armazemService } from '../../http/ArmazemService'
import { useResourceQuery } from './useResourceQuery'

export function useArmazemQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'armazem',
    service: armazemService,
  })

  return {
    ...baseQueries,
  }
}
