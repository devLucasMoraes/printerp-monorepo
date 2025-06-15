import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useParams } from 'react-router'

import { FornecedoraAutoComplete } from '../../../components/shared/autocompletes/FornecedoraAutoComplete'
import { InsumoAutoComplete } from '../../../components/shared/autocompletes/InsumoAutoComplete'
import { unidades } from '../../../constants'
import { Unidade } from '../../../constants/Unidade'
import { useVinculoQueries } from '../../../hooks/queries/useVinculoQueries'
import {
  CreateOrUpdateVinculoDto,
  CreateOrUpdateVinculoResponse,
  createOrUpdateVinculoSchema,
} from '../../../http/vinculo/create-or-update-vinculo'
import { GetVinculoByCodResponse } from '../../../http/vinculo/get-vinculo-by-cod'
import { useAlertStore } from '../../../stores/alert-store'

interface VinculoModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (vinculo: CreateOrUpdateVinculoResponse) => void
  initialData: {
    cod: string
    fornecedoraId: string
  }
  vinculo?: GetVinculoByCodResponse // Vínculo existente para edição
}

export const VinculoModal = ({
  open,
  onClose,
  onSuccess,
  initialData,
  vinculo,
}: VinculoModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const isEdit = !!vinculo

  const { orgSlug } = useParams()

  const { useCreateOrUpdate } = useVinculoQueries()
  const { mutate: createOrUpdateVinculo } = useCreateOrUpdate()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrUpdateVinculoDto>({
    resolver: zodResolver(createOrUpdateVinculoSchema),
    defaultValues: {
      cod: vinculo?.cod || initialData?.cod || '',
      undCompra: vinculo?.undCompra || ('' as Unidade),
      possuiConversao: vinculo?.possuiConversao || false,
      qtdeEmbalagem: vinculo?.qtdeEmbalagem || null,
      insumoId: vinculo?.insumo?.id || '',
      fornecedoraId: vinculo?.fornecedoraId || initialData?.fornecedoraId || '',
    },
  })

  const onSubmit = async (data: CreateOrUpdateVinculoDto) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    createOrUpdateVinculo(
      { orgSlug, data },
      {
        onSuccess: (data) => {
          enqueueSnackbar('Vínculo criado com sucesso', { variant: 'success' })
          onSuccess(data)
          handleClose()
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

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {isEdit ? 'Editar Vínculo' : 'Criar Novo Vínculo'}
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2} sx={{ mt: 1 }}>
          <Grid2 size={6}>
            <Controller
              name="cod"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Código do Fornecedor"
                  error={!!errors.cod}
                  helperText={errors.cod?.message}
                  fullWidth
                  disabled={isEdit} // Não permite editar código em edição
                />
              )}
            />
          </Grid2>

          <Grid2 size={6}>
            <Controller
              name="undCompra"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Unidade de Compra"
                  error={!!errors.undCompra}
                  helperText={errors.undCompra?.message}
                  value={field.value || ''}
                  fullWidth
                  select
                >
                  {unidades.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="insumoId"
              control={control}
              render={({ field }) => (
                <InsumoAutoComplete field={field} error={errors.insumoId} />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="fornecedoraId"
              control={control}
              render={({ field }) => (
                <FornecedoraAutoComplete
                  field={field}
                  error={errors.fornecedoraId}
                />
              )}
            />
          </Grid2>

          <Grid2 size={6}>
            <Controller
              name="possuiConversao"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormControl error={!!errors.possuiConversao} fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        {...fieldProps}
                      />
                    }
                    label="Possui Conversão"
                  />
                  <FormHelperText>
                    {errors.possuiConversao?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid2>

          <Grid2 size={6}>
            <Controller
              name="qtdeEmbalagem"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantidade por Embalagem"
                  error={!!errors.qtdeEmbalagem}
                  helperText={errors.qtdeEmbalagem?.message}
                  fullWidth
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface VinculoButtonProps {
  index: number
  control: any
  orgSlug: string
  onOpenModal: (index: number) => void
}

const VinculoButton = ({
  index,
  control,
  orgSlug,
  onOpenModal,
}: VinculoButtonProps) => {
  const codigoFornecedor = useWatch({
    control,
    name: `itens.${index}.codigoFornecedor`,
    defaultValue: '',
  })

  const vinculoId = useWatch({
    control,
    name: `itens.${index}.vinculoId`,
    defaultValue: '',
  })

  const { useGetByCod } = useVinculoQueries()

  const {
    data: vinculo,
    isLoading,
    isFetching,
  } = useGetByCod(codigoFornecedor, orgSlug, {
    enabled: !!codigoFornecedor && !!orgSlug,
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: false, // Não tentar novamente se não encontrar
  })

  const isLoadingVinculo = isLoading || isFetching
  const hasVinculo = !!vinculo || !!vinculoId
  const descricaoInsumo = vinculo?.insumo?.descricao

  const handleClick = () => {
    onOpenModal(index)
  }

  return (
    <Stack spacing={0.5} alignItems="flex-start">
      <Button
        variant={hasVinculo ? 'outlined' : 'contained'}
        color="primary"
        onClick={handleClick}
        disabled={isLoadingVinculo}
        startIcon={
          isLoadingVinculo ? <CircularProgress size={16} /> : undefined
        }
        size="small"
        fullWidth
      >
        {hasVinculo ? 'Trocar' : 'Selecionar'}
      </Button>

      {descricaoInsumo && !isLoadingVinculo && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: '0.75rem',
            lineHeight: 1.2,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={descricaoInsumo}
        >
          {descricaoInsumo}
        </Typography>
      )}
    </Stack>
  )
}
