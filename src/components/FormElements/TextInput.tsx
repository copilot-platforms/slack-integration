'use client'

import { TextField, styled } from '@mui/material'
import { ChangeEvent } from 'react'

export const StyledTextInput = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'padding',
})(({ theme }) => ({
  '.Mui-error': {
    marginLeft: 0,
    marginTop: '4px',
  },
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
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const TextInput = ({
  name,
  defaultValue,
  placeholder,
  handleChange,
  errorText,
  disabled = false,
}: TextInputProps) => {
  return (
    <StyledTextInput
      fullWidth
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      error={!!errorText}
      helperText={errorText}
      disabled={disabled}
      defaultValue={defaultValue}
    />
  )
}
