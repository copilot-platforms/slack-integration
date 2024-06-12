import { Typography } from '@mui/material'

interface SelecterErrorMessageProps {
  children: string
}

export const SelecterErrorMessage = ({ children }: SelecterErrorMessageProps) => (
  <Typography variant="sm" sx={{ display: 'block', color: 'rgb(211, 47, 47)', mt: '8px', mb: '4px', fontWeight: 400 }}>
    {children}
  </Typography>
)
