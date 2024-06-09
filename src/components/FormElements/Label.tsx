import { FormLabel, Typography, Box } from '@mui/material'

interface LabelProps {
  htmlFor?: string
  children: string
}

export const Label = ({ htmlFor, children }: LabelProps) => {
  return (
    <Box mb="4px">
      <FormLabel htmlFor={htmlFor}>
        <Typography variant="bodyMd">{children}</Typography>
      </FormLabel>
    </Box>
  )
}
