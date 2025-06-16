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
    <Stack spacing={1} alignItems="flex-start">
      {hasVinculo && !loading && (
        <Typography
          variant="body1" // Alterado para body1 (maior)
          fontWeight={500} // Mais peso visual
          sx={{
            fontSize: '0.875rem', // Tamanho customizado se necessário
            lineHeight: 1.5, // Melhor espaçamento
          }}
          title={descricao}
        >
          {descricao}
        </Typography>
      )}

      <Button
        variant={hasVinculo ? 'outlined' : 'contained'}
        color="primary"
        onClick={() => onOpenModal(index)}
        size="small"
        sx={{
          fontSize: '0.75rem', // Tamanho adequado para botão small
        }}
      >
        {hasVinculo ? 'Trocar' : 'Selecionar insumo'}
      </Button>
    </Stack>
  )
}
