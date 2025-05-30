import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useArmazemQueries } from '../../../hooks/queries/useArmazemQueries'

type FieldProps = {
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

export const ArmazemAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllArmazems } = useArmazemQueries()
  const { data: armazens = [], isLoading } = useGetAllArmazems(orgSlug!)

  const selectedArmazem =
    armazens.find((armazem) => armazem.id === field.value) || null

  return (
    <Autocomplete
      value={selectedArmazem}
      id="categoria-select"
      options={armazens}
      getOptionLabel={(option) => option.nome}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.id : null)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          onBlur={field.onBlur}
          label="Armazem"
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
