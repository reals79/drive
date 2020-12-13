import React, { memo } from 'react'
import { Icon } from '@components'

const AssignHeader = ({ title }) => (
  <>
    <Icon name="fal fa-plus-circle mr-2" size={14} color="white" />
    <span className="dsl-w14 modal-title">{title}</span>
  </>
)

export default memo(AssignHeader)
