import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { IconCircleMinus, IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useParams } from 'react-router'

import { ArmazemAutoComplete } from '../../../components/shared/autocompletes/ArmazemAutoComplete'
import { InsumoAutoComplete } from '../../../components/shared/autocompletes/InsumoAutoComplete'
import { RequisitanteAutoComplete } from '../../../components/shared/autocompletes/RequisitanteAutoComplete'
import { SetorAutoComplete } from '../../../components/shared/autocompletes/SetorAutoComplete'
import { unidades } from '../../../constants'
import type { Unidade } from '../../../constants/Unidade'
import { useInsumoQueries } from '../../../hooks/queries/useInsumoQueries'
import { useRequisicaoEstoqueQueries } from '../../../hooks/queries/useRequisicaoEstoqueQueries'
import { createRequisicaoEstoqueSchema } from '../../../http/requisicao-estoque/create-requisicao-estoque'
import type { ListRequisicoesEstoqueResponse } from '../../../http/requisicao-estoque/list-requisicoes-estoque'
import type { UpdateRequisicaoEstoqueDTO } from '../../../http/requisicao-estoque/update-requisicao-estoque'
import { updateRequisicaoEstoqueSchema } from '../../../http/requisicao-estoque/update-requisicao-estoque'
import { useAlertStore } from '../../../stores/alert-store'

