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
import { useTransportadoraQueries } from '../../hooks/queries/useTransportadoraQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListTransportadorasResponse } from '../../http/transportadora/list-transportadoras'
import { useAlertStore } from '../../stores/alert-store'
import { TransportadoraModal } from './components/TransportadoraModal'

const Transportadoras = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedTransportadora, setSelectedTransportadora] = useState<{
    data: ListTransportadorasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetTransportadorasPaginated,
    useDelete: useDeleteTransportadora,
  } = useTransportadoraQueries()

  const { data, isLoading } = useGetTransportadorasPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDeleteTransportadora()

  const handleConfirmDelete = (transportadora: ListTransportadorasResponse) => {
    setSelectedTransportadora({ data: transportadora, type: 'DELETE' })
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
          setSelectedTransportadora(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Transportadora deletada com sucesso', {
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

  const handleEdit = (transportadora: ListTransportadorasResponse) => {
    setSelectedTransportadora({ data: transportadora, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (transportadora: ListTransportadorasResponse): void => {
    setSelectedTransportadora({ data: transportadora, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListTransportadorasResponse>[] = [
    {
      field: 'nomeFantasia',
      headerName: 'Nome Fantasia',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'razaoSocial',
      headerName: 'Razão Social',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'fone',
      headerName: 'Telefone',
      minWidth: 120,
      flex: 1,
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
      <TransportadoraModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedTransportadora(undefined)
        }}
        formType={selectedTransportadora?.type}
        initialData={selectedTransportadora?.data}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedTransportadora(undefined)
        }}
        onConfirm={() => {
          if (!selectedTransportadora) return
          handleDelete(selectedTransportadora.data.id)
        }}
        title="Deletar transportadora"
      >
        Tem certeza que deseja deletar esse transportadora?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Transportadoras" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Transportadoras"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar transportadora
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

export default Transportadoras
