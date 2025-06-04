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
import { useArmazemQueries } from '../../hooks/queries/useArmazemQueries'
import { useEntityChangeSocket } from '../../hooks/useEntityChangeSocket'
import { ListArmazensResponse } from '../../http/armazem/list-armazens'
import { useAlertStore } from '../../stores/alert-store'
import { ArmazemModal } from './components/ArmazemModal'

const Armazens = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { orgSlug } = useParams()
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const [selectedArmazem, setSelectedArmazem] = useState<{
    data: ListArmazensResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const isSocketConnected = useEntityChangeSocket(
    'armazem',
    {
      invalidate: ['estoque', 'requisicaoEstoque'],
    },
    {
      showNotifications: true,
      entityLabel: 'Armazém',
      suppressSocketAlert: formOpen || confirmModalOpen,
    },
  )

  const {
    useListPaginated: useGetArmazensPaginated,
    useDelete: useDeleteArmazem,
  } = useArmazemQueries()

  const { data, isLoading } = useGetArmazensPaginated(
    orgSlug || '',
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    },
  )
  const { mutate: deleteById } = useDeleteArmazem()

  const handleConfirmDelete = (armazem: ListArmazensResponse) => {
    setSelectedArmazem({ data: armazem, type: 'DELETE' })
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
          setSelectedArmazem(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Armazém deletado com sucesso', {
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

  const handleEdit = (armazem: ListArmazensResponse) => {
    setSelectedArmazem({ data: armazem, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (armazem: ListArmazensResponse): void => {
    setSelectedArmazem({ data: armazem, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListArmazensResponse>[] = [
    { field: 'nome', headerName: 'Nome', minWidth: 120, flex: 1 },
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
      <ArmazemModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedArmazem(undefined)
        }}
        armazem={selectedArmazem}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedArmazem(undefined)
        }}
        onConfirm={() => {
          if (!selectedArmazem) return
          handleDelete(selectedArmazem.data.id)
        }}
        title="Deletar armazém"
      >
        Tem certeza que deseja deletar esse armazém?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Armazéns" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Armazéns"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar armazém
            </Button>
          }
        >
          <ServerDataTable
            rows={data?.content || []}
            columns={columns}
            isLoading={isLoading}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            totalRowCount={data?.totalElements}
          />
        </DashboardCard>
      ) : (
        <CenteredMessageCard message="Selecione uma organização" />
      )}
    </PageContainer>
  )
}

export default Armazens
