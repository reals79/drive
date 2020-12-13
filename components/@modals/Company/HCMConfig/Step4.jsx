import React, { useState } from 'react'
import { Button, Dropdown, Icon, Input } from '@components'

const Step4 = ({ onInput, onNext, onPrev }) => {
  const [employees, setEmployees] = useState([])

  return (
    <div className="hcm-employees mb-5">
      <p className="dsl-b22 bold">Employees</p>

      <div className="list-item mt-2 pb-2 px-2">
        <div className="d-flex-3">
          <span className="dsl-m12">Name</span>
        </div>
        <div className="d-flex-3">
          <span className="dsl-m12">Last Name</span>
        </div>
        <div className="d-flex-4">
          <span className="dsl-m12">Email</span>
        </div>
        <div className="d-flex-3">
          <span className="dsl-m12">Department</span>
        </div>
        <div className="d-flex-3">
          <span className="dsl-m12">Team</span>
        </div>
        <div className="d-flex-3">
          <span className="dsl-m12">Job Role</span>
        </div>
        <div className="d-flex-1" />
      </div>
      {!employees.length && (
        <div className="hcm-employees-none d-flex dsl-m14 align-items-center justify-content-center">
          No employees added yet.
        </div>
      )}

      <div className="d-flex mt-5 mb-2">
        <div className="d-flex-1">
          <Input title="First Name" placeholder="Type here..." onChange={onInput} />
          <Input title="Last Name" placeholder="Type here..." onChange={onInput} />
          <Input title="Email" placeholder="Type here..." onChange={onInput} />
        </div>
        <div className="d-flex-1 ml-5">
          <Dropdown title="Department" width="fit-content" placeholder="Select" onChange={onInput} />
          <Dropdown title="Team" width="fit-content" placeholder="Select" onChange={onInput} />
          <Dropdown title="Job role" width="fit-content" placeholder="Select" onChange={onInput} />
        </div>
      </div>

      <div className="d-flex mt-3">
        <Button className="submit-btn ml-auto" type="middle" size="small" onClick={onPrev}>
          Submit
        </Button>
      </div>

      <div className="d-flex mt-3">
        <Button className="ml-auto" type="low" size="small" onClick={onPrev}>
          <Icon name="fal fa-arrow-left mr-2" size={10} color="#376caf" />
          Previous
        </Button>
        <Button name="SAVE & NEXT" onClick={onNext} />
      </div>
    </div>
  )
}

export default Step4
