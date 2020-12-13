import React, { memo } from 'react'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { filter, isEmpty, length, isNil } from 'ramda'
import CourseItem from './CourseItem'
import CourseHeader from './CourseHeader'
import './TrainingScheduleCourses.scss'

const moment = extendMoment(originalMoment)
const CourseList = ({
  admin,
  weeks,
  scheduleUsers,
  startDate,
  endDate,
  courses,
  employees,
  onChangeDate,
  onChangeUsers,
  onRemove,
}) => (
  <div className="week-courses-list">
    {[...Array(weeks)].map((e, index) => {
      const start = moment(startDate).add(index, 'weeks')
      const weeksEnd = moment(start).add(6, 'days')
      const range = moment.range(start, weeksEnd)
      const weekCourses = isEmpty(courses)
        ? []
        : filter(x => range.contains(isNil(x.due_date) ? moment(x.end_at) : moment(x.due_date)), courses)
      const end = weeksEnd < moment(endDate) ? weeksEnd.format('MMM DD') : moment(endDate).format('MMM DD')
      return (
        <div className="week-courses-item" key={`week-course-${index}`}>
          <div className="week-courses-header">
            <p className="dsl-b22 text-500 mb-0">{`Week ${index + 1}`}</p>
            <p className="dsl-b14 mb-0 text-400">{`${start.format('MMM DD')} - ${end}`}</p>
          </div>
          {!isEmpty(weekCourses) && (
            <div className="week-courses">
              <CourseHeader length={length(weekCourses)} editable={admin} />
              {weekCourses.map(course => (
                <CourseItem
                  key={course.id || course.card_template_id}
                  course={course}
                  editable={admin}
                  scheduleUsers={scheduleUsers}
                  employees={employees}
                  minDate={startDate}
                  maxDate={endDate}
                  onChangeDate={e => onChangeDate(course.id, e)}
                  onChangeUsers={e => onChangeUsers(course.id, e)}
                  onRemove={() => onRemove(course.id)}
                />
              ))}
            </div>
          )}
        </div>
      )
    })}
  </div>
)

CourseList.propTypes = {
  admin: PropTypes.bool,
  weeks: PropTypes.number,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  courses: PropTypes.array,
  employees: PropTypes.array,
  onChangeDate: PropTypes.func,
  onChangeUsers: PropTypes.func,
  onRemove: PropTypes.func,
}

CourseList.defaultProps = {
  admin: false,
  weeks: 0,
  startDate: null,
  endDate: null,
  courses: [],
  employees: [],
  onChangeDate: () => {},
  onChangeUsers: () => {},
  onRemove: () => {},
}

export default memo(CourseList)
