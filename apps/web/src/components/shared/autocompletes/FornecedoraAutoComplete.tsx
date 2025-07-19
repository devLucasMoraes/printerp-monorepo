import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useFornecedoraQueries } from '../../../hooks/queries/useFornecedoraQueries'

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

export const FornecedoraAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllFornecedoraes } = useFornecedoraQueries()
  const { data: fornecedoras = [], isLoading } = useGetAllFornecedoraes(
    orgSlug!,
  )

  const selectedFornecedora =
    fornecedoras.find((setor) => setor.id === field.value) || null

  return (
    <Autocomplete
      value={selectedFornecedora}
      options={fornecedoras}
      getOptionLabel={(option) => option.nomeFantasia}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      fullWidth
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.id : null)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          onBlur={field.onBlur}
          label="Fornecedora"
          fullWidth
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
