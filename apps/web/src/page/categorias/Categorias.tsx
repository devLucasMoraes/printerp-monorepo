import { Box, Button, IconButton, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconCopy, IconEdit, IconEraser } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import BlankCard from '../../components/cards/BlankCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useCategoriaQueries } from '../../hooks/queries/useCategoriaQueries'
import { useEntityChangeSocket } from '../../hooks/useEntityChangeSocket'
import { ListCatgoriasResponse } from '../../http/categoria/list-categorias'
import { useAlertStore } from '../../stores/alert-store'
import { CategoriaModal } from './components/CategoriaModal'

const Categorias = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedCategoria, setSelectedCategoria] = useState<{
    data: ListCatgoriasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const isSocketConnected = useEntityChangeSocket(
    'categoria',
    {
      // Quando categoria mudar, invalida insumos
      invalidate: ['insumo'],
    },
    {
      showNotifications: true,
      entityLabel: 'Categoria',
      suppressSocketAlert: formOpen || confirmModalOpen,
    },
  )

  const {
    useListPaginated: useGetCategoriasPaginated,
    useDelete: useDeleteCategoria,
  } = useCategoriaQueries()

  const { data, isLoading } = useGetCategoriasPaginated(
    orgSlug || '',
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    },
  )
  const { mutate: deleteById } = useDeleteCategoria()

  const handleConfirmDelete = (categoria: ListCatgoriasResponse) => {
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
          enqueueSnackbar(error.message, { variant: 'error' })
        },
      },
    )
  }

  const handleEdit = (categoria: ListCatgoriasResponse) => {
    setSelectedCategoria({ data: categoria, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (categoria: ListCatgoriasResponse): void => {
    setSelectedCategoria({ data: categoria, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListCatgoriasResponse>[] = [
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
        categoria={selectedCategoria}
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
            totalRowCount={data?.totalElements}
          />
        </DashboardCard>
      ) : (
        <BlankCard>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 300,
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              color="textSecondary" // Cor mais suave
              sx={{
                fontWeight: 500, // Peso da fonte
                letterSpacing: 0.5, // Espaçamento entre letras
              }}
            >
              Selecione uma organização
            </Typography>
          </Box>
        </BlankCard>
      )}
    </PageContainer>
  )
}

export default Categorias
