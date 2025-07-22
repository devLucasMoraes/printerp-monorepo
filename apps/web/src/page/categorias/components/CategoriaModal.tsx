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
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useCategoriaQueries } from '../../../hooks/queries/useCategoriaQueries'
import type { CreateCategoriaDTO } from '../../../http/categoria/create-categoria'
import { createCategoriaSchema } from '../../../http/categoria/create-categoria'
import type { ListCategoriasResponse } from '../../../http/categoria/list-categorias'
import type { UpdateCategoriaDTO } from '../../../http/categoria/update-categoria'
import { updateCategoriaSchema } from '../../../http/categoria/update-categoria'
import { useAlertStore } from '../../../stores/alert-store'

export const CategoriaModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListCategoriasResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateCategoriaSchema
      : createCategoriaSchema

  const { useCreate: useCreateCategoria, useUpdate: useUpdateCategoria } =
    useCategoriaQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCategoriaDTO | UpdateCategoriaDTO>({
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

  const { mutate: createCategoria } = useCreateCategoria()

  const { mutate: updateCategoria } = useUpdateCategoria()

  const onSubmit = (data: CreateCategoriaDTO | UpdateCategoriaDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateCategoria(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Categoria atualizada com sucesso', {
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
      createCategoria(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Categoria criada com sucesso', {
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
      <DialogTitle>
        <Typography>{form?.type === 'UPDATE' ? 'Editar' : 'Nova'}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {form?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar a categoria'
            : 'Preencha os campos abaixo para criar uma nova categoria'}
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
