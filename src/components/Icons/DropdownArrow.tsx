import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

function DropdownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <path
        d="M7.99939 10.9657C7.88049 10.9657 7.76157 10.9206 7.67115 10.8295L3.33609 6.49396C3.15463 6.31248 3.15463 6.01826 3.33609 5.83679C3.51754 5.65532 3.81173 5.65532 3.99318 5.83679L8 9.84406L12.0068 5.83679C12.1883 5.65532 12.4825 5.65532 12.6639 5.83679C12.8454 6.01826 12.8454 6.31248 12.6639 6.49396L8.32885 10.8295C8.23719 10.9206 8.1183 10.9657 7.99939 10.9657Z"
        fill="#212B36"
      />
    </SvgIcon>
  )
}

export default DropdownIcon
