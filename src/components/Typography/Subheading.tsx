'use client'

import { Typography, styled, Box } from '@mui/material'

interface SubHeadingProps {
  pb?: string
  children: string
}

export const StyledSubheading = styled(Typography)(({ theme }) => ({
  color: theme.color.gray[500],
}))

export const SubHeading = ({ children }: SubHeadingProps) => {
  return (
    <Box>
      <StyledSubheading variant="bodyLg">{children}</StyledSubheading>
    </Box>
  )
}
