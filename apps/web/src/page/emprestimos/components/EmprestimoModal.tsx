import { zodResolver } from '@hookform/resolvers/zod'
import {
  Badge,
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
import {
  IconCircleArrowDownFilled,
  IconCircleMinus,
  IconPlus,
} from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form'
import { useParams } from 'react-router'

import { ArmazemAutoComplete } from '../../../components/shared/autocompletes/ArmazemAutoComplete'
import { InsumoAutoComplete } from '../../../components/shared/autocompletes/InsumoAutoComplete'
import { ParceiroAutoComplete } from '../../../components/shared/autocompletes/ParceiroAutoComplete'
import { unidades } from '../../../constants'
import type { Unidade } from '../../../constants/Unidade'
import { useEmprestimoQueries } from '../../../hooks/queries/useEmprestimosQueries'
import { useInsumoQueries } from '../../../hooks/queries/useInsumoQueries'
import { createEmprestimoSchema } from '../../../http/emprestimo/create-emprestimo'
import type { ListEmprestimosResponse } from '../../../http/emprestimo/list-emprestimos'
import type { UpdateEmprestimoDTO } from '../../../http/emprestimo/update-emprestimo'
import { updateEmprestimoSchema } from '../../../http/emprestimo/update-emprestimo'
import { useAlertStore } from '../../../stores/alert-store'
import { DevolucaoModal } from './DevolucaoModal'

export const EmprestimoModal = ({
  open,
  onClose,
  form,
}: {
  open: boolean
  onClose: () => void
  form:
    | {
        data: ListEmprestimosResponse
        type: 'UPDATE' | 'COPY' | 'CREATE' | 'DELETE'
      }
    | undefined
}) => {
  const [devolucaoModalOpen, setDevolucaoModalOpen] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1)

  const { enqueueSnackbar } = useAlertStore((state) => state)

  const { orgSlug } = useParams()

  const { useGetAll: useGetAllInsumos } = useInsumoQueries()
  const { data: insumos = [] } = useGetAllInsumos(orgSlug!)

  const schema =
    form?.data && form.type === 'UPDATE'
      ? updateEmprestimoSchema
      : createEmprestimoSchema

  const { useCreate: useCreateEmprestimo, useUpdate: useUpdateEmprestimo } =
    useEmprestimoQueries()

  const methods = useForm<UpdateEmprestimoDTO>({
    resolver: zodResolver(schema),
    defaultValues: {
      dataEmprestimo: '' as unknown as Date,
      previsaoDevolucao: null,
      custoEstimado: 0,
      tipo: '' as unknown as 'ENTRADA' | 'SAIDA',
      status: 'EM_ABERTO',
      parceiroId: '',
      armazemId: '',
      obs: null,
      itens: [],
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = methods

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

    setValue('custoEstimado', Number(total.toFixed(2)))
  }, [items, setValue])

  useEffect(() => {
    if (!form?.data) {
      reset({
        dataEmprestimo: '' as unknown as Date,
        previsaoDevolucao: null,
        custoEstimado: 0,
        tipo: '' as unknown as 'ENTRADA' | 'SAIDA',
        status: 'EM_ABERTO',
        parceiroId: '',
        armazemId: '',
        obs: null,
        itens: [],
      })
      return
    }

    const { data } = form

    reset({
      dataEmprestimo: new Date(data.dataEmprestimo),
      previsaoDevolucao: data.previsaoDevolucao
        ? new Date(data.previsaoDevolucao)
        : null,
      custoEstimado: Number(data.custoEstimado),
      tipo: data.tipo,
      status: data.status,
      parceiroId: data.parceiro.id,
      armazemId: data.armazem.id,
      obs: data.obs,
      itens: data.itens.map((item) => ({
        id: item.id,
        insumoId: item.insumo.id,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        unidade: item.unidade,
        devolucaoItens: item.devolucaoItens.map((devolucaoItem) => ({
          id: devolucaoItem.id,
          insumoId: devolucaoItem.insumo.id,
          quantidade: Number(devolucaoItem.quantidade),
          valorUnitario: Number(devolucaoItem.valorUnitario),
          unidade: devolucaoItem.unidade,
          dataDevolucao: new Date(devolucaoItem.dataDevolucao),
        })),
      })),
    })
  }, [form, reset])

  const { mutate: createEmprestimo } = useCreateEmprestimo()
  const { mutate: updateEmprestimo } = useUpdateEmprestimo()

  const onSubmit = (data: UpdateEmprestimoDTO) => {
    if (!orgSlug) {
      enqueueSnackbar('Selecione uma organização', { variant: 'error' })
      return
    }
    if (form?.data && form?.type === 'UPDATE') {
      updateEmprestimo(
        {
          id: form.data.id,
          orgSlug,
          data,
        },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Emprestimo atualizado com sucesso', {
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

    if (form?.type === 'CREATE') {
      createEmprestimo(
        { orgSlug, data },
        {
          onSuccess: () => {
            onClose()
            reset()
            enqueueSnackbar('Emprestimo criado com sucesso', {
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
      devolucaoItens: [],
    })
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleOpenDevolucaoModal = (index: number) => {
    setSelectedItemIndex(index)
    setDevolucaoModalOpen(true)
  }

  const renderModals = () => (
    <>
      {selectedItemIndex >= 0 && (
        <DevolucaoModal
          open={devolucaoModalOpen}
          onClose={() => {
            setDevolucaoModalOpen(false)
            setSelectedItemIndex(-1)
          }}
          itemIndex={selectedItemIndex}
        />
      )}
    </>
  )

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={handleClose}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        fullWidth
        maxWidth="xl"
        disableRestoreFocus
      >
        <DialogTitle>{form?.type === 'UPDATE' ? 'Editar' : 'Novo'}</DialogTitle>
        <DialogContent>
          {renderModals()}
          <DialogContentText>
            {form?.type === 'UPDATE'
              ? 'Atualize os dados do emprestimo'
              : 'Crie um novo emprestimo'}
          </DialogContentText>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={3}>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tipo"
                    error={!!errors.tipo}
                    helperText={errors.tipo?.message}
                    fullWidth
                    select
                  >
                    <MenuItem value="ENTRADA">Entrada</MenuItem>
                    <MenuItem value="SAIDA">Saida</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={3}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                    disabled
                  />
                )}
              />
            </Grid>

            <Grid size={3}>
              <Controller
                name="previsaoDevolucao"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Previsão de devolução"
                    slotProps={{
                      textField: {
                        error: !!errors.previsaoDevolucao,
                        helperText: errors.previsaoDevolucao?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={3}>
              <Controller
                name="dataEmprestimo"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Emprestado em"
                    slotProps={{
                      textField: {
                        error: !!errors.dataEmprestimo,
                        helperText: errors.dataEmprestimo?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={4}>
              <Controller
                name="custoEstimado"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Custo estimado"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">R$</InputAdornment>
                        ),
                      },
                    }}
                    disabled
                    error={!!errors.custoEstimado}
                    helperText={errors.custoEstimado?.message}
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

            <Grid size={4}>
              <Controller
                name="parceiroId"
                control={control}
                render={({ field }) => (
                  <ParceiroAutoComplete
                    field={field}
                    error={errors.parceiroId}
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

                {fields.length === 0 ? (
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
                ) : (
                  <Box>
                    {fields.map((field, index) => {
                      return (
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
                                    helperText={
                                      errors.itens?.[index]?.quantidade?.message
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid size={2}>
                              <Controller
                                name={`itens.${index}.unidade`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label="Unidade"
                                    error={!!errors.itens?.[index]?.unidade}
                                    helperText={
                                      errors.itens?.[index]?.unidade?.message
                                    }
                                    value={field.value || ''}
                                    fullWidth
                                    select
                                    size="small"
                                  >
                                    {unidades.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
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
                                    error={
                                      !!errors.itens?.[index]?.valorUnitario
                                    }
                                    helperText={
                                      errors.itens?.[index]?.valorUnitario
                                        ?.message
                                    }
                                    disabled
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                      input: {
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            R$
                                          </InputAdornment>
                                        ),
                                      },
                                    }}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                )}
                              />
                            </Grid>

                            <Grid
                              size={2}
                              container
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-end"
                            >
                              <Badge
                                badgeContent={
                                  watch(`itens.${index}.devolucaoItens`)
                                    ?.length || 0
                                }
                                color="primary"
                              >
                                <IconButton
                                  onClick={() =>
                                    handleOpenDevolucaoModal(index)
                                  }
                                  size="small"
                                >
                                  <IconCircleArrowDownFilled />
                                </IconButton>
                              </Badge>
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
                      )
                    })}
                  </Box>
                )}
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
    </FormProvider>
  )
}
