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
import { useParceiroQueries } from '../../hooks/queries/useParceiroQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListParceirosResponse } from '../../http/parceiro/list-parceiros'
import { useAlertStore } from '../../stores/alert-store'
import { ParceiroModal } from './components/ParceiroModal'

const Parceiros = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedParceiro, setSelectedParceiro] = useState<{
    data: ListParceirosResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetParceirosPaginated,
    useDelete: useDeleteParceiro,
  } = useParceiroQueries()

  const { data, isLoading } = useGetParceirosPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: deleteById } = useDeleteParceiro()

  const handleConfirmDelete = (parceiro: ListParceirosResponse) => {
    setSelectedParceiro({ data: parceiro, type: 'DELETE' })
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
          setSelectedParceiro(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Parceiro deletado com sucesso', {
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

  const handleEdit = (parceiro: ListParceirosResponse) => {
    setSelectedParceiro({ data: parceiro, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (parceiro: ListParceirosResponse): void => {
    setSelectedParceiro({ data: parceiro, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListParceirosResponse>[] = [
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
      <ParceiroModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedParceiro(undefined)
        }}
        form={selectedParceiro}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedParceiro(undefined)
        }}
        onConfirm={() => {
          if (!selectedParceiro) return
          handleDelete(selectedParceiro.data.id)
        }}
        title="Deletar parceiro"
      >
        Tem certeza que deseja deletar esse parceiro?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Parceiros" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Parceiros"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar parceiro
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

export default Parceiros
