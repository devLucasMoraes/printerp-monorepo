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
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { IconCircleMinus, IconLibraryPlus, IconPlus } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import { ArmazemAutoComplete } from '../../../components/shared/autocompletes/ArmazemAutoComplete'
import { FornecedoraAutoComplete } from '../../../components/shared/autocompletes/FornecedoraAutoComplete'
import { TransportadoraAutoComplete } from '../../../components/shared/autocompletes/TransportadorasAutoComplete'
import { unidades } from '../../../constants'
import type { Unidade } from '../../../constants/Unidade'
import { useFornecedoraQueries } from '../../../hooks/queries/useFornecedoraQueries'
import { useNfeCompraQueries } from '../../../hooks/queries/useNfeCompraQueries'
import { useTransportadoraQueries } from '../../../hooks/queries/useTransportadoraQueries'
import type { CreateFornecedoraResponse } from '../../../http/fornecedora/create-fornecedora'
import { createNfeCompraSchema } from '../../../http/nfe-compra/create-nfe-compra'
import type { ListNfesCompraResponse } from '../../../http/nfe-compra/list-nfes-compra'
import type { UpdateNfeCompraDTO } from '../../../http/nfe-compra/update-nfe-compra'
import { updateNfeCompraSchema } from '../../../http/nfe-compra/update-nfe-compra'
import type { CreateTransportadoraResponse } from '../../../http/transportadora/create-transportadora'
import type { CreateOrUpdateVinculoResponse } from '../../../http/vinculo/create-or-update-vinculo'
import type { GetVinculoByCodResponse } from '../../../http/vinculo/get-vinculo-by-cod'
import { getVinculoByCod } from '../../../http/vinculo/get-vinculo-by-cod'
import { useAlertStore } from '../../../stores/alert-store'
import type { NfeData } from '../../../types'
import { normalizeText } from '../../../util/normalizeText'
import { FornecedoraModal } from '../../fornecedoras/components/FornecedoraModal'
import { TransportadoraModal } from '../../transportadoras/components/TransportadoraModal'
import { VinculoButton } from './VinculoButton'
import { VinculoModal } from './VinculoModal'

