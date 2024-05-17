'use client'

import { Button, Typography } from '@mui/material'

export const PrimaryBtn = ({ handleClick, children }: { handleClick?: () => void; children?: string }) => {
  return (
    <Button
      variant="contained"
      sx={(theme) => ({
        textTransform: 'none',
        bgcolor: theme.color.gray[600],
        '&:hover': { backgroundColor: theme.color.gray[600] },
      })}
      onClick={handleClick}
    >
      <Typography variant="sm">{children}</Typography>
    </Button>
  )
}
