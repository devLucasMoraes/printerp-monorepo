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

import { useSetorQueries } from '../../../hooks/queries/useSetorQueries'
import type { CreateSetorDTO } from '../../../http/setor/create-setor'
import { createSetorSchema } from '../../../http/setor/create-setor'
import type { ListSetoresResponse } from '../../../http/setor/list-setores'
import type { UpdateSetorDTO } from '../../../http/setor/update-setor'
import { updateSetorSchema } from '../../../http/setor/update-setor'
import { useAlertStore } from '../../../stores/alert-store'

export const SetorModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListSetoresResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE' ? updateSetorSchema : createSetorSchema

  const { useCreate: useCreateSetor, useUpdate: useUpdateSetor } =
    useSetorQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateSetorDTO | UpdateSetorDTO>({
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
    } else if (form?.data && form.type === 'COPY') {
      reset({
        nome: form.data.nome,
      })
    } else {
      reset({
        nome: '',
      })
    }
  }, [form, reset])

  const { mutate: createSetor } = useCreateSetor()

  const { mutate: updateSetor } = useUpdateSetor()

  const onSubmit = (data: CreateSetorDTO | UpdateSetorDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateSetor(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Setor atualizado com sucesso', {
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
      createSetor(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Setor criado com sucesso', { variant: 'success' })
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
            ? 'Preencha os campos abaixo para editar o setor'
            : 'Preencha os campos abaixo para criar um novo setor'}
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
