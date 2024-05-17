'use client'

import { Button, Typography } from '@mui/material'

interface PrimaryBtnProps {
  type?: 'button' | 'reset' | 'submit'
  handleClick?: () => void
  disabled?: boolean
  children?: string
}

export const PrimaryBtn = ({ type, handleClick, disabled = false, children }: PrimaryBtnProps) => {
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
      disabled={disabled}
    >
      <Typography variant="sm">{children}</Typography>
    </Button>
  )
}
