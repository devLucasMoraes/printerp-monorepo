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

import { useParceiroQueries } from '../../../hooks/queries/useParceiroQueries'
import type { CreateParceiroDTO } from '../../../http/parceiro/create-parceiro'
import { createParceiroSchema } from '../../../http/parceiro/create-parceiro'
import type { ListParceirosResponse } from '../../../http/parceiro/list-parceiros'
import type { UpdateParceiroDTO } from '../../../http/parceiro/update-parceiro'
import { updateParceiroSchema } from '../../../http/parceiro/update-parceiro'
import { useAlertStore } from '../../../stores/alert-store'

export const ParceiroModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListParceirosResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateParceiroSchema
      : createParceiroSchema

  const { useCreate: useCreateParceiro, useUpdate: useUpdateParceiro } =
    useParceiroQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateParceiroDTO | UpdateParceiroDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
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

  const { mutate: createParceiro } = useCreateParceiro()

  const { mutate: updateParceiro } = useUpdateParceiro()

  const onSubmit = (data: CreateParceiroDTO | UpdateParceiroDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateParceiro(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Parceiro atualizado com sucesso', {
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
      createParceiro(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Parceiro criado com sucesso', {
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
            ? 'Preencha os campos abaixo para editar o parceiro'
            : 'Preencha os campos abaixo para criar um novo parceiro'}
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
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
