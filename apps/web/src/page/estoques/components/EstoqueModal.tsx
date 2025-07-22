import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useEstoqueQueries } from '../../../hooks/queries/useEstoqueQueries'
import type { AdjustEstoqueDTO } from '../../../http/estoque/adjust-estoque'
import { adjustEstoqueSchema } from '../../../http/estoque/adjust-estoque'
import type { ListEstoquesResponse } from '../../../http/estoque/list-estoques'
import { useAlertStore } from '../../../stores/alert-store'

export const EstoqueModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListEstoquesResponse
        type: 'UPDATE' | 'COPY' | 'CREATE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const { useAdjustEstoque } = useEstoqueQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdjustEstoqueDTO>({
    resolver: zodResolver(adjustEstoqueSchema),
    defaultValues: {
      quantidade: 0,
    },
  })

  useEffect(() => {
    if (!form?.data) {
      return
    }
    reset({
      quantidade: form.data.quantidade,
    })
  }, [form, reset])

  const { mutate: adjustEstoque } = useAdjustEstoque()

  const onSubmit = (data: AdjustEstoqueDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      adjustEstoque(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Ajuste de estoque realizado com sucesso', {
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
      <DialogTitle>Ajuste de estoque</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Informe a quantidade real do insumo: ${form?.data?.insumo?.descricao}, do armazém: ${form?.data?.armazem?.nome}`}
        </DialogContentText>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={12}>
            <Controller
              name="quantidade"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Quantidade"
                  error={!!errors.quantidade}
                  helperText={errors.quantidade?.message}
                  fullWidth
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {form?.data?.insumo.undEstoque}
                        </InputAdornment>
                      ),
                    },
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
