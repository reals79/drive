import React, { memo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isNil, isEmpty, equals } from 'ramda'
import { length } from '~/services/util'

const assignmentCategory = (title, data, detailed, showModal) => {
  const isAssigned = isNil(data) || isEmpty(data)
  const showNames = equals('Training', title) || equals('Habit', title)

  return (
    <div className="assignments--category">
      <div className="assignments--category--name">
        <i
          className={classNames(
            { 'fal fa-check-circle': !isAssigned },
            { 'fal fa-info-circle': isAssigned },
            { 'icon-success': !isAssigned },
            { 'icon-failure': isAssigned }
          )}
        />
        <span
          className={classNames(
            { 'category-success': !isAssigned },
            { 'category-failure': isAssigned },
            { detail: detailed }
          )}
        >
          {title}
          {detailed ? ':' : ''}
        </span>
      </div>
      {detailed && (
        <div className="assignments--category--detail">
          {!isAssigned ? (
            !showNames && length(data) ? (
              data.map((item, index) => (
                <span className="title" key={index}>
                  {item.title}
                </span>
              ))
            ) : (
              <span className="title assign" onClick={() => showModal(title)}>
                {showNames ? data : length(data)} courses assigned
              </span>
            )
          ) : (
            <span className="assign" onClick={() => showModal(title)}>
              No Assignment
            </span>
          )}
        </div>
      )}
    </div>
  )
}

const AssignmentDetail = ({
  training,
  scorecards,
  habitSchedule,
  career,
  certifications,
  onAssign,
}) => (
  <div className="assignments">
    {assignmentCategory('Training', training, false)}
    {assignmentCategory('Scorecard', scorecards, false)}
    {assignmentCategory('Habit', habitSchedule, false)}
    {assignmentCategory('Program', career, false)}
    {assignmentCategory('Certifications', certifications, false)}
    <div className="assignments--detail_modal">
      {assignmentCategory('Training', training, true, onAssign)}
      {assignmentCategory('Scorecard', scorecards, true, onAssign)}
      {assignmentCategory('Habit', habitSchedule, true, onAssign)}
      {assignmentCategory('Program', career, true, onAssign)}
      {assignmentCategory('Certifications', certifications, true, onAssign)}
    </div>
  </div>
)

AssignmentDetail.propTypes = {
  training: PropTypes.number.isRequired,
  scorecards: PropTypes.array.isRequired,
  habitSchedule: PropTypes.number.isRequired,
  career: PropTypes.array.isRequired,
  certifications: PropTypes.array.isRequired,
  onAssign: PropTypes.func.isRequired,
}

AssignmentDetail.defaultProps = {
  training: 0,
  scorecards: [],
  habitSchedule: 0,
  career: [],
  certifications: [],
  onAssign: () => {},
}

export default memo(AssignmentDetail)
