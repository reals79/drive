import React, { memo } from 'react'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { filter, isEmpty, length } from 'ramda'
import TrainingWeekItem from '../TrainingWeekItem'
import { TrainingCourseHeader, TrainingCourseItem } from '../TrainingCourse'
import './TrainingWeeks.scss'

const moment = extendMoment(originalMoment)
const TrainingWeeks = ({ weeks, startDate, courses, onUpdateCourseUsers, onCourseEvent }) => (
  <div className="weekly-training">
    {[...Array(weeks)].map((e, index) => {
      const start = moment(startDate)
        .add(index, 'weeks')
        .format('M/D/YY')
      const end = moment(start)
        .add(6, 'days')
        .format('M/D/YY')
      const range = moment.range(start, end)
      const weekCourses = isEmpty(courses)
        ? []
        : filter(x => range.contains(moment(x.data.due_date)), courses)

      return (
        <div key={`week-${index}`}>
          <TrainingWeekItem week={index + 1} start={start} end={end} len={length(weekCourses)} />
          {!isEmpty(weekCourses) && (
            <div className="weekly-courses">
              <TrainingCourseHeader />
              {weekCourses.map(course => (
                <TrainingCourseItem
                  key={course.id}
                  course={course}
                  onUpdateUsers={e => onUpdateCourseUsers(course.id, e)}
                  onMenuEvent={e => onCourseEvent(e, course.id)}
                />
              ))}
            </div>
          )}
        </div>
      )
    })}
  </div>
)

TrainingWeeks.propTypes = {
  weeks: PropTypes.number,
  start: PropTypes.any,
  courses: PropTypes.array,
  onUpdateCourseUsers: PropTypes.func,
  onCourseEvent: PropTypes.func,
}

TrainingWeeks.defaultProps = {
  weeks: 0,
  start: null,
  courses: [],
  onUpdateCourseUsers: () => {},
  onCourseEvent: () => {},
}

export default memo(TrainingWeeks)
