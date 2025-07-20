import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { ResourceKeys } from '../constants/ResourceKeys'
import { useSocket } from './useSocket'

export function useCacheInvalidation() {
  const queryClient = useQueryClient()
  const { subscribe } = useSocket()

  useEffect(() => {
    const unsubSetor = subscribe('invalidateSetorCache', (data: unknown) => {
      const eventData = data as {
        operation: string
        orgSlug: string
        setorId: string
      }

      const { orgSlug } = eventData

      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.SETOR, orgSlug],
        refetchType: 'active',
      })
      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.REQUISICAO_ESTOQUE, orgSlug],
        refetchType: 'active',
      })
    })

    const unsubRequisitante = subscribe(
      'invalidateRequisitanteCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          requisitanteId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.REQUISITANTE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.REQUISICAO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubInsumo = subscribe('invalidateInsumoCache', (data: unknown) => {
      const eventData = data as {
        operation: string
        orgSlug: string
        insumoId: string
      }

      const { orgSlug } = eventData

      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.INSUMO, orgSlug],
        refetchType: 'active',
      })
      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.REQUISICAO_ESTOQUE, orgSlug],
        refetchType: 'active',
      })
    })

    const unsubArmazem = subscribe(
      'invalidateArmazemCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          armazemId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ARMAZEM, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.REQUISICAO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.NFE_COMPRA, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ESTOQUE, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubCategoria = subscribe(
      'invalidateCategoriaCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          categoriaId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.CATEGORIA, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.INSUMO, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubEmprestimo = subscribe(
      'invalidateEmprestimoCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          emprestimoId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.EMPRESTIMO, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.MOVIMENTO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubEstoque = subscribe(
      'invalidateEstoqueCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          estoqueId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.MOVIMENTO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubFornecedora = subscribe(
      'invalidateFornecedoraCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          fornecedoraId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.FORNECEDORA, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.NFE_COMPRA, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubNfeCompra = subscribe(
      'invalidateNfeCompraCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          nfeCompraId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.NFE_COMPRA, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.MOVIMENTO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.CHARTS, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubOrganization = subscribe(
      'invalidateOrganizationCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          organizationId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ORGANIZATION, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubParceiro = subscribe(
      'invalidateParceiroCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          parceiroId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.PARCEIRO, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.EMPRESTIMO, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubRequisicaoEstoque = subscribe(
      'invalidateRequisicaoEstoqueCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          requisicaoEstoqueId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.REQUISICAO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.MOVIMENTO_ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ESTOQUE, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.CHARTS, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubTransportadora = subscribe(
      'invalidateTransportadoraCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          transportadoraId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.TRANSPORTADORA, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.NFE_COMPRA, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubUser = subscribe('invalidateUserCache', (data: unknown) => {
      const eventData = data as {
        operation: string
        orgSlug: string
        userId: string
      }

      const { orgSlug } = eventData

      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.USER, orgSlug],
        refetchType: 'active',
      })
    })

    const unsubVinculo = subscribe(
      'invalidateVinculoCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          vinculoId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.VINCULO, orgSlug],
          refetchType: 'active',
        })
        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.NFE_COMPRA, orgSlug],
          refetchType: 'active',
        })
      },
    )

    // Retorna função de limpeza para remover todos os listeners
    return () => {
      unsubSetor()
      unsubRequisitante()
      unsubInsumo()
      unsubArmazem()
      unsubCategoria()
      unsubEmprestimo()
      unsubEstoque()
      unsubFornecedora()
      unsubNfeCompra()
      unsubOrganization()
      unsubParceiro()
      unsubRequisicaoEstoque()
      unsubTransportadora()
      unsubUser()
      unsubVinculo()
    }
  }, [queryClient, subscribe])
}
