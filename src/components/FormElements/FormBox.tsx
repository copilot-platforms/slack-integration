'use client'

import { Stack } from '@mui/material'
import { ReactNode } from 'react'

interface FormProps {
  gap?: string
  children: ReactNode
}

export const FormBox = ({ gap, children }: FormProps) => {
  return (
    <Stack
      spacing={'24px'}
      sx={(theme) => ({
        p: '24px',
        border: `1px solid ${theme.color.gray[200]}`,
        borderRadius: '4px',
        my: '24px',
      })}
    >
      {children}
    </Stack>
  )
}
