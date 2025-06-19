import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useTransportadoraQueries } from '../../../hooks/queries/useTransportadoraQueries'
import {
  CreateTransportadoraDTO,
  createTransportadoraSchema,
} from '../../../http/transportadora/create-transportadora'
import { ListTransportadorasResponse } from '../../../http/transportadora/list-transportadoras'
import {
  UpdateTransportadoraDTO,
  updateTransportadoraSchema,
} from '../../../http/transportadora/update-transportadora'
import { useAlertStore } from '../../../stores/alert-store'

interface TransportadoraModalProps {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListTransportadorasResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}

export const TransportadoraModal = ({
  open,
  onClose,
  form,
}: TransportadoraModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateTransportadoraSchema
      : createTransportadoraSchema

  const {
    useCreate: useCreateTransportadora,
    useUpdate: useUpdateTransportadora,
  } = useTransportadoraQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTransportadoraDTO | UpdateTransportadoraDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeFantasia: '',
      razaoSocial: '',
      cnpj: '',
      fone: '',
    },
  })

  useEffect(() => {
    if (!form?.data) {
      reset({
        nomeFantasia: '',
        razaoSocial: '',
        cnpj: '',
        fone: '',
      })
      return
    }
    const { data } = form

    reset({
      nomeFantasia: data.nomeFantasia,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      fone: data.fone,
    })
  }, [form, reset])

  const { mutate: createTransportadora } = useCreateTransportadora()

  const { mutate: updateTransportadora } = useUpdateTransportadora()

  const onSubmit = (
    data: CreateTransportadoraDTO | UpdateTransportadoraDTO,
  ) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateTransportadora(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Transportadora atualizada com sucesso', {
              variant: 'success',
            })
          },
          onError: (error) => {
            console.error(error)
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            })
          },
        },
      )
    } else {
      createTransportadora(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Transportadora criada com sucesso', {
              variant: 'success',
            })
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
            ? 'Preencha os campos abaixo para editar o transportadora'
            : 'Preencha os campos abaixo para criar um novo transportadora'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Controller
              name="nomeFantasia"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome fantasia"
                  error={!!errors.nomeFantasia}
                  helperText={errors.nomeFantasia?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="razaoSocial"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Razao social"
                  error={!!errors.razaoSocial}
                  helperText={errors.razaoSocial?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="cnpj"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="CNPJ"
                  error={!!errors.cnpj}
                  helperText={errors.cnpj?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
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
