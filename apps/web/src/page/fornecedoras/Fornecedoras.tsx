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
import { useFornecedoraQueries } from '../../hooks/queries/useFornecedoraQueries'
import { ListFornecedorasResponse } from '../../http/fornecedora/list-fornecedoras'
import { useAlertStore } from '../../stores/alert-store'
import { FornecedoraModal } from './components/FornecedoraModal'

const Fornecedoras = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedFornecedora, setSelectedFornecedora] = useState<{
    data: ListFornecedorasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetFornecedorasPaginated,
    useDelete: useDeleteFornecedora,
  } = useFornecedoraQueries()

  const { data, isLoading } = useGetFornecedorasPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDeleteFornecedora()

  const handleConfirmDelete = (fornecedora: ListFornecedorasResponse) => {
    setSelectedFornecedora({ data: fornecedora, type: 'DELETE' })
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
          setSelectedFornecedora(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Fornecedora deletada com sucesso', {
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

  const handleEdit = (fornecedora: ListFornecedorasResponse) => {
    setSelectedFornecedora({ data: fornecedora, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (fornecedora: ListFornecedorasResponse): void => {
    setSelectedFornecedora({ data: fornecedora, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListFornecedorasResponse>[] = [
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
      <FornecedoraModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedFornecedora(undefined)
        }}
        form={selectedFornecedora}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedFornecedora(undefined)
        }}
        onConfirm={() => {
          if (!selectedFornecedora) return
          handleDelete(selectedFornecedora.data.id)
        }}
        title="Deletar fornecedora"
      >
        Tem certeza que deseja deletar esse fornecedora?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Fornecedoras" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Fornecedoras"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar fornecedora
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

export default Fornecedoras
