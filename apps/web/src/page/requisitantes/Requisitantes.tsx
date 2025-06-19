import { Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconCopy, IconEdit, IconEraser } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useRequisitanteQueries } from '../../hooks/queries/useRequisitanteQueries'
import { useEntityChangeSocket } from '../../hooks/useEntityChangeSocket'
import { ListRequisitantesResponse } from '../../http/requisitante/list-requisitantes'
import { useAlertStore } from '../../stores/alert-store'
import { RequisitanteModal } from './components/RequisitanteModal'

const Requisitantes = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedRequisitante, setSelectedRequisitante] = useState<{
    data: ListRequisitantesResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const isSocketConnected = useEntityChangeSocket(
    'requisitante',
    {
      invalidate: ['requisicaoEstoque'],
    },
    {
      showNotifications: true,
      entityLabel: 'Requisitante',
      suppressSocketAlert: formOpen || confirmModalOpen,
    },
  )

  const {
    useListPaginated: useGetRequisitantesPaginated,
    useDelete: useDeleteRequisitante,
  } = useRequisitanteQueries()

  const { data, isLoading } = useGetRequisitantesPaginated(
    orgSlug || '',
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    },
  )
  const { mutate: deleteById } = useDeleteRequisitante()

  const handleConfirmDelete = (requisitante: ListRequisitantesResponse) => {
    setSelectedRequisitante({ data: requisitante, type: 'DELETE' })
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
          setSelectedRequisitante(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Requisitante deletado com sucesso', {
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

  const handleEdit = (requisitante: ListRequisitantesResponse) => {
    setSelectedRequisitante({ data: requisitante, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (requisitante: ListRequisitantesResponse): void => {
    setSelectedRequisitante({ data: requisitante, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListRequisitantesResponse>[] = [
    { field: 'nome', headerName: 'Nome', minWidth: 120, flex: 1 },
    { field: 'fone', headerName: 'Telefone', minWidth: 120, flex: 1 },
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
      <RequisitanteModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedRequisitante(undefined)
        }}
        form={selectedRequisitante}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedRequisitante(undefined)
        }}
        onConfirm={() => {
          if (!selectedRequisitante) return
          handleDelete(selectedRequisitante.data.id)
        }}
        title="Deletar requisitante"
      >
        Tem certeza que deseja deletar esse requisitante?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Requisitantes" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Requisitantes"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar requisitante
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

export default Requisitantes
