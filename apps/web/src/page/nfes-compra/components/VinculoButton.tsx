import { Button, Stack, Typography } from '@mui/material'
import { Control, useWatch } from 'react-hook-form'
import { useParams } from 'react-router'

import { useVinculoQueries } from '../../../hooks/queries/useVinculoQueries'
import { UpdateNfeCompraDTO } from '../../../http/nfe-compra/update-nfe-compra'

export const VinculoButton = ({
  index,
  control,
  onOpenModal,
}: {
  index: number
  control: Control<UpdateNfeCompraDTO>
  onOpenModal: (index: number) => void
}) => {
  const { orgSlug } = useParams()
  const { useGetByCod } = useVinculoQueries()

  const codigoFornecedora = useWatch({
    control,
    name: `itens.${index}.codFornecedora`,
  })

  const {
    data: vinculo,
    isLoading,
    isFetching,
  } = useGetByCod(codigoFornecedora || '', orgSlug || '', {
    enabled: !!codigoFornecedora && !!orgSlug,
  })

  const loading = isLoading || isFetching
  const hasVinculo = !!vinculo
  const descricao = vinculo?.insumo?.descricao || 'Selecionar insumo'

  return (
    <Stack spacing={0.5}>
      <Button
        variant={hasVinculo ? 'outlined' : 'contained'}
        color="primary"
        onClick={() => onOpenModal(index)}
        loading={loading}
        size="small"
      >
        {hasVinculo ? 'Trocar' : 'Selecionar insumo'}
      </Button>
      {hasVinculo && !loading && (
        <Typography variant="caption" noWrap sx={{ maxWidth: 120 }}>
          {descricao}
        </Typography>
      )}
    </Stack>
  )
}
