import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useArmazemQueries } from '../../../hooks/queries/useArmazemQueries'
import type { CreateArmazemDTO } from '../../../http/armazem/create-armazem'
import { createArmazemSchema } from '../../../http/armazem/create-armazem'
import type { ListArmazensResponse } from '../../../http/armazem/list-armazens'
import type { UpdateArmazemDTO } from '../../../http/armazem/update-armazem'
import { updateArmazemSchema } from '../../../http/armazem/update-armazem'
import { useAlertStore } from '../../../stores/alert-store'

export const ArmazemModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListArmazensResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateArmazemSchema
      : createArmazemSchema

  const { useCreate: useCreateArmazem, useUpdate: useUpdateArmazem } =
    useArmazemQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateArmazemDTO | UpdateArmazemDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
    },
  })

  useEffect(() => {
    if (form?.data && form.type === 'UPDATE') {
      reset({
        nome: form.data.nome,
      })
    }
    if (form?.data && form.type === 'COPY') {
      reset({
        nome: form.data.nome,
      })
    }
    if (!form?.data || form?.type === 'CREATE') {
      reset({
        nome: '',
      })
    }
  }, [form, reset])

  const { mutate: createArmazem } = useCreateArmazem()

  const { mutate: updateArmazem } = useUpdateArmazem()

  const onSubmit = (data: CreateArmazemDTO | UpdateArmazemDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateArmazem(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Armazém atualizado com sucesso', {
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
      createArmazem(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Armazém criado com sucesso', {
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
      <DialogTitle>{form?.type === 'UPDATE' ? 'Editar' : 'Novo'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar o armazém'
            : 'Preencha os campos abaixo para criar um novo armazém'}
        </DialogContentText>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={12}>
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  fullWidth
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
