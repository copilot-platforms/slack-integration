'use client'

import { TextField, styled } from '@mui/material'

export const StyledTextInput = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'padding',
})(({ theme }) => ({
  '& .MuiTextField-root': {
    width: '100%',
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px',
    width: '100%',
  },
  '& label.Mui-focused': {
    color: theme.color.base.black,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.color.borders.border,
    },
    '&:hover fieldset': {
      borderColor: theme.color.borders.border,
    },
    '&.Mui-focused fieldset': {
      border: `1px solid ${theme.color.base.black}`,
    },
  },
  input: {
    fontSize: '14px',
    '&::placeholder': {
      opacity: 1,
      color: theme.color.gray[500],
    },
  },
}))

interface TextInputProps {
  name: string
  defaultValue?: string
  placeholder?: string
  errorText?: string
  disabled?: boolean
}

export const TextInput = ({ name, defaultValue, placeholder, errorText, disabled = false }: TextInputProps) => {
  return (
    <StyledTextInput
      fullWidth
      name={name}
      placeholder={placeholder}
      error={!!errorText}
      helperText={errorText}
      disabled={disabled}
      defaultValue={defaultValue}
    />
  )
}
