import { emprestimoService } from '../../http/EmprestimoService'
import { useResourceQuery } from './useResourceQuery'

export function useEmprestimoQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'emprestimo',
    service: emprestimoService,
  })

  return {
    ...baseQueries,
  }
}
