import React, { memo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import './TrainingWeekItem.scss'

const TrainingWeekItem = ({ week, start, end }) => (
  <div className="training-week-item">
    <div className="training-week-header">
      <p className="dsl-b22 text-500 mb-0">{`Week ${week}`}</p>
      <div className="align-items-center">
        <p className="dsl-b14 mb-0 text-400">{`${moment(start).format('MMM DD')} - ${moment(
          end
        ).format('MMM DD')}`}</p>
      </div>
    </div>
  </div>
)

TrainingWeekItem.propTypes = {
  week: PropTypes.number,
  start: PropTypes.string,
  end: PropTypes.string,
}

TrainingWeekItem.defaultProps = {
  week: 0,
  start: '',
  end: '',
}

export default memo(TrainingWeekItem)
