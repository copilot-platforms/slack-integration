'use client'

import { MenuItem, Select, SelectChangeEvent, Typography, styled } from '@mui/material'
import DropdownIcon from '@/components/Icons/DropdownArrow'
import { SelecterOption } from '@/types/settings'

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
  defaultValue: string
  options: SelecterOption[]
  handleChange?: (e: SelectChangeEvent<unknown>) => void
  disabled?: boolean
}

export const Selecter = ({ name, defaultValue, options, handleChange, disabled = false }: SelecterProps) => {
  return (
    <StyledSelecter
      defaultValue={defaultValue}
      IconComponent={DropdownIcon}
      name={name}
      disabled={disabled}
      onChange={handleChange}
    >
      {options.map(({ label, value }) => (
        <MenuItem value={value} key={label}>
          <Typography variant="md" fontWeight={400}>
            {label}
          </Typography>
        </MenuItem>
      ))}
    </StyledSelecter>
  )
}
