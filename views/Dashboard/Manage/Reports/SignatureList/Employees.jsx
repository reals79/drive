import React from 'react'
import { Avatar, EditDropdown } from '@components'
import './SignatureList.scss'

const Employees = props => {
  return (
    <>
      <div className="d-flex border-bottom py-2">
        <div className="d-flex-5">
          <span className="dsl-m12">Employee</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Open</span>
        </div>
        <div className="d-flex-5 ml-2">
          <span className="dsl-m12">Packets</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Completed</span>
        </div>
        <div className="d-flex-5 ml-2">
          <span className="dsl-m12">Packets</span>
        </div>
        <div className="d-flex-2" />
      </div>
      {[1, 2, 3].map((item, index) => (
        <div key={`e${index}`} className="d-flex align-items-center py-4 border-bottom">
          <div className="d-flex-5 d-flex align-items-center">
            <Avatar size="tiny" name={name} onToggle={() => {}} />
            <span className="dsl-b14 ml-3"></span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-b14">{item}</span>
          </div>
          <div className="d-flex-5 ml-3">
            <span className="dsl-b14">Employee handbook Pay...</span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-b14">{item}</span>
          </div>
          <div className="d-flex-5 ml-3">
            <span className="dsl-b14">Employee handbook Pay...</span>
          </div>
          <div className="d-flex-2">
            <EditDropdown />
          </div>
        </div>
      ))}
    </>
  )
}

export default Employees
