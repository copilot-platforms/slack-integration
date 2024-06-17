'use client'

import { useEffect } from 'react'

export const SuccessMessage = () => {
  useEffect(() => {
    setTimeout(window.close, 2000)
  }, [])
  return <div>Bot has been successfully installed to the workspace. This tab is now closing...</div>
}
