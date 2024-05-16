'use client'

import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface FormProps {
  gap?: string
  children: ReactNode
}

export const FormBox = ({ gap, children }: FormProps) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: gap || '24px',
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
