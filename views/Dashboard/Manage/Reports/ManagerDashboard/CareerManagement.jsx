import React, { memo } from 'react'
import { filter, equals } from 'ramda'
import { Avatar, Button, ProgressBar } from '@components'
import { history } from '~/reducers'
import { ProgramTypes } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'

function CareerManagement(props) {
  const { average_completion, employee_careers, promotions_possible, top_users } = props.data
  const disabled = filter(e => !equals(e, 'careers'), ProgramTypes)

  const payload = {
    type: 'Assign Program',
    data: { before: { disabled }, after: null },
    callBack: {},
  }

  return (
    <div className="card mb-3 custom-width">
      <p className="dsl-b22 bold">Career Management</p>
      <div className="d-flex">
        <div className="career-card mr-3 text-center py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Employees</p>
          <p className="dsl-m12 text-400 mb-2">Career Paths</p>
          <p className="dsl-b16 text-400 mb-0">{employee_careers}</p>
        </div>
        <div className="career-card mr-3 text-center py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Promotions</p>
          <p className="dsl-m12 text-400 mb-2">Possible this Month</p>
          <p className="dsl-b16 text-400 mb-0">{promotions_possible}</p>
        </div>
        <div className="career-card text-center py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Ave Career</p>
          <p className="dsl-m12 text-400 mb-2">Completion</p>
          <p className="dsl-b16 text-400 mb-0">{average_completion}%</p>
        </div>
      </div>
      <p className="dsl-b18 bold mt-4">Career Progress</p>
      <div className="px-0 px-md-3">
        {top_users.length > 0 ? (
          top_users.map((item, index) => (
            <div className="d-flex align-items-center mt-3" key={`cm${index}`}>
              <Avatar
                className="mr-4"
                size="tiny"
                type="initial"
                url={item.user.profile.avatar}
                name={`${item.user.profile.first_name} ${item.user.profile.last_name}`}
                backgroundColor={avatarBackgroundColor(item.user.id)}
              />
              <ProgressBar className="d-flex-1" title={item.program.title} value={item.completed_percent} />
            </div>
          ))
        ) : (
          <p className="dsl-m12 text-center mt-3">No career progress</p>
        )}
      </div>
      <div className="justify-end mt-3">
        <Button className="text-400 mr-2" type="low" name="ASSIGN CAREER" onClick={() => props.onModal(payload)} />
        <Button
          className="text-400"
          type="medium"
          name="CAREER REPORT"
          onClick={() => history.push('/hcm/report-careers')}
        />
      </div>
    </div>
  )
}

export default memo(CareerManagement)
