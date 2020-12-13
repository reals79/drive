import React, { useState } from 'react'
import { StepBar } from '@components'
import Step1 from './Step1'
import Step2 from './Step2'

const HCMConfig = props => {
  const [current, setCurrent] = useState(1)

  const renderSteps = () => {
    switch (current) {
      case 1:
        return <Step1 onNext={setCurrent} />
      case 2:
        return <Step2 onNext={setCurrent} />
    }
  }

  return (
    <div className="blog-configuration">
      <div className="modal-header text-center bg-primary text-white">Blog Configuration</div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={2} className="mb-3" />
        {renderSteps()}
      </div>
    </div>
  )
}

export default HCMConfig
