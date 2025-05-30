import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { useParams } from 'react-router'

import { useCategoriaQueries } from '../../../hooks/queries/useCategoriaQueries'

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

export const CategoriaAutoComplete = ({ field, error }: FieldProps) => {
  const { orgSlug } = useParams()
  const { useGetAll: useGetAllCategorias } = useCategoriaQueries()
  const { data: categorias = [], isLoading } = useGetAllCategorias(orgSlug!)

  const selectedCategoria =
    categorias.find((categoria) => categoria.id === field.value) || null

  return (
    <Autocomplete
      value={selectedCategoria}
      id="categoria-select"
      options={categorias}
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
          label="Categoria"
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
