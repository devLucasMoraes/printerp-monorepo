import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useTransportadoraQueries } from '../../../hooks/queries/useTransportadoraQueries'

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

export const TransportadoraAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllTransportadoraes } = useTransportadoraQueries()
  const { data: transportadoras = [], isLoading } = useGetAllTransportadoraes(
    orgSlug!,
  )

  const selectedTransportadora =
    transportadoras.find((setor) => setor.id === field.value) || null

  return (
    <Autocomplete
      value={selectedTransportadora}
      options={transportadoras}
      getOptionLabel={(option) => option.nomeFantasia}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_, newValue) => {
        field.onChange(newValue ? newValue.id : null)
      }}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          helperText={error?.message}
          onBlur={field.onBlur}
          label="Transportadora"
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
