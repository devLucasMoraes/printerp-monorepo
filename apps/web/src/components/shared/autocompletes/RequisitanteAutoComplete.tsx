import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useRequisitanteQueries } from '../../../hooks/queries/useRequisitanteQueries'

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

export const RequisitanteAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllRequisitantes } = useRequisitanteQueries()
  const { data: requisitantes = [], isLoading } = useGetAllRequisitantes(
    orgSlug!,
  )

  const selectedRequisitante =
    requisitantes.find((requisitante) => requisitante.id === field.value) ||
    null

  return (
    <Autocomplete
      value={selectedRequisitante}
      id="categoria-select"
      options={requisitantes}
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
          label="Requisitante"
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
