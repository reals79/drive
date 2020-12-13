import React from 'react'
import PropTypes from 'prop-types'
import { concat, append, isEmpty } from 'ramda'
import { EditDropdown } from '@components'

const CertEmployees = ({ admin, data, onClick }) => {
  const { title, stats } = data
  const employees = concat(stats.open_employees, stats.completed_employees)
  const menu = ['View']
  const dotsMenu = admin ? append('Edit', menu) : menu

  return (
    <div className="certification-employees-list">
      <p className="dsl-b20 text-500">{title}</p>
      <div className="d-flex border-bottom py-3">
        <div className="d-flex-7 dsl-m12">Employees</div>
        <div className="d-flex-2 dsl-m12 px-3 text-right">Courses</div>
        <div className="d-flex-2 dsl-m12 px-3 text-right">Habits</div>
        <div className="d-flex-2 dsl-m12 px-3 text-right">Quotas</div>
        <div className="d-flex-3 dsl-m12 px-3">Assigned</div>
        <div className="d-flex-3 dsl-m12 px-3">Est completion</div>
        <div className="d-flex-3 dsl-m12 px-3">Completed</div>
        <div className="d-flex-1"></div>
      </div>
      {isEmpty(employees) ? (
        <div className="d-center pt-4">
          <span className="dsl-m16">No employees currently assigned.</span>
        </div>
      ) : (
        employees.map(employee => {
          const { id, profile } = employee
          const certification = { ...data, user_id: id }
          return (
            <div className="d-flex align-items-center border-bottom py-3" key={id}>
              <div className="d-flex-7 cursor-pointer dsl-b14" onClick={() => onClick('view', certification)}>
                {`${profile.first_name} ${profile.last_name}`}
              </div>
              <div className="d-flex-2 px-3">
                <p className="dsl-b14 mb-0 text-right">
                  {2}/{10}
                </p>
                <p className="dsl-b12 mb-0 text-right">{20}%</p>
              </div>
              <div className="d-flex-2 px-3">
                <p className="dsl-b14 mb-0 text-right">
                  {1}/{10}
                </p>
                <p className="dsl-b12 mb-0 text-right">{10}%</p>
              </div>
              <div className="d-flex-2 px-3">
                <p className="dsl-b14 mb-0 text-right">
                  {6}/{9}
                </p>
                <p className="dsl-b12 mb-0 text-right">{60}%</p>
              </div>
              <div className="d-flex-3 dsl-b14 px-3">{'N/A'}</div>
              <div className="d-flex-3 dsl-b14 px-3">{'N/A'}</div>
              <div className="d-flex-3 dsl-b14 px-3">72%</div>
              <div className="d-flex-1">
                <EditDropdown options={dotsMenu} onChange={e => onClick(e, certification)} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

CertEmployees.propTypes = {
  admin: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    stats: PropTypes.shape({
      open: PropTypes.number,
      completed: PropTypes.number,
      open_employees: PropTypes.array,
      completed_employees: PropTypes.array,
    }),
  }),
  onClick: PropTypes.func,
}

CertEmployees.defaultProps = {
  admin: false,
  data: {
    id: 0,
    title: '',
    stats: {
      open: 0,
      completed: 0,
      open_employees: [],
      completed_employees: [],
    },
  },
  onClick: () => {},
}

export default CertEmployees
