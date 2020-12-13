import React, { memo } from 'react'
import { Avatar, Button, ProgressBar } from '@components'
import { history } from '~/reducers'
import { avatarBackgroundColor } from '~/services/util'

function NewHireOrientations(props) {
  const { certifications_assigned, certifications_completed, new_hires, top_users } = props.data

  return (
    <div className="card mb-3 custom-width">
      <p className="dsl-b22 bold">New Hire Orientations</p>
      <div className="d-flex">
        <div className="newhire-card mr-3">
          <p className="dsl-m12 text-400 mb-0">New Hires</p>
          <p className="dsl-m12 text-400 mb-2">this month</p>
          <p className="dsl-b16 text-400 mb-0">{new_hires}</p>
        </div>
        <div className="newhire-card mr-3">
          <p className="dsl-m12 text-400 mb-0">Certifications</p>
          <p className="dsl-m12 text-400 mb-2">Assigned</p>
          <p className="dsl-b16 text-400 mb-0">{certifications_assigned}</p>
        </div>
        <div className="newhire-card">
          <p className="dsl-m12 text-400 mb-0">Certifications</p>
          <p className="dsl-m12 text-400 mb-2">Completed</p>
          <p className="dsl-b16 text-400 mb-0">{certifications_completed}</p>
        </div>
      </div>
      <p className="dsl-b18 bold mt-4">New Hires</p>
      <div className="px-0 px-md-3">
        <div className="d-flex pb-3 border-bottom">
          <span className="dsl-m12 text-400 d-flex-3">Employee</span>
          <span className="dsl-m12 text-400 d-flex-1">Active</span>
          <span className="dsl-m12 text-400 d-flex-2">Completed</span>
        </div>
        {top_users.length > 0 ? (
          top_users.map((item, index) => (
            <div className="d-flex align-items-center mt-3" key={`nh${index}`}>
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
              <div className="d-flex-1">
                <span className="dsl-b16 text-400">Yes</span>
              </div>
              <div className="d-flex-2">
                <ProgressBar value={30} />
              </div>
            </div>
          ))
        ) : (
          <p className="dsl-m12 text-center mt-3">No new hires</p>
        )}
      </div>
      <div className="justify-end mt-3">
        <Button
          className="text-400 mr-2"
          type="low"
          name="ADD EMPLOYEE"
          onClick={() => history.push('/hcm/record-add-employee')}
        />
        <Button
          className="text-400"
          type="medium"
          name="NEW HIRE REPORT"
          onClick={() => history.push('/hcm/report-engagement')}
        />
      </div>
    </div>
  )
}

export default memo(NewHireOrientations)
