import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useSetorQueries } from '../../../hooks/queries/useSetorQueries'

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

export const SetorAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllSetores } = useSetorQueries()
  const { data: setores = [], isLoading } = useGetAllSetores(orgSlug!)

  const selectedSetor =
    setores.find((setor) => setor.id === field.value) || null

  return (
    <Autocomplete
      value={selectedSetor}
      id="categoria-select"
      options={setores}
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
          label="Setor"
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
