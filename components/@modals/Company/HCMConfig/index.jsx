import React, { useState } from 'react'
import { StepBar } from '@components'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import './HCMConfig.scss'

const HCMConfig = props => {
  const [current, setCurrent] = useState(1)

  const renderSteps = () => {
    switch (current) {
      case 1:
        return <Step1 onNext={setCurrent} />
      case 2:
        return <Step2 onNext={setCurrent} />
      case 3:
        return <Step3 onNext={setCurrent} />
      case 4:
        return <Step4 onNext={setCurrent} />
    }
  }

  return (
    <div className="hcm-configuration">
      <div className="modal-header text-center bg-primary text-white">HCM Configuration</div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={4} className="mb-3" />
        {renderSteps()}
      </div>
    </div>
  )
}

export default HCMConfig
