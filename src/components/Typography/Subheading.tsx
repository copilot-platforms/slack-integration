'use client'

import { Typography, styled } from '@mui/material'

interface SubHeadingProps {
  pb?: string
  children: string
}

export const SubHeading = ({ pb, children }: SubHeadingProps) => {
  return (
    <Typography variant="lg" display={'block'} sx={(theme) => ({ color: theme.color.gray[500], fontWeight: 400, pb })}>
      {children}
    </Typography>
  )
}
