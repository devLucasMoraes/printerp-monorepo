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

import { useRequisitanteQueries } from '../../../hooks/queries/useRequisitanteQueries'
import type { CreateRequisitanteDTO } from '../../../http/requisitante/create-requisitante'
import { createRequisitanteSchema } from '../../../http/requisitante/create-requisitante'
import type { ListRequisitantesResponse } from '../../../http/requisitante/list-requisitantes'
import type { UpdateRequisitanteDTO } from '../../../http/requisitante/update-requisitante'
import { updateRequisitanteSchema } from '../../../http/requisitante/update-requisitante'
import { useAlertStore } from '../../../stores/alert-store'

export const RequisitanteModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListRequisitantesResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateRequisitanteSchema
      : createRequisitanteSchema

  const { useCreate: useCreateRequisitante, useUpdate: useUpdateRequisitante } =
    useRequisitanteQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateRequisitanteDTO | UpdateRequisitanteDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      fone: '',
    },
  })

  useEffect(() => {
    if (form?.data && form.type === 'UPDATE') {
      reset({
        nome: form.data.nome,
        fone: form.data.fone,
      })
    } else if (form?.data && form.type === 'COPY') {
      reset({
        nome: form.data.nome,
        fone: form.data.fone,
      })
    } else {
      reset({
        nome: '',
        fone: '',
      })
    }
  }, [form, reset])

  const { mutate: createRequisitante } = useCreateRequisitante()

  const { mutate: updateRequisitante } = useUpdateRequisitante()

  const onSubmit = (data: CreateRequisitanteDTO | UpdateRequisitanteDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateRequisitante(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Requisitante atualizado com sucesso', {
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
      createRequisitante(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Requisitante criado com sucesso', {
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
            ? 'Preencha os campos abaixo para editar o requisitante'
            : 'Preencha os campos abaixo para criar um novo requisitante'}
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
          <Grid size={12}>
            <Controller
              name="fone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Telefone"
                  error={!!errors.fone}
                  helperText={errors.fone?.message}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
