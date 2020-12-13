import React, { memo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { find, propEq, includes, isNil } from 'ramda'
import ScheduleDetailHeader from './ScheduleDetailHeader'
import ScheduleDetailList from './ScheduleDetailList'
import './TrainingScheduleDetail.scss'

const TrainingScheduleDetail = ({ schedule, users, onBack }) => {
  const start = moment(schedule.start_at)
  const end = moment(schedule.end_at)
  const weeks = Math.round(moment.duration(end.diff(start)).asWeeks())
  const user = find(propEq('userId', schedule.user_id), users)
  const employees = schedule.data.users.map(userId => {
    const u = find(propEq('userId', userId), users)
    let assigns = 0
    schedule.data.cards.forEach(card => {
      assigns += includes(userId, card.users) ? 1 : 0
    })
    return {
      id: userId,
      name: isNil(u) ? 'Not found' : u.userName,
      assigns,
    }
  })

  return (
    <div className="training-schedule-detail">
      <ScheduleDetailHeader
        title={schedule.title}
        startDate={start.format('M/D/YY')}
        endDate={end.format('M/D/YY')}
        weeks={weeks}
        creator={isNil(user) ? 'Not found' : user.userName}
        employees={employees}
        onBack={onBack}
      />
      <ScheduleDetailList
        weeks={weeks}
        courses={schedule.data.cards}
        startDate={schedule.start_at}
      />
    </div>
  )
}

TrainingScheduleDetail.propTypes = {
  schedule: PropTypes.shape({
    title: PropTypes.string,
    start_at: PropTypes.string,
    end_at: PropTypes.string,
    user_id: PropTypes.number,
    data: PropTypes.shape({
      cards: PropTypes.array,
      users: PropTypes.array,
    }),
  }),
  users: PropTypes.array,
  onBack: PropTypes.func,
}

TrainingScheduleDetail.defaultProps = {
  schedule: {
    title: '',
    start_at: '',
    end_at: '',
    user_id: 0,
    data: {
      cards: [],
      users: [],
    },
  },
  users: [],
  onBack: () => {},
}

export default memo(TrainingScheduleDetail)
