import React from 'react'
import { Icon } from '@components'

const CustomArrow = ({ className, style, onClick, name }) => (
  <div className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
    <Icon name={`fal fa-angle-${name}`} color="#c3c7cc" size={35} />
  </div>
)

export default CustomArrow
