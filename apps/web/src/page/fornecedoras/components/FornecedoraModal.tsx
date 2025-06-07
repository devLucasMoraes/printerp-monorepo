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

import { useFornecedoraQueries } from '../../../hooks/queries/useFornecedoraQueries'
import {
  CreateFornecedoraDTO,
  createFornecedoraSchema,
} from '../../../http/fornecedora/create-fornecedora'
import { ListFornecedorasResponse } from '../../../http/fornecedora/list-fornecedoras'
import {
  UpdateFornecedoraDTO,
  updateFornecedoraSchema,
} from '../../../http/fornecedora/update-fornecedora'
import { useAlertStore } from '../../../stores/alert-store'

interface FornecedoraModalProps {
  open: boolean
  onClose: () => void
  form?: {
    data: ListFornecedorasResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }
}

export const FornecedoraModal = ({
  open,
  onClose,
  form,
}: FornecedoraModalProps) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateFornecedoraSchema
      : createFornecedoraSchema

  const { useCreate: useCreateFornecedora, useUpdate: useUpdateFornecedora } =
    useFornecedoraQueries()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFornecedoraDTO | UpdateFornecedoraDTO>({
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

  const { mutate: createFornecedora } = useCreateFornecedora()

  const { mutate: updateFornecedora } = useUpdateFornecedora()

  const onSubmit = (data: CreateFornecedoraDTO | UpdateFornecedoraDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form.type === 'UPDATE') {
      updateFornecedora(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Fornecedora atualizada com sucesso', {
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
      createFornecedora(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Fornecedora criada com sucesso', {
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
            ? 'Preencha os campos abaixo para editar o fornecedora'
            : 'Preencha os campos abaixo para criar um novo fornecedora'}
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