export const RequisicaoEstoqueModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListRequisicoesEstoqueResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const queryClient = useQueryClient()

  const { useCreate, useUpdate } = useRequisicaoEstoqueQueries()

  const { useGetAll: useGetAllInsumos } = useInsumoQueries()
  const { data: insumos = [] } = useGetAllInsumos(orgSlug!)

  const isUpdate = form?.type === 'UPDATE'

  const schema = isUpdate
    ? updateRequisicaoEstoqueSchema
    : createRequisicaoEstoqueSchema

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateRequisicaoEstoqueDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      dataRequisicao: '' as unknown as Date,
      valorTotal: 0,
      ordemProducao: null,
      obs: null,
      armazemId: '',
      setorId: '',
      requisitanteId: '',
      itens: [],
    },
  })

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'itens',
  })

  const items = useWatch({
    control,
    name: 'itens',
    defaultValue: [],
  })

  useEffect(() => {
    const total =
      items?.reduce((total, item) => {
        const quantidade = Number(item.quantidade) || 0
        const valorUnitario = Number(item.valorUnitario) || 0
        return total + quantidade * valorUnitario
      }, 0) || 0

    setValue('valorTotal', Number(total.toFixed(2)))
  }, [items, setValue])

  useEffect(() => {
    if (!form?.data) {
      reset({
        dataRequisicao: '' as unknown as Date,
        valorTotal: 0,
        ordemProducao: null,
        obs: null,
        armazemId: '',
        setorId: '',
        requisitanteId: '',
        itens: [],
      })
      return
    }

    const { data } = form

    reset({
      dataRequisicao: new Date(data.dataRequisicao),
      valorTotal: data.valorTotal,
      ordemProducao: data.ordemProducao,
      obs: data.obs,
      armazemId: data.armazem.id,
      setorId: data.setor.id,
      requisitanteId: data.requisitante.id,
      itens: data.itens.map((item) => ({
        id: item.id,
        insumoId: item.insumo.id,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        unidade: item.unidade,
      })),
    })
  }, [form, reset])

  const { mutate: createRequisicaoEstoque } = useCreate()
  const { mutate: updateRequisicaoEstoque } = useUpdate()

  const handleSuccess = () => {
    onClose()
    reset()
    void queryClient.invalidateQueries({ queryKey: ['estoque'] })
    enqueueSnackbar(
      `Requisição ${isUpdate ? 'atualizada' : 'criada'} com sucesso`,
      { variant: 'success' },
    )
  }

  const onSubmit = (data: UpdateRequisicaoEstoqueDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (isUpdate && form?.data) {
      updateRequisicaoEstoque(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: handleSuccess,
          onError: (error) => {
            console.error(error)
            enqueueSnackbar(error.response?.data.message ?? error.message, {
              variant: 'error',
            })
          },
        },
      )
    } else {
      createRequisicaoEstoque(
        { orgSlug, data },
        {
          onSuccess: handleSuccess,
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

  const handleInsumoChange = useCallback(
    (index: number, insumoId?: string | null) => {
      const insumo = insumos.find((insumo) => insumo.id === insumoId)
      if (!insumo) return

      setValue(`itens.${index}.unidade`, insumo.undEstoque)
      setValue(`itens.${index}.valorUnitario`, Number(insumo.valorUntMed))
    },
    [insumos, setValue],
  )

  const handleAddItem = () => {
    prepend({
      id: null,
      quantidade: 0,
      unidade: '' as unknown as Unidade,
      valorUnitario: 0,
      insumoId: '',
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Renderização dos itens da requisição
  const renderItems = () => {
    if (fields.length === 0) {
      return (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Nenhum item adicionado
          </Typography>
          <Button
            startIcon={<IconPlus size={18} />}
            onClick={handleAddItem}
            variant="outlined"
            size="small"
          >
            Adicionar Primeiro Item
          </Button>
        </Box>
      )
    }

    return (
      <Box>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              px: 2,
              py: 2,
              mb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid size={4}>
                <Controller
                  name={`itens.${index}.insumoId`}
                  control={control}
                  render={({ field }) => (
                    <InsumoAutoComplete
                      size="small"
                      field={{
                        ...field,
                        onChange: (value) => {
                          field.onChange(value)
                          handleInsumoChange(index, value)
                        },
                      }}
                      error={errors.itens?.[index]?.insumoId}
                    />
                  )}
                />
              </Grid>

              <Grid size={2}>
                <Controller
                  name={`itens.${index}.quantidade`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Quantidade"
                      error={!!errors.itens?.[index]?.quantidade}
                      helperText={errors.itens?.[index]?.quantidade?.message}
                      fullWidth
                      size="small"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid size={3}>
                <Controller
                  name={`itens.${index}.unidade`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unidade"
                      error={!!errors.itens?.[index]?.unidade}
                      helperText={errors.itens?.[index]?.unidade?.message}
                      value={field.value || ''}
                      fullWidth
                      select
                      size="small"
                    >
                      {unidades.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={2}>
                <Controller
                  name={`itens.${index}.valorUnitario`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Valor Unitário"
                      error={!!errors.itens?.[index]?.valorUnitario}
                      helperText={errors.itens?.[index]?.valorUnitario?.message}
                      disabled
                      fullWidth
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">R$</InputAdornment>
                          ),
                        },
                      }}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid
                size={1}
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <IconButton
                  onClick={() => remove(index)}
                  color="error"
                  size="small"
                >
                  <IconCircleMinus />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      fullWidth
      maxWidth="xl"
      disableRestoreFocus
    >
      <DialogTitle>{isUpdate ? 'Editar' : 'Nova'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isUpdate
            ? 'Preencha os campos abaixo para editar a requisição de estoque'
            : 'Preencha os campos abaixo para criar uma nova requisição de estoque'}
        </DialogContentText>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size="grow">
            <Controller
              name="valorTotal"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  disabled
                  error={!!errors.valorTotal}
                  helperText={errors.valorTotal?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={4}>
            <Controller
              name="armazemId"
              control={control}
              render={({ field }) => (
                <ArmazemAutoComplete field={field} error={errors.armazemId} />
              )}
            />
          </Grid>

          <Grid size="auto">
            <Controller
              name="dataRequisicao"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Data da requisição"
                  slotProps={{
                    textField: {
                      error: !!errors.dataRequisicao,
                      helperText: errors.dataRequisicao?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="obs"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observação"
                  error={!!errors.obs}
                  helperText={errors.obs?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid size={4}>
            <Controller
              name="ordemProducao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ordem de produção"
                  error={!!errors.ordemProducao}
                  helperText={errors.ordemProducao?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid size={4}>
            <Controller
              name="setorId"
              control={control}
              render={({ field }) => (
                <SetorAutoComplete field={field} error={errors.setorId} />
              )}
            />
          </Grid>

          <Grid size={4}>
            <Controller
              name="requisitanteId"
              control={control}
              render={({ field }) => (
                <RequisitanteAutoComplete
                  field={field}
                  error={errors.requisitanteId}
                />
              )}
            />
          </Grid>

          {/* Items Section */}
          <Grid size={12}>
            <Box sx={{ mt: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
                gap={1}
              >
                <Divider textAlign="left" sx={{ flexGrow: 1 }}>
                  <Chip label="Itens da Requisição" />
                </Divider>
                <Button
                  startIcon={<IconPlus size={18} />}
                  onClick={handleAddItem}
                  variant="outlined"
                  size="small"
                >
                  adicionar item
                </Button>
              </Stack>

              {renderItems()}
            </Box>
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
