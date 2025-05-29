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

import { useSetorQueries } from '../../../hooks/queries/useSetorQueries'
import { ListCatgoriasResponse } from '../../../http/categoria/list-categorias'
import {
  CreateSetorDTO,
  createSetorSchema,
} from '../../../http/setor/create-setor'
import {
  UpdateSetorDTO,
  updateSetorSchema,
} from '../../../http/setor/update-setor'
import { useAlertStore } from '../../../stores/alert-store'

interface SetorModalProps {
  open: boolean
  onClose: () => void
  setor?: {
    data: ListCatgoriasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }
}

export const SetorModal = ({ open, onClose, setor }: SetorModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    setor?.data && setor.type === 'UPDATE'
      ? updateSetorSchema
      : createSetorSchema

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
    if (setor?.data && setor.type === 'UPDATE') {
      reset({
        nome: setor.data.nome,
      })
    } else if (setor?.data && setor.type === 'COPY') {
      reset({
        nome: setor.data.nome,
      })
    } else {
      reset({
        nome: '',
      })
    }
  }, [setor, reset])

  const { mutate: createSetor } = useCreateSetor()

  const { mutate: updateSetor } = useUpdateSetor()

  const onSubmit = (data: CreateSetorDTO | UpdateSetorDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (setor?.data && setor.type === 'UPDATE') {
      updateSetor(
        { id: setor.data.id, orgSlug, data },
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
            enqueueSnackbar(error.response?.data.message || error.message, {
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
      <DialogTitle>{setor?.type === 'UPDATE' ? 'Editar' : 'Novo'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {setor?.type === 'UPDATE'
            ? 'Preencha os campos abaixo para editar o setor'
            : 'Preencha os campos abaixo para criar um novo setor'}
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
