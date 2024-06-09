'use client'

import { Button, CircularProgress, Typography } from '@mui/material'

interface PrimaryBtnProps {
  type?: 'button' | 'reset' | 'submit'
  handleClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  children?: string
}

export const PrimaryBtn = ({ type, handleClick, isLoading, disabled = false, children }: PrimaryBtnProps) => {
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
      {isLoading && <CircularProgress size={12} color="inherit" sx={{ marginRight: '0.5em' }} />}
      <Typography variant="sm">{children}</Typography>
    </Button>
  )
}
