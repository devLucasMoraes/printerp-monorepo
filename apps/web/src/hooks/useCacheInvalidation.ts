import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useSocket } from './useSocket'

export function useCacheInvalidation(orgSlug: string) {
  const queryClient = useQueryClient()
  const { subscribe } = useSocket()

  useEffect(() => {
    if (!orgSlug) return

    const unsubscribe = subscribe(
      'invalidateSetorCache',
      (data: { operation: string; orgSlug: string; setorId: string }) => {
        // Só invalida se for para a organização atual
        if (data.orgSlug === orgSlug) {
          queryClient.invalidateQueries({
            queryKey: ['setores', orgSlug],
            refetchType: 'active',
          })

          // Invalida também a query individual se necessário
          if (data.operation === 'update' || data.operation === 'delete') {
            queryClient.invalidateQueries({
              queryKey: ['setores', orgSlug, data.setorId],
            })
          }
        }
      },
    )

    return unsubscribe
  }, [orgSlug, queryClient, subscribe])
}
