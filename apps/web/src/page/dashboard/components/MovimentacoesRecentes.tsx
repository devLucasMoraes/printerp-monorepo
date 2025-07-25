import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab'
import { Link, Typography } from '@mui/material'
import { useParams } from 'react-router'

import DashboardCard from '../../../components/cards/DashboardCard'
import { useMovimentoEstoqueQueries } from '../../../hooks/queries/useMovimentoEstoqueQueries'
import { useCacheInvalidation } from '../../../hooks/useCacheInvalidation'
import { formatDateBR } from '../../../util/formatDateBR'

const MovimentacoesRecentes = () => {
  useCacheInvalidation()

  const { orgSlug } = useParams()
  const { useListPaginated: useGetMovimentacoes } = useMovimentoEstoqueQueries()

  const { data: movimentacoes } = useGetMovimentacoes(orgSlug || '', {
    page: 0,
    size: 5,
    sort: 'updatedAt,desc',
  })
  return (
    <DashboardCard title="Movimentações recentes">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          // onResize={undefined}
          // onResizeCapture={undefined}
          sx={{
            p: 0,

            '& .MuiTimelineConnector-root': {
              width: '1px',
              backgroundColor: '#efefef',
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          {movimentacoes?.content.map((mov, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Typography noWrap>{formatDateBR(mov.data)}</Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    mov.tipoDocumento === 'REQUISICAO'
                      ? 'success'
                      : mov.tipoDocumento === 'EMPRESTIMO'
                        ? 'warning'
                        : 'error'
                  }
                  variant="outlined"
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography fontWeight="600">
                  {`${mov.estorno ? 'ESTORNO' : mov.tipo} de ${
                    mov.quantidade
                  } ${mov.unidade} do ${
                    mov.insumo.descricao
                  } valor total de R$ ${(
                    mov.quantidade * mov.valorUnitario
                  ).toFixed(2)}`}
                </Typography>
                <Link href="#" underline="none">
                  {mov.tipoDocumento}-{mov.documentoOrigemId}
                </Link>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </>
    </DashboardCard>
  )
}

export default MovimentacoesRecentes
