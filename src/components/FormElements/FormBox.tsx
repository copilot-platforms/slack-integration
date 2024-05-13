'use client'

import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface FormProps {
  children: ReactNode
}

export const FormBox = ({ children }: FormProps) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        p: '24px',
        border: `1px solid ${theme.color.gray[200]}`,
        borderRadius: '4px',
        my: '24px',
      })}
    >
      {children}
    </Box>
  )
}
