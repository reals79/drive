import React, { memo } from 'react'
import { Button, Rating } from '@components'
import { history } from '~/reducers'

function EmployeeRecords(props) {
  const {
    active_signed_documents,
    average_performance,
    employee_careers,
    habit_schedules,
    new_hires,
    scorecards,
    tasks_assigned,
    total_employees,
    training_assigned,
  } = props.data

  return (
    <div className="card mb-3 custom-width">
      <p className="dsl-b22 bold">Employee Records</p>
      <div className="d-flex">
        <div className="employee-card">
          <p className="dsl-m12 text-400 mb-0">Total</p>
          <p className="dsl-m12 text-400 mb-2">Employees</p>
          <p className="dsl-b16 text-400 mb-0">{total_employees}</p>
        </div>
        <div className="employee-card">
          <p className="dsl-m12 text-400 mb-0">Assigned</p>
          <p className="dsl-m12 text-400 mb-2">Training</p>
          <p className="dsl-b16 text-400 mb-0">{training_assigned}</p>
        </div>
        <div className="employee-card mr-0">
          <p className="dsl-m12 text-400 mb-0">New</p>
          <p className="dsl-m12 text-400 mb-2">Hires</p>
          <p className="dsl-b16 text-400 mb-0">{new_hires}</p>
        </div>
      </div>
      <div className="d-flex mt-3">
        <div className="employee-card">
          <p className="dsl-m12 text-400 mb-0">Employees</p>
          <p className="dsl-m12 text-400 mb-2">w/Scorecards</p>
          <p className="dsl-b16 text-400 mb-0">{scorecards}</p>
        </div>
        <div className="employee-card score-star">
          <p className="dsl-m12 text-400 mb-0">Average</p>
          <p className="dsl-m12 text-400 mb-2">Performance</p>
          <Rating score={average_performance} />
        </div>
        <div className="employee-card mr-0">
          <p className="dsl-m12 text-400 mb-0">Employees</p>
          <p className="dsl-m12 text-400 mb-2">w/Careers</p>
          <p className="dsl-b16 text-400 mb-0">{employee_careers}</p>
        </div>
      </div>
      <div className="d-flex mt-3">
        <div className="employee-card">
          <p className="dsl-m12 text-400 mb-0">Employees</p>
          <p className="dsl-m12 text-400 mb-2">w/Habits Sched-s</p>
          <p className="dsl-b16 text-400 mb-0">{habit_schedules}</p>
        </div>
        <div className="employee-card">
          <p className="dsl-m12 text-400 mb-0">Tasks</p>
          <p className="dsl-m12 text-400 mb-2">Assigned</p>
          <p className="dsl-b16 text-400 mb-0">{tasks_assigned}</p>
        </div>
        <div className="employee-card mr-0">
          <p className="dsl-m12 text-400 mb-0">Archived Signed</p>
          <p className="dsl-m12 text-400 mb-2">Documents</p>
          <p className="dsl-b16 text-400 mb-0">{active_signed_documents}</p>
        </div>
      </div>
      <div className="justify-end mt-3">
        <Button
          className="text-400 mr-2"
          type="low"
          name="COMPANY ROSTER"
          onClick={() => history.push('/hcm/record-company-info')}
        />
        <Button
          className="text-400"
          type="medium"
          name="ENGAGEMENT REPORT"
          onClick={() => history.push('/hcm/report-engagement')}
        />
      </div>
    </div>
  )
}

export default memo(EmployeeRecords)
