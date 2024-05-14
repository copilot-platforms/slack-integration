'use client'

import { Button, Typography } from '@mui/material'

interface PrimaryBtnProps {
  type?: 'button' | 'reset' | 'submit'
  handleClick?: () => void
  children?: string
}

export const PrimaryBtn = ({ type, handleClick, children }: PrimaryBtnProps) => {
  return (
    <Button
      variant="contained"
      sx={(theme) => ({
        textTransform: 'none',
        bgcolor: theme.color.gray[600],
        '&:hover': { backgroundColor: theme.color.gray[600] },
      })}
      onClick={handleClick}
      type={type ?? 'button'}
    >
      <Typography variant="sm">{children}</Typography>
    </Button>
  )
}
