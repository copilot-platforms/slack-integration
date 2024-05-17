import { FormLabel, Typography, Box } from '@mui/material'

interface LabelProps {
  children: string
}

export const Label = ({ children }: LabelProps) => {
  return (
    <Box mb="4px">
      <FormLabel>
        <Typography variant="bodyMd">{children}</Typography>
      </FormLabel>
    </Box>
  )
}
