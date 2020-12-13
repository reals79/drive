import React from 'react'
import { EditDropdown, Icon } from '@components'
import './SignatureList.scss'

const Packets = props => {
  return (
    <>
      <div className="d-flex border-bottom py-2">
        <div className="d-flex-5">
          <span className="dsl-m12">Packets</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Open</span>
        </div>
        <div className="d-flex-5 ml-2">
          <span className="dsl-m12">Employees</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Completed</span>
        </div>
        <div className="d-flex-5 ml-2">
          <span className="dsl-m12">Employees</span>
        </div>
        <div className="d-flex-2" />
      </div>
      {[1, 2, 3].map((item, index) => (
        <div key={`p${index}`} className="d-flex align-items-center py-4 border-bottom">
          <div className="d-flex-5 d-flex align-items-center">
            <Icon name="fal fa-envelope-open-text" color="#343f4b" size={16} />
            <span className="dsl-b14 ml-3">Name of packet...</span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-b14">{item}</span>
          </div>
          <div className="d-flex-5 ml-3">
            <span className="dsl-b14"></span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-b14">{item}</span>
          </div>
          <div className="d-flex-5 ml-3">
            <span className="dsl-b14">No Employee</span>
          </div>
          <div className="d-flex-2">
            <EditDropdown />
          </div>
        </div>
      ))}
    </>
  )
}

export default Packets
