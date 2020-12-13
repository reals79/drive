import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@components'
import Parent from './AddOwner'
import Add from './Add'
import Assign from './Assign'
import './AddOwner.scss'

const AddOwner = () => {
  const [step, setStep] = useState(0)
  const handleAssign = e => {
    setStep(0)
  }
  return (
    <div className="add-owner-modal">
      {step === 0 && <Parent onAdd={() => setStep(1)} onAssign={() => setStep(2)} onCancel={() => setStep(0)} />}
      {step === 1 && <Add onCancel={() => setStep(0)} />}
      {step === 2 && <Assign onAdd={handleAssign} />}
    </div>
  )
}

AddOwner.propTypes = {}

AddOwner.defaultProps = {}

export default memo(AddOwner)
