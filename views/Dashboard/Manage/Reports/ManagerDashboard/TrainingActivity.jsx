import React, { memo } from 'react'
import { Avatar, Button } from '@components'
import { history } from '~/reducers'
import { avatarBackgroundColor } from '~/services/util'

function TrainingActivity(props) {
  const { assignments, courses_completed, modules_completed, top_users } = props.data
  const payload = {
    type: 'Assign Training',
    data: { before: {}, after: {} },
    callBack: {},
  }

  return (
    <div className="card mb-3 mr-3 custom-width">
      <p className="dsl-b22 bold">Training Activity</p>
      <div className="d-flex">
        <div className="training-card mr-3 py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Modules</p>
          <p className="dsl-m12 text-400 mb-2">Completed</p>
          <p className="dsl-b16 text-400 mb-0">{modules_completed}</p>
        </div>
        <div className="training-card mr-3 py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Courses</p>
          <p className="dsl-m12 text-400 mb-2">Completed</p>
          <p className="dsl-b16 text-400 mb-0">{courses_completed}</p>
        </div>
        <div className="training-card py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Assignments</p>
          <p className="dsl-m12 text-400 mb-2">ready next week</p>
          <p className="dsl-b16 text-400 mb-0">{assignments}</p>
        </div>
      </div>
      <p className="dsl-b18 bold mt-4">Top Trainees</p>
      <div className="px-0 px-md-3">
        <div className="d-flex pb-3 border-bottom">
          <span className="dsl-m12 text-400 d-flex-3">Employee</span>
          <span className="dsl-m12 text-400 d-flex-1 justify-end">Modules</span>
          <span className="dsl-m12 text-400 d-flex-1 justify-end">Courses</span>
        </div>
        {top_users.length > 0 ? (
          top_users.map((item, index) => (
            <div className="d-flex align-items-center mt-3" key={`ta${index}`}>
              <div className="d-flex d-flex-3 align-items-center">
                <Avatar
                  size="tiny"
                  type="initial"
                  url={item.user.profile.avatar}
                  name={`${item.user.profile.first_name} ${item.user.profile.last_name}`}
                  backgroundColor={avatarBackgroundColor(item.user.id)}
                />
                <span className="dsl-b16 ml-3">{`${item.user.profile.first_name} ${item.user.profile.last_name}`}</span>
              </div>
              <div className="d-flex-1 justify-end">
                <span className="dsl-b16 text-400">{item.modules_complete}</span>
              </div>
              <div className="d-flex-1 justify-end">
                <span className="dsl-b16 text-400">{item.courses_complete}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="dsl-m12 text-center mt-3">No top trainees</p>
        )}
      </div>
      <div className="justify-end mt-3">
        <Button className="text-400 mr-2" type="low" name="ASSIGN TRAINING" onClick={() => props.onModal(payload)} />
        <Button
          className="text-400"
          type="medium"
          name="TRAINING REPORT"
          onClick={() => history.push('/hcm/report-training')}
        />
      </div>
    </div>
  )
}

export default memo(TrainingActivity)
