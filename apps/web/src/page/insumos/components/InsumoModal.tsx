import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { CategoriaAutoComplete } from '../../../components/shared/autocompletes/CategoriaAutoComplete'
import { unidades } from '../../../constants'
import type { Unidade } from '../../../constants/Unidade'
import { useInsumoQueries } from '../../../hooks/queries/useInsumoQueries'
import type { CreateInsumoDTO } from '../../../http/insumo/create-insumo'
import { createInsumoSchema } from '../../../http/insumo/create-insumo'
import type { ListInsumosResponse } from '../../../http/insumo/list-insumos'
import type { UpdateInsumoDTO } from '../../../http/insumo/update-insumo'
import { updateInsumoSchema } from '../../../http/insumo/update-insumo'
import { useAlertStore } from '../../../stores/alert-store'

export const InsumoModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListInsumosResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateInsumoSchema
      : createInsumoSchema

  const { useCreate: useCreateInsumo, useUpdate: useUpdateInsumo } =
    useInsumoQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateInsumoDTO | UpdateInsumoDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      descricao: '',
      categoriaId: '',
      undEstoque: '' as unknown as Unidade,
      valorUntMedAuto: false,
      valorUntMed: 0,
      estoqueMinimo: 0,
    },
  })

  useEffect(() => {
    if (form?.data && (form.type === 'UPDATE' || form.type === 'COPY')) {
      reset({
        descricao: form.data.descricao,
        categoriaId: form.data.categoria.id,
        undEstoque: form.data.undEstoque,
        valorUntMed: form.data.valorUntMed,
        valorUntMedAuto: form.data.valorUntMedAuto,
        estoqueMinimo: form.data.estoqueMinimo,
      })
    } else {
      reset({
        descricao: '',
        categoriaId: '',
        undEstoque: '' as unknown as Unidade,
        valorUntMedAuto: false,
        valorUntMed: 0,
        estoqueMinimo: 0,
      })
    }
  }, [form, reset])

  const { mutate: createInsumo } = useCreateInsumo()

  const { mutate: updateInsumo } = useUpdateInsumo()

  const onSubmit = (data: CreateInsumoDTO | UpdateInsumoDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateInsumo(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Insumo atualizada com sucesso', {
              variant: 'success',
            })
          },
          onError: (error) => {
            console.error(error)
            enqueueSnackbar(error.response?.data.message ?? error.message, {
              variant: 'error',
            })
          },
        },
      )
    } else {
      createInsumo(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Insumo criada com sucesso', { variant: 'success' })
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
    >
      <DialogTitle>{form?.type === 'UPDATE' ? 'Editar' : 'Novo'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar o insumo'
            : 'Preencha os campos abaixo para criar um novo insumo'}
        </DialogContentText>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={12}>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição"
                  error={!!errors.descricao}
                  helperText={errors.descricao?.message}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="valorUntMed"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor unitário"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorUntMed}
                  helperText={errors.valorUntMed?.message}
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
          <Grid size={6}>
            <Controller
              name="valorUntMedAuto"
              control={control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormControl error={!!errors.valorUntMedAuto} fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value ?? false}
                        onChange={(e) => onChange(e.target.checked)}
                        {...fieldProps}
                      />
                    }
                    label="Valor unitário automático"
                  />
                  <FormHelperText>
                    {errors.valorUntMedAuto?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="estoqueMinimo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Estoque mínimo"
                  error={!!errors.estoqueMinimo}
                  helperText={errors.estoqueMinimo?.message}
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
          <Grid size={6}>
            <Controller
              name="undEstoque"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Und. Estoque"
                  error={!!errors.undEstoque}
                  helperText={errors.undEstoque?.message}
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
              name="categoriaId"
              control={control}
              render={({ field }) => (
                <CategoriaAutoComplete
                  field={field}
                  error={errors.categoriaId}
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
