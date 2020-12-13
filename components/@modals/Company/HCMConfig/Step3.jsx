import React from 'react'
import { Button, Dropdown, Icon, Input } from '@components'

const Step3 = ({ onInput, onNext }) => {
  const handleNext = () => {
    onNext(4)
  }

  const handlePrev = () => {
    onNext(2)
  }

  return (
    <div className="section">
      <div className="section-header">
        <p className="dsl-b16 bold">Library</p>
        <p className="dsl-d14 description">Define the authors for the company.</p>
      </div>

      <div className="my-4">
        <div className="d-flex mb-2">
          <span className="dsl-b16">Global Authors</span>
          <Icon name="fas fa-plus-circle ml-3" color="#C5D4E6" size={16} />
        </div>

        <Dropdown title="Global Author" width="fit-content" placeholder="Select" onChange={onInput} />
      </div>

      <div className="py-3">
        <div className="d-flex mb-2">
          <span className="dsl-b16">Company Authors</span>
          <Icon name="fas fa-plus-circle ml-3" color="#C5D4E6" size={16} />
        </div>
        <Input title="Company Author" placeholder="Type here..." onChange={onInput} />
      </div>

      <div className="d-flex mt-3">
        <Button className="ml-auto mr-2" type="low" size="small" onClick={handlePrev}>
          <Icon name="fal fa-arrow-left mr-2" size={10} color="#376caf" />
          Previous
        </Button>
        <Button name="SAVE & NEXT" onClick={handleNext} />
      </div>
    </div>
  )
}

export default Step3
