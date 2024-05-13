'use client'

import { Typography } from '@mui/material'

interface SubHeadingProps {
  children: string
}

export const SubHeading = ({ children }: SubHeadingProps) => {
  return (
    <Typography variant="md" display={'block'} sx={(theme) => ({ color: theme.color.gray[500] })}>
      {children}
    </Typography>
  )
}
