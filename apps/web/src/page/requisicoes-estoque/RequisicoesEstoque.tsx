import { Button, IconButton } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { IconCopy, IconEdit, IconEraser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useRequisicaoEstoqueQueries } from '../../hooks/queries/useRequisicaoEstoqueQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import type { ListRequisicoesEstoqueResponse } from '../../http/requisicao-estoque/list-requisicoes-estoque'
import { useAlertStore } from '../../stores/alert-store'
import { RequisicaoEstoqueModal } from './components/RequisicaoEstoqueModal'

const RequisicoesEstoque = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedRequisicaoEstoque, setSelectedRequisicaoEstoque] = useState<{
    data: ListRequisicoesEstoqueResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const queryClient = useQueryClient()

  const {
    useListPaginated: useGetRequisicoesEstoquePaginated,
    useDelete: useDeleteRequisicaoEstoque,
  } = useRequisicaoEstoqueQueries()

  const { data, isLoading } = useGetRequisicoesEstoquePaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: deleteById } = useDeleteRequisicaoEstoque()

  const handleConfirmDelete = (requisicao: ListRequisicoesEstoqueResponse) => {
    setSelectedRequisicaoEstoque({ data: requisicao, type: 'DELETE' })
    setConfirmModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    deleteById(
      { id, orgSlug },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['estoque'] })
          setSelectedRequisicaoEstoque(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Requisição deletada com sucesso', {
            variant: 'success',
          })
        },
        onError: (error) => {
          console.error(error)
          enqueueSnackbar(error.response?.data.message || error.message, {
            variant: 'error',
          })
        },
      },
    )
  }

  const handleEdit = (requisicaoEstoque: ListRequisicoesEstoqueResponse) => {
    setSelectedRequisicaoEstoque({ data: requisicaoEstoque, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (
    requisicaoEstoque: ListRequisicoesEstoqueResponse,
  ): void => {
    setSelectedRequisicaoEstoque({ data: requisicaoEstoque, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListRequisicoesEstoqueResponse>[] = [
    {
      field: 'dataRequisicao',
      headerName: 'Requerido em',
      minWidth: 155,
      flex: 0.3,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : ''),
    },
    {
      field: 'valorTotal',
      headerName: 'Valor total',
      minWidth: 155,
      flex: 0.1,
    },
    {
      field: 'requisitante',
      headerName: 'Requisitante',
      minWidth: 200,
      flex: 0.3,
      display: 'flex',
      valueGetter: (_, row) => {
        if (!row.requisitante?.nome) {
          return ''
        }
        return row.requisitante.nome
      },
    },
    {
      field: 'setor',
      headerName: 'Setor',
      minWidth: 200,
      flex: 0.3,
      display: 'flex',
      valueGetter: (_, row) => {
        if (!row.setor?.nome) {
          return ''
        }
        return row.setor.nome
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      minWidth: 130,
      flex: 0.1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleCopy(params.row)}
          >
            <IconCopy />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleEdit(params.row)}
          >
            <IconEdit />
          </IconButton>
          <IconButton
            size="small"
            color="inherit"
            onClick={() => handleConfirmDelete(params.row)}
          >
            <IconEraser />
          </IconButton>
        </>
      ),
    },
  ]

  const renderModals = () => (
    <>
      <RequisicaoEstoqueModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedRequisicaoEstoque(undefined)
        }}
        form={selectedRequisicaoEstoque}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedRequisicaoEstoque(undefined)
        }}
        onConfirm={() => {
          if (!selectedRequisicaoEstoque?.data) return
          handleDelete(selectedRequisicaoEstoque.data.id)
        }}
        title="Deletar requisição"
      >
        Tem certeza que deseja deletar essa requisição de estoque?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Requisições de Estoque" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Requisições de Estoque"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setFormOpen(true)
                setSelectedRequisicaoEstoque(undefined)
              }}
            >
              nova requisição
            </Button>
          }
        >
          <ServerDataTable
            rows={data?.content || []}
            columns={columns}
            isLoading={isLoading}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            totalRowCount={data?.totalElements || 0}
          />
        </DashboardCard>
      ) : (
        <CenteredMessageCard message="Selecione uma organização" />
      )}
    </PageContainer>
  )
}

export default RequisicoesEstoque
