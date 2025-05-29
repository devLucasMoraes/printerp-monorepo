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
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

import { useCategoriaQueries } from '../../../hooks/queries/useCategoriaQueries'
import {
  CreateCategoriaDTO,
  createCategoriaSchema,
} from '../../../http/categoria/create-categoria'
import { ListCategoriasResponse } from '../../../http/categoria/list-categorias'
import {
  UpdateCategoriaDTO,
  updateCategoriaSchema,
} from '../../../http/categoria/update-categoria'
import { useAlertStore } from '../../../stores/alert-store'

interface CategoriaModalProps {
  open: boolean
  onClose: () => void
  categoria?: {
    data: ListCategoriasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }
}

export const CategoriaModal = ({
  open,
  onClose,
  categoria,
}: CategoriaModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    categoria?.data && categoria.type === 'UPDATE'
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
    if (categoria?.data && categoria.type === 'UPDATE') {
      reset({
        nome: categoria.data.nome,
      })
    } else if (categoria?.data && categoria.type === 'COPY') {
      reset({
        nome: categoria.data.nome,
      })
    } else {
      reset({
        nome: '',
      })
    }
  }, [categoria, reset])

  const { mutate: createCategoria } = useCreateCategoria()

  const { mutate: updateCategoria } = useUpdateCategoria()

  const onSubmit = (data: CreateCategoriaDTO | UpdateCategoriaDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (categoria?.data && categoria.type === 'UPDATE') {
      updateCategoria(
        { id: categoria.data.id, orgSlug, data },
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
        <Typography>
          {categoria?.type === 'UPDATE' ? 'Editar' : 'Nova'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {categoria?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar a categoria'
            : 'Preencha os campos abaixo para criar uma nova categoria'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
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
