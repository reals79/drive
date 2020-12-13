import React, { useState } from 'react'
import { StepBar } from '@components'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import './GobalAuthorConfiguration.scss'

const GobalAuthorConfiguration = ({ onClose }) => {
  const [current, setCurrent] = useState(0)

  const renderSteps = () => {
    switch (current) {
      case 0:
        return <StepOne onClose={onClose} />
      case 1:
        return <StepTwo />
    }
  }

  return (
    <div className="global-author-configuration-modal">
      <div className="modal-header">
        <span className="dsl-w14">Global Author Configuration</span>
      </div>
      <div className="modal-body">
        <StepBar className="py-3 pr-4" step={current + 1} maxSteps={2} />
        {renderSteps()}
      </div>
    </div>
  )
}

export default GobalAuthorConfiguration
