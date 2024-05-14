'use client'

import { MenuItem, Select, Typography, styled } from '@mui/material'
import DropdownIcon from '@/components/Icons/DropdownArrow'

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
  options: { label: string; value: string }[]
}

export const Selecter = ({ name, defaultValue, options }: SelecterProps) => {
  return (
    <StyledSelecter defaultValue={defaultValue} IconComponent={DropdownIcon} name={name}>
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
