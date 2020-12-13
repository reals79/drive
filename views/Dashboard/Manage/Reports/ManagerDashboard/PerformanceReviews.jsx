import React, { memo } from 'react'
import { filter, equals } from 'ramda'
import { Avatar, Button, Rating } from '@components'
import { history } from '~/reducers'
import { ToDoTypes } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'

function PerformanceReviews(props) {
  const { average_reviews, scorecards, task_commitments, training_commitments, top_users } = props.data

  const disabled = filter(e => !equals(e, 'scorecards'), ToDoTypes)

  const payload = {
    type: 'Assign ToDo',
    data: { before: { disabled }, after: null },
    callBack: {},
  }

  return (
    <div className="card mb-3 mr-3 custom-width">
      <p className="dsl-b22 bold">Scorecard Reviews</p>
      <div className="d-flex">
        <div className="performance-card d-flex-3 mr-3 py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Employees with</p>
          <p className="dsl-m12 text-400 mb-2">Scorecards</p>
          <p className="dsl-b16 text-400 mb-0">{scorecards}</p>
        </div>
        <div className="performance-card d-flex-4 mr-3 py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Average</p>
          <p className="dsl-m12 text-400 mb-2">Reviews</p>
          <div className="d-flex align-items-center score-star">
            <Rating className="ml-2" score={average_reviews} />
          </div>
        </div>
        <div className="performance-card d-flex-3 py-2 px-1">
          <p className="dsl-m12 text-400 mb-0">Commitments</p>
          <p className="dsl-m12 text-400 mb-2">Made</p>
          <p className="dsl-b16 text-400 mb-0">{task_commitments}</p>
        </div>
      </div>
      <p className="dsl-b18 bold mt-4">Top Reviews</p>
      <div className="px-0 px-md-3">
        <div className="d-flex pb-3 border-bottom">
          <span className="dsl-m12 text-400 d-flex-4">Employee</span>
          <span className="dsl-m12 text-400 d-flex-1 justify-end">Score</span>
          <span className="dsl-m12 text-400 d-flex-3 ml-5 ml-lg-3">Stars</span>
        </div>
        {top_users.length > 0 ? (
          top_users.map((item, index) => (
            <div className="d-flex align-items-center mt-3" key={`pr${index}`}>
              <div className="d-flex d-flex-4 align-items-center">
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
                <span className="dsl-b16 text-400">{item.stars}</span>
              </div>
              <div className="d-flex d-flex-3 ml-5 ml-lg-3 score-hide">
                <Rating className="ml-2" score={item.stars} />
              </div>
            </div>
          ))
        ) : (
          <p className="dsl-m12 text-center mt-3">No top reviews</p>
        )}
      </div>
      <div className="justify-end mt-3">
        <Button className="text-400 mr-2" type="low" name="ASSIGN SCORECARD" onClick={() => props.onModal(payload)} />
        <Button
          className="text-400"
          type="medium"
          name="PERFORMANCE REPORT"
          onClick={() => history.push('/hcm/report-performance')}
        />
      </div>
    </div>
  )
}

export default memo(PerformanceReviews)
