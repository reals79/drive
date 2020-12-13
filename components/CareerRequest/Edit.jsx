import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { equals, isNil } from 'ramda'
import { Accordion, Button, Icon, Input } from '@components'
import './CareerRequest.scss'

class Edit extends React.PureComponent {
  handleLevelTitle = e => {
    const { program, current } = this.props
    program.data.levels[current].title = e
    this.props.onChange(program)
  }

  render() {
    const { program, requestable, current, onLeft, onRight, onComplete } = this.props
    const { title, data, estimated_completion, stats } = program

    const levels = stats.levels || {}
    if (isNil(levels)) return null

    const isCompleted = !isNil(levels[current]) && !isNil(levels[current].completed_at)
    const completedDate = isCompleted
      ? moment
          .utc(levels[current].completed_at)
          .local()
          .format('MMM DD, YY')
      : ''
    const levelStats = stats.levels ? levels[current] : stats
    const { courses, habits, quotas } = levelStats ? levelStats : []
    const habitsComplete = isNil(habits)
      ? 0
      : habits.day.complete + habits.week.complete + habits.month.complete
    const habitsTotal = isNil(habits)
      ? 0
      : habits.day.total + habits.week.total + habits.month.total
    const isCourseCompleted = isNil(courses) ? true : equals(courses.complete, courses.total)
    const isQuotaCompleted = isNil(quotas) ? true : equals(quotas.complete, quotas.total)
    const isHabitCompleted = equals(habitsComplete, habitsTotal)
    const isRequireCompleted = isCourseCompleted && isHabitCompleted && isQuotaCompleted

    return (
      <div className="career-request mt-3">
        <div className="d-flex justify-content-between mb-3">
          <span className="dsl-b22 bold">{title}</span>
          <div className="d-flex">
            <Icon
              name="fal fa-chevron-left cursor-pointer"
              color="#969faa"
              size={24}
              onClick={onLeft}
            />
            <Icon
              name="fal fa-chevron-right cursor-pointer ml-3"
              color="#969faa"
              size={24}
              onClick={onRight}
            />
          </div>
        </div>
        <Input
          className="career-title"
          title="Level Title"
          direction="vertical"
          value={data.levels[current].title}
          onChange={this.handleLevelTitle}
        />
        <div className="d-flex justify-content-between">
          <div className="mt-3">
            <p className="dsl-m14">Est. Completion</p>
            <p className="dsl-b16 mx-2">
              {moment
                .utc(estimated_completion)
                .local()
                .format('MMM DD, YY')}
            </p>
          </div>
          <div className="d-flex align-items-end justify-content-end">
            {isCompleted ? (
              <p className="dsl-b16">{`Completed ${completedDate}`}</p>
            ) : (
              requestable && (
                <Button
                  name="REQUEST COMPLETION"
                  disabled={!isRequireCompleted || equals(program.id, 0)}
                  onClick={onComplete}
                />
              )
            )}
          </div>
        </div>
        <Accordion></Accordion>
      </div>
    )
  }
}

Edit.propTypes = {
  currentLevel: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    profile: PropTypes.shape({
      avatar: PropTypes.string,
    }),
  }),
  userId: PropTypes.number,
  program: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    stats: PropTypes.shape({
      levels: PropTypes.any,
    }),
    level: PropTypes.number,
    estimated_completion: PropTypes.string,
  }),
  onComplete: PropTypes.func,
}

Edit.defaultProps = {
  currentLevel: 1,
  user: {
    id: 0,
    name: '',
    profile: {
      avatar: '',
    },
  },
  userId: 0,
  program: {
    id: 0,
    title: '',
    stats: {
      levels: {},
    },
    level: 1,
    estimated_completion: '',
  },
  onComplete: () => {},
}

export default Edit
