import { Button, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconEdit, IconEraser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useEmprestimoQueries } from '../../hooks/queries/useEmprestimosQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import { ListEmprestimosResponse } from '../../http/emprestimo/list-emprestimos'
import { useAlertStore } from '../../stores/alert-store'
import { EmprestimoModal } from './components/EmprestimoModal'

const Emprestimos = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedEmprestimo, setSelectedEmprestimo] = useState<{
    data: ListEmprestimosResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const queryClient = useQueryClient()

  const {
    useListPaginated: useGetEmprestimos,
    useDelete: useDeleteEmprestimo,
  } = useEmprestimoQueries()

  const { data, isLoading } = useGetEmprestimos(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDeleteEmprestimo()

  const handleConfirmDelete = (emprestimo: ListEmprestimosResponse) => {
    setSelectedEmprestimo({ data: emprestimo, type: 'DELETE' })
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
          queryClient.invalidateQueries({ queryKey: ['emprestimo'] })
          setSelectedEmprestimo(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Empréstimo excluído com sucesso!', {
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

  const handleEdit = (emprestimo: ListEmprestimosResponse) => {
    setSelectedEmprestimo({ data: emprestimo, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedEmprestimo(undefined)
    setFormOpen(true)
  }

  const columns: GridColDef<ListEmprestimosResponse>[] = [
    {
      field: 'dataEmprestimo',
      headerName: 'Emprestado em',
      minWidth: 155,
      flex: 0.3,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : ''),
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      minWidth: 155,
      flex: 0.3,
      valueGetter: (value) => value || '',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 155,
      flex: 0.3,
      valueGetter: (value) => value || '',
    },
    {
      field: 'parceiro',
      headerName: 'Empresa parceira',
      minWidth: 200,
      flex: 0.3,
      display: 'flex',
      valueGetter: (_, row) => {
        if (!row.parceiro?.nome) {
          return ''
        }
        return row.parceiro.nome
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
      <EmprestimoModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedEmprestimo(undefined)
        }}
        form={selectedEmprestimo}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedEmprestimo(undefined)
        }}
        onConfirm={() => {
          if (!selectedEmprestimo?.data) return
          handleDelete(selectedEmprestimo.data.id)
        }}
        title="Deletar Empréstimo"
      >
        Tem certeza que deseja deletar esse empréstimo?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Empréstimos" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Empréstimos"
          action={
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Novo empréstimo
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

export default Emprestimos
