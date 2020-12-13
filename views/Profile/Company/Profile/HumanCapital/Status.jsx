import React from 'react'
import PropTypes from 'prop-types'

const Status = ({ data }) => {
  return (
    <div className="d-flex px-5 pt-4">
      <div className="d-flex-1">
        <p className="dsl-m12 text-center">Employees</p>
        <p className="dsl-b14 text-center text-400 mb-0">{data?.users?.length}</p>
      </div>
      <div className="d-flex-1">
        <p className="dsl-m12 text-center">Departments</p>
        <p className="dsl-b14 text-center text-400 mb-0">{data?.departments?.length}</p>
      </div>
      <div className="d-flex-1">
        <p className="dsl-m12 text-center">Teams</p>
        <p className="dsl-b14 text-center text-400 mb-0">{data?.teams?.length}</p>
      </div>
      <div className="d-flex-1">
        <p className="dsl-m12 text-center">Roles</p>
        <p className="dsl-b14 text-center text-400 mb-0">{data?.job_roles?.length}</p>
      </div>
      <div className="d-flex-1">
        <p className="dsl-m12 text-center">Supervisors</p>
        <p className="dsl-b14 text-center text-400 mb-0">{data?.managers?.length}</p>
      </div>
    </div>
  )
}

Status.propTypes = {}

Status.defaultProps = {}

export default Status