export const NfeCompraModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListNfesCompraResponse | undefined
        nfeData: NfeData | undefined
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE' | 'IMPORT_XML'
      }
    | undefined
}) => {
  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const queryClient = useQueryClient()

  const [vinculoModalOpen, setVinculoModalOpen] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  )
  const [initialData, setInitialData] = useState({ cod: '', fornecedoraId: '' })
  const [selectedVinculo, setSelectedVinculo] = useState<
    GetVinculoByCodResponse | undefined
  >()

  const [fornecedoraModalOpen, setFornecedoraModalOpen] = useState(false)
  const [transportadoraModalOpen, setTransportadoraModalOpen] = useState(false)

  const { useCreate, useUpdate } = useNfeCompraQueries()
  const { useGetByCnpj: useGetFornecedoraByCnpj } = useFornecedoraQueries()
  const { useGetByCnpj: useGetTranspotadoraByCnpj } = useTransportadoraQueries()

  const nfeData = form?.nfeData

  const initialFornecedoraData = useMemo(() => {
    if (!nfeData) return undefined
    return {
      nomeFantasia: nfeData.fornecedor.nomeFantasia || '',
      razaoSocial: nfeData.fornecedor.razaoSocial || '',
      cnpj: nfeData.fornecedor.cnpj || '',
      fone: '',
    }
  }, [nfeData])

  const initialTransportadoraData = useMemo(() => {
    if (!nfeData) return undefined
    return {
      nomeFantasia: nfeData.transportadora.razaoSocial || '',
      razaoSocial: nfeData.transportadora.razaoSocial || '',
      cnpj: nfeData.transportadora.cnpj || '',
      fone: '',
    }
  }, [nfeData])

  const { data: fornecedora } = useGetFornecedoraByCnpj(
    nfeData?.fornecedor.cnpj || '',
    orgSlug!,
    {
      enabled: !!nfeData?.fornecedor.cnpj,
    },
  )

  const { data: transportadora } = useGetTranspotadoraByCnpj(
    nfeData?.transportadora.cnpj || '',
    orgSlug!,
    {
      enabled: !!nfeData?.transportadora.cnpj,
    },
  )

  const isUpdate = form?.type === 'UPDATE'

  const schema = isUpdate ? updateNfeCompraSchema : createNfeCompraSchema

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
    watch,
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
      addEstoque: true,
      itens: [],
    },
  })

  const addEstoque = watch('addEstoque')

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'itens',
  })

  const items = useWatch({
    control,
    name: 'itens',
    defaultValue: [],
  })

  const valorSeguro = useWatch({
    control,
    name: 'valorSeguro',
  })

  const valorFrete = useWatch({
    control,
    name: 'valorFrete',
  })

  const valorOutros = useWatch({
    control,
    name: 'valorOutros',
  })

  const valorDesconto = useWatch({
    control,
    name: 'valorDesconto',
  })

  useEffect(() => {
    const totalProdutos =
      items?.reduce((total, item) => {
        const quantidade = Number(item.qtdeNf) || 0
        const valorUnitario = Number(item.valorUnitario) || 0
        return total + quantidade * valorUnitario
      }, 0) || 0

    const totalIpi =
      items?.reduce((total, item) => {
        const valorIpi = Number(item.valorIpi) || 0
        return total + valorIpi
      }, 0) || 0

    const totalNfe =
      totalProdutos +
      totalIpi +
      valorSeguro +
      valorOutros +
      valorFrete -
      valorDesconto

    setValue('valorTotalNfe', Number(totalNfe.toFixed(2)))
    setValue('valorTotalProdutos', Number(totalProdutos.toFixed(2)))
    setValue('valorTotalIpi', Number(totalIpi.toFixed(2)))
  }, [
    getValues,
    items,
    setValue,
    valorDesconto,
    valorFrete,
    valorOutros,
    valorSeguro,
  ])

  const getCachedVinculo = useCallback(
    (cod: string): GetVinculoByCodResponse | undefined => {
      return queryClient.getQueryData<GetVinculoByCodResponse>([
        'vinculos',
        orgSlug,
        cod,
      ])
    },
    [queryClient, orgSlug],
  )

  useEffect(() => {
    if (form?.nfeData && form.type === 'IMPORT_XML' && orgSlug) {
      const data = form.nfeData
      const processXmlImport = async () => {
        try {
          // Pré-buscar todos os vínculos em paralelo
          const prefetchPromises = data.produtos
            .filter((produto) => normalizeText(produto.codigo))
            .map((produto) =>
              queryClient.prefetchQuery({
                queryKey: ['vinculos', orgSlug, normalizeText(produto.codigo)],
                queryFn: () =>
                  getVinculoByCod(orgSlug, normalizeText(produto.codigo)),
              }),
            )

          await Promise.allSettled(prefetchPromises)

          // Construir itens com dados do cache
          const itensComVinculos = data.produtos.map((produto) => {
            const vinculo = normalizeText(produto.codigo)
              ? getCachedVinculo(normalizeText(produto.codigo))
              : null

            return {
              id: null,
              qtdeNf: produto.quantidade,
              valorUnitario: produto.valorUnitario,
              valorIpi: produto.valorIpi,
              unidadeNf: produto.unidade as Unidade,
              descricaoFornecedora: produto.descricao,
              codFornecedora: normalizeText(produto.codigo),
              vinculoId: vinculo?.id || '',
            }
          })

          reset({
            nfe: data.numeroNfe,
            chaveNfe: data.chaveAcesso,
            dataEmissao: new Date(data.dataEmissao),
            dataRecebimento: null as unknown as Date,
            valorTotalProdutos: data.valores.valorTotalProdutos,
            valorFrete: data.valores.valorFrete,
            valorSeguro: data.valores.valorSeguro,
            valorDesconto: data.valores.valorDesconto,
            valorTotalIpi: data.valores.valorTotalIpi,
            valorTotalNfe: data.valores.valorTotalNfe,
            valorOutros: data.valores.valorOutros,
            observacao: null,
            fornecedoraId: fornecedora?.id || '',
            transportadoraId: transportadora?.id || '',
            armazemId: '',
            addEstoque: true,
            itens: itensComVinculos,
          })
        } catch (error) {
          console.error('Erro ao processar importação XML:', error)
        }
      }

      processXmlImport()
    }
  }, [
    form,
    orgSlug,
    fornecedora?.id,
    transportadora?.id,
    queryClient,
    reset,
    getCachedVinculo,
  ])

  useEffect(() => {
    if (form?.data && (form.type === 'UPDATE' || form.type === 'COPY')) {
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
        addEstoque: data.addEstoque,
        armazemId: data.armazem ? data.armazem.id : null,
        itens: data.itens.map((item) => ({
          id: item.id,
          qtdeNf: Number(item.qtdeNf),
          valorUnitario: Number(item.valorUnitario),
          valorIpi: Number(item.valorIpi),
          unidadeNf: item.unidadeNf,
          descricaoFornecedora: item.descricaoFornecedora,
          codFornecedora: item.codFornecedora,
          vinculoId: item.vinculo.id,
        })),
      })
      return
    }

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
      addEstoque: true,
      itens: [],
    })
  }, [form, fornecedora?.id, reset, transportadora?.id])

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

  const handleAddItem = () => {
    prepend({
      id: null,
      qtdeNf: 0,
      unidadeNf: '' as unknown as Unidade,
      valorUnitario: 0,
      valorIpi: 0,
      descricaoFornecedora: '',
      vinculoId: '',
      codFornecedora: uuidv4(),
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleOpenVinculoModal = (index: number) => {
    setSelectedItemIndex(index)

    // Coletar dados para initialData
    const cod = getValues(`itens.${index}.codFornecedora`)
    const fornecedoraId = getValues('fornecedoraId')

    // Coletar vinculo existente (se houver)
    const vinculoId = getValues(`itens.${index}.vinculoId`)
    const vinculo = vinculoId ? getCachedVinculo(cod) : undefined

    setInitialData({ cod, fornecedoraId })
    setSelectedVinculo(vinculo)
    setVinculoModalOpen(true)
  }

  const handleVinculoSuccess = (vinculo: CreateOrUpdateVinculoResponse) => {
    if (selectedItemIndex !== null) {
      // Atualizar campo no formulário
      setValue(`itens.${selectedItemIndex}.vinculoId`, vinculo.id)

      // Atualizar cache do React Query
      queryClient.setQueryData(['vinculos', orgSlug, vinculo.cod], vinculo)
    }
    setVinculoModalOpen(false)
  }

  const handleFornecedoraSuccess = ({
    fornecedoraId,
  }: CreateFornecedoraResponse) => {
    setValue('fornecedoraId', fornecedoraId)
    setFornecedoraModalOpen(false)
  }

  const handleTransportadoraSuccess = ({
    transportadoraId,
  }: CreateTransportadoraResponse) => {
    setValue('transportadoraId', transportadoraId)
    setTransportadoraModalOpen(false)
  }

  const renderModals = () => (
    <>
      <VinculoModal
        open={vinculoModalOpen}
        onClose={() => setVinculoModalOpen(false)}
        onSuccess={handleVinculoSuccess}
        initialData={initialData}
        vinculo={selectedVinculo}
      />
      <FornecedoraModal
        open={fornecedoraModalOpen}
        onClose={() => setFornecedoraModalOpen(false)}
        formType="CREATE"
        initialData={initialFornecedoraData}
        onSuccess={handleFornecedoraSuccess}
      />

      <TransportadoraModal
        open={transportadoraModalOpen}
        onClose={() => setTransportadoraModalOpen(false)}
        formType="CREATE"
        initialData={initialTransportadoraData}
        onSuccess={handleTransportadoraSuccess}
      />
    </>
  )
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
              py: 1.5,
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
            <Grid2 container spacing={1.5} alignItems="center">
              <Grid2 size={3}>
                <Controller
                  name={`itens.${index}.descricaoFornecedora`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descrição Fornecedora"
                      error={!!errors.itens?.[index]?.descricaoFornecedora}
                      helperText={
                        errors.itens?.[index]?.descricaoFornecedora?.message
                      }
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={1.7}>
                <VinculoButton
                  index={index}
                  control={control}
                  onOpenModal={handleOpenVinculoModal}
                />
              </Grid2>

              <Grid2 size={1.5}>
                <Controller
                  name={`itens.${index}.qtdeNf`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Quantidade"
                      error={!!errors.itens?.[index]?.qtdeNf}
                      helperText={errors.itens?.[index]?.qtdeNf?.message}
                      fullWidth
                      size="small"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={1.7}>
                <Controller
                  name={`itens.${index}.unidadeNf`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Unidade"
                      error={!!errors.itens?.[index]?.unidadeNf}
                      helperText={errors.itens?.[index]?.unidadeNf?.message}
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

              <Grid2 size={1.7}>
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

              <Grid2 size={1.7}>
                <Controller
                  name={`itens.${index}.valorIpi`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Valor IPI"
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
                size={0.7}
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <IconButton
                  onClick={() => remove(index)}
                  color="error"
                  size="small"
                  sx={{
                    transform: 'scale(0.9)',
                    '&:hover': { transform: 'scale(1)' },
                  }}
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
    <>
      {renderModals()}
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
                name="addEstoque"
                control={control}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormControl
                    error={!!errors.addEstoque}
                    fullWidth
                    sx={{ alignItems: 'end' }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => {
                            onChange(e.target.checked)
                            setValue('armazemId', e.target.checked ? '' : null)
                          }}
                          {...fieldProps}
                        />
                      }
                      label="Adicionar ao estoque"
                    />
                    <FormHelperText>
                      {errors.addEstoque?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid2>

            <Grid2 size={3}>
              <Controller
                name="armazemId"
                control={control}
                render={({ field }) => (
                  <ArmazemAutoComplete
                    field={field}
                    error={errors.armazemId}
                    disabled={!addEstoque}
                  />
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
              <Stack spacing={1} direction="row">
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
                <Tooltip title="Adicionar fornecedora">
                  <IconButton onClick={() => setFornecedoraModalOpen(true)}>
                    <IconLibraryPlus />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid2>

            <Grid2 size={2.4}>
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

            <Grid2 size={2.4}>
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

            <Grid2 size={2.4}>
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

            <Grid2 size={2.4}>
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

            <Grid2 size={2.4}>
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

            <Grid2 size={8}>
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
              <Stack spacing={1} direction="row">
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
                <Tooltip title="Adicionar transportadora">
                  <IconButton onClick={() => setTransportadoraModalOpen(true)}>
                    <IconLibraryPlus />
                  </IconButton>
                </Tooltip>
              </Stack>
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
    </>
  )
}
