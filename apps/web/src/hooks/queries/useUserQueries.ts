import { userService } from '../../http/UserService'
import { useResourceQuery } from './useResourceQuery'

export function useUserQueries() {
  const baseQueries = useResourceQuery({
    resourceKey: 'user',
    service: userService,
  })

  return {
    ...baseQueries,
  }
}
