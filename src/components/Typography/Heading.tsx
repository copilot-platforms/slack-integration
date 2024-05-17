import { Typography, Box } from '@mui/material'

interface HeadingProps {
  children: string
}

export const Heading = ({ children }: HeadingProps) => {
  return (
    <Box>
      <Typography variant="xl">{children}</Typography>
    </Box>
  )
}
