import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { StepBar } from '@components'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import './HCMLicenses.scss'

const HCMLicenses = ({ onClose }) => {
  const md = useSelector(state => state.app.modalData)
  const level = md?.before?.level || 1

  const [current, setCurrent] = useState(level)

  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  const handleNext = () => {
    if (current === 4) return onClose()
    setCurrent(current + 1)
  }

  return (
    <div className="hcm-licenses-modal">
      <div className="modal-header">
        <span className="dsl-w16">HCM Configuration</span>
      </div>
      <div className="modal-body">
        <StepBar step={current} maxSteps={4} className="mb-3" />
        {current === 1 && <StepOne onNext={handleNext} />}
        {current === 2 && <StepTwo onNext={handleNext} onPrevious={handlePrevious} />}
        {current === 3 && <StepThree onNext={handleNext} onPrevious={handlePrevious} />}
        {current === 4 && <StepFour onNext={handleNext} onPrevious={handlePrevious} />}
      </div>
    </div>
  )
}

HCMLicenses.propTypes = {}

HCMLicenses.defaultProps = {}

export default memo(HCMLicenses)
