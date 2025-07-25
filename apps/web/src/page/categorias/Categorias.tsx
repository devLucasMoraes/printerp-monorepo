import { Button, IconButton } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { IconCopy, IconEdit, IconEraser } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useCategoriaQueries } from '../../hooks/queries/useCategoriaQueries'
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation'
import type { ListCategoriasResponse } from '../../http/categoria/list-categorias'
import { useAlertStore } from '../../stores/alert-store'
import { CategoriaModal } from './components/CategoriaModal'

const Categorias = () => {
  useCacheInvalidation()

  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedCategoria, setSelectedCategoria] = useState<{
    data: ListCategoriasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const {
    useListPaginated: useGetCategoriasPaginated,
    useDelete: useDeleteCategoria,
  } = useCategoriaQueries()

  const { data, isLoading } = useGetCategoriasPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })
  const { mutate: deleteById } = useDeleteCategoria()

  const handleConfirmDelete = (categoria: ListCategoriasResponse) => {
    setSelectedCategoria({ data: categoria, type: 'DELETE' })
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
          setSelectedCategoria(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('Categoria deletado com sucesso', {
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

  const handleEdit = (categoria: ListCategoriasResponse) => {
    setSelectedCategoria({ data: categoria, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (categoria: ListCategoriasResponse): void => {
    setSelectedCategoria({ data: categoria, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListCategoriasResponse>[] = [
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
      <CategoriaModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedCategoria(undefined)
        }}
        form={selectedCategoria}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedCategoria(undefined)
        }}
        onConfirm={() => {
          if (!selectedCategoria) return
          handleDelete(selectedCategoria.data.id)
        }}
        title="Deletar categoria"
      >
        Tem certeza que deseja deletar essa categoria?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Categorias" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Categorias"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => setFormOpen(true)}
            >
              adicionar categoria
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

export default Categorias
