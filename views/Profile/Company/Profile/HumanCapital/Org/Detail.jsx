import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { filter } from 'ramda'
import { EditDropdown } from '@components'
import '../HumanCapital.scss'

const Detail = ({ data, employees }) => {
  return (
    <div className="human-capital">
      <div className="d-flex py-2 border-bottom">
        <div className="d-flex-3">
          <span className="dsl-m12">Departments</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Teams</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Roles</span>
        </div>
        <div className="d-flex-2 text-right">
          <span className="dsl-m12">Employees</span>
        </div>
        <div className="w-5" />
      </div>
      {data?.departments?.map((item, index) => {
        const teams = filter(e => e.department_id === item.id, data?.teams)
        const roles = filter(e => e.department_id === item.id, data?.job_roles)
        const users = filter(e => e.department_id === item.id, employees)
        return (
          <div
            className={classNames(
              'd-flex',
              index < data.departments.length - 1 && 'border-bottom py-3',
              index === data.departments.length - 1 && 'pt-3'
            )}
            key={`o${index}`}
          >
            <div className="d-flex-3">
              <span className="dsl-b14">{item.name}</span>
            </div>
            <div className="d-flex-2 text-right">
              <span className="dsl-b14">{teams.length}</span>
            </div>
            <div className="d-flex-2 text-right">
              <span className="dsl-b14">{`${data.job_roles.length}/${roles.length}`}</span>
            </div>
            <div className="d-flex-2 text-right">
              <span className="dsl-b14">{users.length}</span>
            </div>
            <div className="w-5">
              <EditDropdown options={['Edit', 'Delete']} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

Detail.propTypes = {
  data: PropTypes.array,
}

Detail.defaultProps = {
  data: [{ name: 'BDC' }, { name: 'Finance' }],
}

export default Detail
