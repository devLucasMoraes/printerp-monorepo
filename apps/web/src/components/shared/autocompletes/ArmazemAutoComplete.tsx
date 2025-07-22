import type { AutocompleteProps } from '@mui/material'
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useArmazemQueries } from '../../../hooks/queries/useArmazemQueries'
import type { GetAllArmazensResponse } from '../../../http/armazem/get-all-armazens'

interface FieldProps {
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

// Estende as props do Autocomplete omitindo as props controladas internamente
export type ArmazemAutoCompleteProps = FieldProps &
  Omit<
    AutocompleteProps<GetAllArmazensResponse, false, false, false>,
    | 'value'
    | 'onChange'
    | 'options'
    | 'renderInput'
    | 'getOptionLabel'
    | 'isOptionEqualToValue'
  >

export const ArmazemAutoComplete = ({
  field,
  error,
  ...autocompleteProps
}: ArmazemAutoCompleteProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllArmazems } = useArmazemQueries()
  const { data: armazens = [], isLoading } = useGetAllArmazems(orgSlug!)

  const selectedArmazem =
    armazens.find((armazem) => armazem.id === field.value) || null

  return (
    <Autocomplete
      {...autocompleteProps}
      value={selectedArmazem}
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
          size="medium"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
