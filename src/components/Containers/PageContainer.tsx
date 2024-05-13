import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <Box
      sx={{
        px: '12.5%',
        py: '64px',
      }}
    >
      {children}
    </Box>
  )
}
