import React from 'react'
import moment from 'moment'
import { isNil, isEmpty, equals, filter } from 'ramda'
import { Pagination, Thumbnail, EditDropdown } from '@components'
import { ManageAssignments, LibraryTypes, ProgramTypes } from '~/services/config'
import './AssignmentsProgramCard.scss'

const List = props => {
  const { userRole, current, perPage, total, onChange, onSelect } = props
  const data = filter(program => !equals(program.status, 3), props.data)

  return (
    <div className="assignments-program-card">
      <div className="dsl-b16 bold mb-2">Programs</div>
      <div className="card-item pb-4">
        <div className="d-flex-5 d-flex-ssm-1">
          <p className="dsl-m12 text-400 m-0">Programs</p>
        </div>
        <div className="d-flex-1">
          <p className="dsl-m12 text-center text-400 ml-3 mb-0">Courses</p>
        </div>
        <div className="d-flex-1">
          <p className="dsl-m12 text-right text-400 m-0">Habits</p>
        </div>
        <div className="d-flex-1 d-none d-md-block">
          <p className="dsl-m12 text-right text-400 m-0 ">Quotas</p>
        </div>
        <div className="d-flex-1 d-none d-md-block">
          <p className="dsl-m12 text-right text-400 m-0">Docs</p>
        </div>
        <div className="d-flex-2 d-none d-md-block">
          <p className="dsl-m12 text-center text-400 m-0">Assigned</p>
        </div>
        <div className="d-flex-2 d-none d-md-block">
          <p className="dsl-m12 text-400 m-0">Est Completion</p>
        </div>
        <div className="d-flex-1 d-none d-md-block">
          <p className="dsl-m12 text-right text-400 m-0">Completed</p>
        </div>
        <div className="edit d-none d-md-block" />
      </div>
      {isNil(data) || isEmpty(data) ? (
        <div className="d-center pt-4">
          <span className="dsl-m16">No programs assigned.</span>
        </div>
      ) : (
        <>
          {data.map(program => {
            const type = ProgramTypes[program.type - 1]
            const { courses, habits, quotas, modules } = program.stats
            const habitsComplete = isNil(habits)
              ? 0
              : habits.day.complete + habits.week.complete + habits.month.complete
            const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
            const habitsCompletion = equals(habitsTotal, 0) ? 0 : Math.ceil((habitsComplete * 100) / habitsTotal)
            const totalsCompletion = Math.ceil(
              ((habitsComplete + quotas.complete + courses.complete) * 100) /
                (habitsTotal + courses.total + quotas.total)
            )
            return (
              <div className="card-item" key={program.id}>
                <div className="d-flex align-items-center d-flex-5 ">
                  <Thumbnail src={LibraryTypes[type].icon} label={LibraryTypes[type].label} />
                  <p className="dsl-b14 my-0 mx-3 text-400">{program.title}</p>
                </div>
                <div className="d-flex-1">
                  <p className="dsl-b14 text-right mb-1 text-400">
                    {courses.complete}/{courses.total}
                  </p>
                  <p className="dsl-b12 text-right mb-0 ml-1">{courses.completion}%</p>
                </div>
                <div className="d-flex-1 d-none d-md-block">
                  <p className="dsl-b14 text-right mb-1 text-400">
                    {habitsComplete}/{habitsTotal}
                  </p>
                  <p className="dsl-b12 text-right mb-0 ml-1">{habitsCompletion}%</p>
                </div>
                <div className="d-flex-1 d-none d-md-block">
                  <p className="dsl-b14 text-right mb-1 text-400">
                    {quotas.complete}/{quotas.total}
                  </p>
                  <p className="dsl-b12 text-right mb-0">{quotas.completion}%</p>
                </div>
                <div className="d-flex-1 d-none d-md-block">
                  <p className="dsl-b14 text-right mb-1 text-400 ">N/A</p>
                </div>
                <div className="d-flex-2 d-none d-md-block">
                  <p className="dsl-b14 text-center mb-1 text-400">
                    {moment
                      .utc(program.created_at)
                      .local()
                      .format('MMM DD, YY')}
                  </p>
                </div>
                <div className="d-flex-2 d-none d-md-block">
                  <p className="dsl-b14 mb-1 text-400">
                    {moment
                      .utc(program.estimated_completion)
                      .local()
                      .format('MMM DD, YY')}
                  </p>
                </div>
                <div className="d-flex-1 d-none d-md-block">
                  <p className="dsl-b14 text-right mb-1 text-400">{totalsCompletion}%</p>
                </div>
                <div className="edit d-none d-md-block">
                  <EditDropdown options={ManageAssignments[userRole]} onChange={e => onSelect(e, program)} />
                </div>
              </div>
            )
          })}
          <Pagination perPage={perPage} current={current} total={total} onChange={onChange} />
        </>
      )}
    </div>
  )
}

export { List }
