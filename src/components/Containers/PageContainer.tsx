import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return <Box sx={{ px: { xs: '8%', sm: '17.5%' }, py: '64px' }}>{children}</Box>
}
