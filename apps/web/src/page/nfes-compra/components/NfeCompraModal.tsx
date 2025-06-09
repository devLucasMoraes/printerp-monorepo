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
  Grid2,
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
import { FornecedoraAutoComplete } from '../../../components/shared/autocompletes/FornecedoraAutoComplete'
import { InsumoAutoComplete } from '../../../components/shared/autocompletes/InsumoAutoComplete'
import { TransportadoraAutoComplete } from '../../../components/shared/autocompletes/TransportadorasAutoComplete'
import { unidades } from '../../../constants'
import { Unidade } from '../../../constants/Unidade'
import { useInsumoQueries } from '../../../hooks/queries/useInsumoQueries'
import { useNfeCompraQueries } from '../../../hooks/queries/useNfeCompraQueries'
import { createNfeCompraSchema } from '../../../http/nfe-compra/create-nfe-compra'
import { ListNfesCompraResponse } from '../../../http/nfe-compra/list-nfes-compra'
import {
  UpdateNfeCompraDTO,
  updateNfeCompraSchema,
} from '../../../http/nfe-compra/update-nfe-compra'
import { useAlertStore } from '../../../stores/alert-store'

export const NfeCompraModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form?: {
    data?: ListNfesCompraResponse
    type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
  }
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const queryClient = useQueryClient()

  const { useCreate, useUpdate } = useNfeCompraQueries()

  const { useGetAll: useGetAllInsumos } = useInsumoQueries()
  const { data: insumos = [] } = useGetAllInsumos(orgSlug!)

  const isUpdate = form?.type === 'UPDATE'

  const schema = isUpdate ? updateNfeCompraSchema : createNfeCompraSchema

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UpdateNfeCompraDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      nfe: '',
      chaveNfe: '',
      dataEmissao: null as unknown as Date,
      dataRecebimento: null as unknown as Date,
      valorTotalProdutos: 0,
      valorFrete: 0,
      valorSeguro: 0,
      valorTotalIpi: 0,
      valorDesconto: 0,
      valorTotalNfe: 0,
      valorOutros: 0,
      observacao: null,
      fornecedoraId: '',
      transportadoraId: '',
      armazemId: '',
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
        const valorIpi = Number(item.valorIpi) || 0
        return total + quantidade * valorUnitario + valorIpi
      }, 0) || 0

    setValue('valorTotalProdutos', Number(total.toFixed(2)))
  }, [items, setValue])

  useEffect(() => {
    if (!form?.data) {
      reset({
        nfe: '',
        chaveNfe: '',
        dataEmissao: null as unknown as Date,
        dataRecebimento: null as unknown as Date,
        valorTotalProdutos: 0,
        valorFrete: 0,
        valorSeguro: 0,
        valorTotalIpi: 0,
        valorDesconto: 0,
        valorTotalNfe: 0,
        valorOutros: 0,
        observacao: null,
        fornecedoraId: '',
        transportadoraId: '',
        armazemId: '',
        itens: [],
      })
      return
    }

    const { data } = form

    reset({
      nfe: data.nfe,
      chaveNfe: data.chaveNfe,
      dataEmissao: new Date(data.dataEmissao),
      dataRecebimento: new Date(data.dataRecebimento),
      valorTotalProdutos: Number(data.valorTotalProdutos),
      valorFrete: Number(data.valorFrete),
      valorSeguro: Number(data.valorSeguro),
      valorDesconto: Number(data.valorDesconto),
      valorTotalIpi: Number(data.valorTotalIpi),
      valorTotalNfe: Number(data.valorTotalNfe),
      valorOutros: Number(data.valorOutros),
      observacao: data.observacao,
      fornecedoraId: data.fornecedora.id,
      transportadoraId: data.transportadora.id,
      armazemId: data.armazem.id,
      itens: data.itens.map((item) => ({
        id: item.id,
        insumoId: item.insumo.id,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        valorIpi: Number(item.valorIpi),
        unidade: item.unidade,
        descricaoFornecedora: item.descricaoFornecedora,
        referenciaFornecedora: item.referenciaFornecedora,
      })),
    })
  }, [form, reset])

  const { mutate: createNfeCompra } = useCreate()
  const { mutate: updateNfeCompra } = useUpdate()

  const handleSuccess = () => {
    onClose()
    reset()
    queryClient.invalidateQueries({ queryKey: ['estoque'] })
    enqueueSnackbar(
      `Requisição ${isUpdate ? 'atualizada' : 'criada'} com sucesso`,
      { variant: 'success' },
    )
  }

  const onSubmit = (data: UpdateNfeCompraDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (isUpdate && form?.data) {
      updateNfeCompra(
        { id: form.data.id, orgSlug, data },
        {
          onSuccess: handleSuccess,
          onError: (error) => {
            console.error(error)
            enqueueSnackbar(error.response?.data.message || error.message, {
              variant: 'error',
            })
          },
        },
      )
    } else {
      createNfeCompra(
        { orgSlug, data },
        {
          onSuccess: handleSuccess,
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
      valorIpi: 0,
      descricaoFornecedora: '',
      referenciaFornecedora: '',
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
            <Grid2 container spacing={2}>
              <Grid2 size={2}>
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
              </Grid2>

              <Grid2 size={2}>
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
              </Grid2>

              <Grid2 size={2}>
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
              </Grid2>

              <Grid2 size={2}>
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
              </Grid2>

              <Grid2 size={2}>
                <Controller
                  name={`itens.${index}.valorIpi`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Valor Unitário"
                      error={!!errors.itens?.[index]?.valorIpi}
                      helperText={errors.itens?.[index]?.valorIpi?.message}
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
              </Grid2>

              <Grid2
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
              </Grid2>
            </Grid2>
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
            ? 'Preencha os campos abaixo para editar a nota fiscal'
            : 'Preencha os campos abaixo para criar uma nova nota fiscal'}
        </DialogContentText>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size="grow">
            <Controller
              name="valorTotalNfe"
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
                  error={!!errors.valorTotalNfe}
                  helperText={errors.valorTotalNfe?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="armazemId"
              control={control}
              render={({ field }) => (
                <ArmazemAutoComplete field={field} error={errors.armazemId} />
              )}
            />
          </Grid2>

          <Grid2 size="auto">
            <Controller
              name="dataEmissao"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Data de emissão"
                  slotProps={{
                    textField: {
                      error: !!errors.dataEmissao,
                      helperText: errors.dataEmissao?.message,
                    },
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size="auto">
            <Controller
              name="dataRecebimento"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Data de entrega"
                  slotProps={{
                    textField: {
                      error: !!errors.dataRecebimento,
                      helperText: errors.dataRecebimento?.message,
                    },
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={6}>
            <Controller
              name="chaveNfe"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Chave NFE"
                  error={!!errors.chaveNfe}
                  helperText={errors.chaveNfe?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          <Grid2 size={2}>
            <Controller
              name="nfe"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="NFE"
                  error={!!errors.nfe}
                  helperText={errors.nfe?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          <Grid2 size={4}>
            <Controller
              name="fornecedoraId"
              control={control}
              render={({ field }) => (
                <FornecedoraAutoComplete
                  field={field}
                  error={errors.fornecedoraId}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="valorTotalIpi"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total IPI"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorTotalIpi}
                  helperText={errors.valorTotalIpi?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="valorTotalProdutos"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total de produtos"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorTotalProdutos}
                  helperText={errors.valorTotalProdutos?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="valorDesconto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total de desconto"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorDesconto}
                  helperText={errors.valorDesconto?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="valorSeguro"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total do seguro"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorSeguro}
                  helperText={errors.valorSeguro?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="valorFrete"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Valor total do frete"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorFrete}
                  helperText={errors.valorFrete?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={4}>
            <Controller
              name="transportadoraId"
              control={control}
              render={({ field }) => (
                <TransportadoraAutoComplete
                  field={field}
                  error={errors.transportadoraId}
                />
              )}
            />
          </Grid2>

          <Grid2 size={3}>
            <Controller
              name="valorOutros"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Outros valores"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    },
                  }}
                  error={!!errors.valorOutros}
                  helperText={errors.valorOutros?.message}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? null : Number(value))
                  }}
                />
              )}
            />
          </Grid2>

          <Grid2 size={12}>
            <Controller
              name="observacao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observação"
                  error={!!errors.observacao}
                  helperText={errors.observacao?.message}
                  fullWidth
                />
              )}
            />
          </Grid2>

          {/* Items Section */}
          <Grid2 size={12}>
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
