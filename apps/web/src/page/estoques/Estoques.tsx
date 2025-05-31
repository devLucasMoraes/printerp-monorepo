import { IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { IconTool } from '@tabler/icons-react'
import { useState } from 'react'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import DashboardCard from '../../components/cards/DashboardCard'
import PageContainer from '../../components/container/PageContainer'
import { ServerDataTable } from '../../components/shared/ServerDataTable'
import { useEstoqueQueries } from '../../hooks/queries/useEstoqueQueries'
import { useEntityChangeSocket } from '../../hooks/useEntityChangeSocket'
import { ListEstoquesResponse } from '../../http/estoque/list-estoques'
import { EstoqueModal } from './components/EstoqueModal'

const Estoques = () => {
  const [formOpen, setFormOpen] = useState(false)

  const { orgSlug } = useParams()
  const [selectedEstoque, setSelectedEstoque] = useState<{
    data: ListEstoquesResponse
    type: 'UPDATE' | 'COPY' | 'CREATE'
  }>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const isSocketConnected = useEntityChangeSocket('estoque')

  const { useListPaginated: useGetEstoquesPaginated } = useEstoqueQueries()

  const { data, isLoading } = useGetEstoquesPaginated(
    orgSlug || '',
    {
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    {
      staleTime: isSocketConnected ? Infinity : 1 * 60 * 1000,
    },
  )

  const handleEdit = (estoque: ListEstoquesResponse) => {
    setSelectedEstoque({ data: estoque, type: 'UPDATE' })
    setFormOpen(true)
  }

  const columns: GridColDef<ListEstoquesResponse>[] = [
    {
      field: 'insumo',
      headerName: 'Insumo',
      minWidth: 155,
      flex: 0.3,
      valueGetter: (_, row) => {
        if (!row.insumo?.descricao) {
          return ''
        }
        return row.insumo.descricao
      },
    },
    {
      field: 'armazem',
      headerName: 'Armazém',
      minWidth: 155,
      flex: 0.1,
      valueGetter: (_, row) => {
        if (!row.armazem?.nome) {
          return ''
        }
        return row.armazem.nome
      },
    },
    {
      field: 'quantidade',
      headerName: 'Quantidade',
      minWidth: 155,
      flex: 0.1,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      minWidth: 100,
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
            <IconTool />
          </IconButton>
        </>
      ),
    },
  ]

  const renderModals = () => (
    <>
      <EstoqueModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedEstoque(undefined)
        }}
        estoque={selectedEstoque}
      />
    </>
  )

  return (
    <PageContainer title="Estoques" description="">
      {renderModals()}
      {orgSlug ? (
        <DashboardCard title="Estoques">
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

export default Estoques
