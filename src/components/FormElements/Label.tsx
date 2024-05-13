import { FormLabel, Typography } from '@mui/material'

interface LabelProps {
  children: string
}

export const Label = ({ children }: LabelProps) => {
  return (
    <FormLabel>
      <Typography variant="md" sx={{ mb: '4px', display: 'block' }}>
        {children}
      </Typography>
    </FormLabel>
  )
}
