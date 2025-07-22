import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useCallback } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useParams } from 'react-router'

import { InsumoAutoComplete } from '../../../components/shared/autocompletes/InsumoAutoComplete'
import { unidades } from '../../../constants'
import type { Unidade } from '../../../constants/Unidade'
import { useInsumoQueries } from '../../../hooks/queries/useInsumoQueries'
import type { UpdateEmprestimoDTO } from '../../../http/emprestimo/update-emprestimo'

export const DevolucaoModal = ({
  open,
  onClose,
  itemIndex,
}: {
  open: boolean
  onClose: () => void
  itemIndex: number
}) => {
  const { orgSlug } = useParams()

  const { useGetAll: useGetAllInsumos } = useInsumoQueries()
  const { data: insumos = [] } = useGetAllInsumos(orgSlug!)

  const { control, setValue } = useFormContext<UpdateEmprestimoDTO>()

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: `itens.${itemIndex}.devolucaoItens`,
  })

  const handleAddItem = () => {
    prepend({
      id: null,
      quantidade: 0,
      unidade: '' as unknown as Unidade,
      valorUnitario: 0,
      insumoId: '',
      dataDevolucao: '' as unknown as Date,
    })
  }

  const handleInsumoChange = useCallback(
    (index: number, insumoId?: string | null) => {
      const insumo = insumos.find((insumo) => insumo.id === insumoId)
      if (!insumo) return

      setValue(
        `itens.${itemIndex}.devolucaoItens.${index}.valorUnitario`,
        Number(insumo.valorUntMed),
      )
      setValue(
        `itens.${itemIndex}.devolucaoItens.${index}.unidade`,
        insumo.undEstoque,
      )
    },
    [insumos, itemIndex, setValue],
  )

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      fullWidth
      maxWidth="xl"
      disableRestoreFocus
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle>Registros de Devoluções</DialogTitle>

        {fields.length === 0 ? null : (
          <Button
            startIcon={<IconPlus size={18} />}
            onClick={handleAddItem}
            variant="outlined"
            size="medium"
            sx={{ mr: 1 }}
          >
            adicionar item
          </Button>
        )}
      </Stack>
      <DialogContent>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <Box>
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
                        <Grid2 container spacing={2}>
                          <Grid2 size={3}>
                            <Controller
                              name={`itens.${itemIndex}.devolucaoItens.${index}.insumoId`}
                              control={control}
                              render={({ field, formState: { errors } }) => (
                                <InsumoAutoComplete
                                  size="small"
                                  field={{
                                    ...field,
                                    onChange: (value) => {
                                      field.onChange(value)
                                      handleInsumoChange(index, value)
                                    },
                                  }}
                                  error={
                                    errors.itens?.[itemIndex]?.devolucaoItens?.[
                                      index
                                    ]?.insumoId
                                  }
                                />
                              )}
                            />
                          </Grid2>

                          <Grid2 size={2}>
                            <Controller
                              name={`itens.${itemIndex}.devolucaoItens.${index}.quantidade`}
                              control={control}
                              render={({ field, formState: { errors } }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  label="Quantidade"
                                  error={
                                    !!errors.itens?.[itemIndex]
                                      ?.devolucaoItens?.[index]?.quantidade
                                  }
                                  helperText={
                                    errors.itens?.[itemIndex]?.devolucaoItens?.[
                                      index
                                    ]?.quantidade?.message
                                  }
                                  fullWidth
                                  size="small"
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              )}
                            />
                          </Grid2>

                          <Grid2 size={2}>
                            <Controller
                              name={`itens.${itemIndex}.devolucaoItens.${index}.unidade`}
                              control={control}
                              render={({ field, formState: { errors } }) => (
                                <TextField
                                  {...field}
                                  label="Unidade"
                                  error={
                                    !!errors.itens?.[itemIndex]
                                      ?.devolucaoItens?.[index]?.unidade
                                  }
                                  helperText={
                                    errors.itens?.[itemIndex]?.devolucaoItens?.[
                                      index
                                    ]?.unidade?.message
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
                          </Grid2>

                          <Grid2 size={2}>
                            <Controller
                              name={`itens.${itemIndex}.devolucaoItens.${index}.valorUnitario`}
                              control={control}
                              render={({ field, formState: { errors } }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  label="Valor Unitário"
                                  error={
                                    !!errors.itens?.[itemIndex]
                                      ?.devolucaoItens?.[index]?.valorUnitario
                                  }
                                  helperText={
                                    errors.itens?.[itemIndex]?.devolucaoItens?.[
                                      index
                                    ]?.valorUnitario?.message
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
                          </Grid2>

                          <Grid2 size={2}>
                            <Controller
                              name={`itens.${itemIndex}.devolucaoItens.${index}.dataDevolucao`}
                              control={control}
                              render={({ field, formState: { errors } }) => (
                                <DatePicker
                                  {...field}
                                  label="Data"
                                  slotProps={{
                                    textField: {
                                      size: 'small',
                                      fullWidth: true,
                                      error:
                                        !!errors.itens?.[itemIndex]
                                          ?.devolucaoItens?.[index]
                                          ?.dataDevolucao,
                                      helperText:
                                        errors.itens?.[itemIndex]
                                          ?.devolucaoItens?.[index]
                                          ?.dataDevolucao?.message,
                                    },
                                  }}
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
                    )
                  })}
                </Box>
              )}
            </Box>
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancelar</Button>
        <Button variant="contained" onClick={() => onClose()}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
