import { Typography } from '@mui/material'

interface HeadingProps {
  children: string
}

export const Heading = ({ children }: HeadingProps) => {
  return (
    <Typography variant="xl" sx={{ display: 'block' }}>
      {children}
    </Typography>
  )
}
