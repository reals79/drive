import React, { useState } from 'react'
import { Button, CheckBox, Input } from '@components'

const FEATURE_LIST = [
  'Training and Development',
  'Tasks and Projects',
  'Performance Reviews',
  'Reports and Records',
  'Certification Programs',
  'Career Programs',
  'Documents',
  'eSignatures',
  'Questionnaires',
]

const Step1 = ({ onNext }) => {
  const [maxEmployee, setMaxEmployee] = useState(0)

  const handleNextClick = () => {
    onNext(2)
  }

  return (
    <div>
      <h5 className="dsl-b16 bold my-3">Licences</h5>
      <div className="max-employ-form">
        <Input
          title="Max active employees:"
          type="number"
          value={maxEmployee}
          onChange={setMaxEmployee}
        />
      </div>

      <h5 className="dsl-b16 bold my-3">Features</h5>
      <div className="dsl-b14">
        {FEATURE_LIST.map(item => (
          <CheckBox size="tiny" key={item} title={item} className="mb-3" />
        ))}
      </div>

      <div className="d-flex mt-3 justify-content-end">
        <Button name="NEXT" onClick={handleNextClick} />
      </div>
    </div>
  )
}

export default Step1
