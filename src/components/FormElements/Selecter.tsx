'use client'

import { MenuItem, Select, SelectChangeEvent, Typography, styled } from '@mui/material'
import DropdownIcon from '@/components/Icons/DropdownArrow'
import { SelecterOption } from '@/types/settings'
import { SelecterErrorMessage } from '@/components/FormElements/SelecterErrorMessage'

const StyledSelecter = styled(Select)(({ theme }) => ({
  display: 'block',
  '& .MuiSelect-select': {
    padding: '8px 12px',
  },
  '& .Mui-focused': {
    border: `1px solid ${theme.color.borders.border}`,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.color.borders.border, // Set the border color to blue
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.color.borders.borderHover,
    borderWidth: '1px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.color.borders.borderHover,
  },
}))

interface SelecterProps {
  name: string
  value: string
  options: SelecterOption[]
  handleChange?: (e: SelectChangeEvent<unknown>) => void
  disabled?: boolean
  errorText?: string
}

export const Selecter = ({ name, value, options, handleChange, errorText, disabled = false }: SelecterProps) => {
  return (
    <>
      <StyledSelecter value={value} IconComponent={DropdownIcon} name={name} disabled={disabled} onChange={handleChange}>
        {options.map(({ label, value }) => (
          <MenuItem value={value} key={label}>
            <Typography variant="bodyMd">{label}</Typography>
          </MenuItem>
        ))}
      </StyledSelecter>
      {errorText && <SelecterErrorMessage>{errorText}</SelecterErrorMessage>}
    </>
  )
}
