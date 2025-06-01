import { Box, Grid } from '@mui/material'
import { useParams } from 'react-router'

import CenteredMessageCard from '../../components/cards/CenteredMessageCard'
import PageContainer from '../../components/container/PageContainer'
import { EstimativasEstoque } from './components/EstimativasEstoque'
import MovimentacoesRecentes from './components/MovimentacoesRecentes'
import SaidasMensais from './components/SaidasMensais'
import VisaoGeralInsumosPorSetor from './components/VisaoGeralInsumosPorSetor'
import YearlyBreakup from './components/YearlyBreakup'

const Dashboard = () => {
  const { orgSlug } = useParams()
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {orgSlug ? (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <VisaoGeralInsumosPorSetor />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <YearlyBreakup />
                </Grid>
                <Grid item xs={12}>
                  <SaidasMensais />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
              <MovimentacoesRecentes />
            </Grid>
            <Grid item xs={12} lg={8}>
              <EstimativasEstoque />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <CenteredMessageCard message="Selecione uma organização" />
      )}
    </PageContainer>
  )
}

export default Dashboard
