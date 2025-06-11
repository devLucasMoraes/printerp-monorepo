import { Button, IconButton, Stack } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconCopy, IconEdit, IconEraser } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ConfirmationModal } from '../../components/shared/ConfirmationModal'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useNfeCompraQueries } from '../../hooks/queries/useNfeCompraQueries'
import { ListNfesCompraResponse } from '../../http/nfe-compra/list-nfes-compra'
import { useAlertStore } from '../../stores/alert-store'
import { NfeCompraModal } from './components/NfeCompraModal'

const NfesCompra = () => {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const { enqueueSnackbar } = useAlertStore((state) => state)
  const { orgSlug } = useParams()

  const [selectedNfeCompra, setSelectedNfeCompra] = useState<{
    data?: ListNfesCompraResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const queryClient = useQueryClient()

  const {
    useListPaginated: useGetNfesCompraPaginated,
    useDelete: useDeleteNfeCompra,
  } = useNfeCompraQueries()

  const { data, isLoading } = useGetNfesCompraPaginated(orgSlug || '', {
    page: paginationModel.page,
    size: paginationModel.pageSize,
  })

  const { mutate: deleteById } = useDeleteNfeCompra()

  const handleConfirmDelete = (requisicao: ListNfesCompraResponse) => {
    setSelectedNfeCompra({ data: requisicao, type: 'DELETE' })
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
          setSelectedNfeCompra(undefined)
          setConfirmModalOpen(false)
          enqueueSnackbar('NFe deletada com sucesso', {
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

  const handleEdit = (requisicaoEstoque: ListNfesCompraResponse) => {
    setSelectedNfeCompra({ data: requisicaoEstoque, type: 'UPDATE' })
    setFormOpen(true)
  }

  const handleCopy = (requisicaoEstoque: ListNfesCompraResponse): void => {
    setSelectedNfeCompra({ data: requisicaoEstoque, type: 'COPY' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListNfesCompraResponse>[] = [
    {
      field: 'dataRecebimento',
      headerName: 'Recebida em',
      minWidth: 155,
      flex: 0.3,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : ''),
    },
    {
      field: 'nfe',
      headerName: 'NFe',
      minWidth: 155,
      flex: 0.1,
    },
    {
      field: 'valorTotalNfe',
      headerName: 'Valor total',
      minWidth: 155,
      flex: 0.1,
      type: 'number',
      valueFormatter: (value: number) =>
        value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      field: 'fornecedora',
      headerName: 'Fornecedora',
      minWidth: 200,
      flex: 0.3,
      display: 'flex',
      valueGetter: (_, row) => {
        if (!row.fornecedora?.nomeFantasia) {
          return ''
        }
        return row.fornecedora.nomeFantasia
      },
    },
    {
      field: 'transportadora',
      headerName: 'Transportadora',
      minWidth: 200,
      flex: 0.3,
      display: 'flex',
      valueGetter: (_, row) => {
        if (!row.transportadora?.nomeFantasia) {
          return ''
        }
        return row.transportadora.nomeFantasia
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
      <NfeCompraModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedNfeCompra(undefined)
        }}
        form={selectedNfeCompra}
      />
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false)
          setSelectedNfeCompra(undefined)
        }}
        onConfirm={() => {
          if (!selectedNfeCompra?.data) return
          handleDelete(selectedNfeCompra.data.id)
        }}
        title="Deletar nota fiscal"
      >
        Tem certeza que deseja deletar essa nota fiscal?
      </ConfirmationModal>
    </>
  )

  return (
    <PageContainer title="Nfes de compra" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard
          title="Nfes de compra"
          action={
            <Stack direction="row" gap={1}>
              <Button
                variant="outlined"
                onClick={() => {
                  setFormOpen(true)
                  setSelectedNfeCompra({
                    data: undefined,
                    type: 'CREATE',
                  })
                }}
              >
                importar xml
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setFormOpen(true)
                  setSelectedNfeCompra({
                    data: undefined,
                    type: 'CREATE',
                  })
                }}
              >
                nova nota fiscal
              </Button>
            </Stack>
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

export default NfesCompra
