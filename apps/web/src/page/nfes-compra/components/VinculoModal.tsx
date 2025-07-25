import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { FornecedoraAutoComplete } from '../../../components/shared/autocompletes/FornecedoraAutoComplete'
import { InsumoAutoComplete } from '../../../components/shared/autocompletes/InsumoAutoComplete'
import { unidades } from '../../../constants'
import type { Unidade } from '../../../constants/Unidade'
import { useVinculoQueries } from '../../../hooks/queries/useVinculoQueries'
import type {
  CreateOrUpdateVinculoDto,
  CreateOrUpdateVinculoResponse,
} from '../../../http/vinculo/create-or-update-vinculo'
import { createOrUpdateVinculoSchema } from '../../../http/vinculo/create-or-update-vinculo'
import type { GetVinculoByCodResponse } from '../../../http/vinculo/get-vinculo-by-cod'
import { useAlertStore } from '../../../stores/alert-store'

interface VinculoModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (vinculo: CreateOrUpdateVinculoResponse) => void
  initialData: {
    cod: string
    fornecedoraId: string
  }
  vinculo: GetVinculoByCodResponse | undefined
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
    watch,
  } = useForm<CreateOrUpdateVinculoDto>({
    resolver: zodResolver(createOrUpdateVinculoSchema),
    defaultValues: {
      cod: '',
      undCompra: '' as Unidade,
      possuiConversao: false,
      qtdeEmbalagem: null,
      insumoId: '',
      fornecedoraId: '',
    },
  })

  const possuiConversao = watch('possuiConversao')

  useEffect(() => {
    if (isEdit) {
      reset({
        cod: vinculo?.cod,
        undCompra: vinculo?.undCompra,
        possuiConversao: vinculo?.possuiConversao,
        qtdeEmbalagem: vinculo?.qtdeEmbalagem,
        insumoId: vinculo?.insumo.id,
        fornecedoraId: vinculo?.fornecedoraId,
      })
      return
    }
    reset({
      cod: initialData.cod,
      fornecedoraId: initialData.fornecedoraId,
      qtdeEmbalagem: null,
      possuiConversao: false,
      undCompra: '' as Unidade,
      insumoId: '',
    })
  }, [isEdit, vinculo, reset, initialData.cod, initialData.fornecedoraId])

  const onSubmit = (data: CreateOrUpdateVinculoDto) => {
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
          enqueueSnackbar(error.response?.data.message ?? error.message, {
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
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={6}>
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
          </Grid>

          <Grid size={6}>
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
          </Grid>

          <Grid size={12}>
            <Controller
              name="insumoId"
              control={control}
              render={({ field }) => (
                <InsumoAutoComplete field={field} error={errors.insumoId} />
              )}
            />
          </Grid>

          <Grid size={12}>
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
          </Grid>

          <Grid size={6}>
            <Controller
              name="possuiConversao"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormControl
                  error={!!errors.possuiConversao}
                  fullWidth
                  sx={{ alignItems: 'end' }}
                >
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
          </Grid>

          <Grid size={6}>
            <Controller
              name="qtdeEmbalagem"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={!possuiConversao}
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
          </Grid>
        </Grid>
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
