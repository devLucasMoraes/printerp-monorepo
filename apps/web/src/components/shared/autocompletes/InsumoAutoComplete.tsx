import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useInsumoQueries } from '../../../hooks/queries/useInsumoQueries'

type FieldProps = {
  size?: 'small' | 'medium'
  field: {
    value: string | null
    onChange: (value: string | null) => void
    onBlur: () => void
    name: string
  }
  error?: {
    message?: string
  }
}

export const InsumoAutoComplete = ({
  field,
  error,
  size = 'medium',
}: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllInsumos } = useInsumoQueries()
  const { data: insumos = [], isLoading } = useGetAllInsumos(orgSlug!)

  const selectedInsumo =
    insumos.find((insumo) => insumo.id === field.value) || null

  return (
    <Autocomplete
      value={selectedInsumo}
      id="insumo-select"
      options={insumos}
      getOptionLabel={(option) => option.descricao}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.id : null)
      }}
      size={size}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          label="Insumo"
          autoFocus
          onBlur={field.onBlur}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  )
}
