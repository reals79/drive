import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { isNil, equals } from 'ramda'
import moment from 'moment'
import { Button } from '@components'
import './Certification.scss'

const CertificationUser = ({ className, userId, profile, certification, onComplete }) => {
  const { level, completed_at, est_complete, stats } = certification
  const name = `${profile.first_name} ${profile.last_name}`
  const estDate = isNil(est_complete)
    ? 'NA'
    : moment
        .utc(est_complete)
        .local()
        .format('MMM DD, YY')
  const isCompleted = !isNil(completed_at)
  const currentLevel = isNil(stats.levels) ? null : stats.levels[level]
  const { courses, quotas, habits } = currentLevel
  const isCoursesCompleted = isNil(courses) ? true : equals(courses.total, courses.complete)
  const isQuotasCompleted = isNil(quotas) ? true : equals(quotas.total, quotas.complete)
  const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
  const habitsComplete = isNil(habits)
    ? 0
    : habits.day.complete + habits.week.complete + habits.month.complete
  const isHabitsCompleted = equals(habitsTotal, habitsComplete)
  const isCompletedRequirements = isCoursesCompleted && isQuotasCompleted && isHabitsCompleted

  return (
    <div className={`cert-user ${className}`}>
      <div className="header">
        <p className="dsl-b22 bold">{name}</p>
      </div>
      <div className="est-date">
        <div>
          <div>
            <p className="dsl-m12">Assigned</p>
            <p className="dsl-b16 px-2">
              {moment
                .utc(certification.created_at)
                .local()
                .format('MMM DD, YY')}
            </p>
          </div>
          <div>
            <p className="dsl-m12">Est. Completion</p>
            <p className="dsl-b16 px-2">{estDate}</p>
          </div>
        </div>
        <div className="d-flex align-items-end justify-content-end">
          {isCompleted ? (
            <p className="dsl-b16">{`Completed ${moment
              .utc(completed_at)
              .local()
              .format('MMM DD, YY')}`}</p>
          ) : (
            equals(profile.id, userId) && (
              <Button name="COMPLETE" disabled={!isCompletedRequirements} onClick={onComplete} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

CertificationUser.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.number,
  profile: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  certification: PropTypes.shape({
    id: PropTypes.number,
    created_at: PropTypes.string,
    est_complete: PropTypes.string,
  }),
  onComplete: PropTypes.func,
}

CertificationUser.defaultProps = {
  className: '',
  userId: 0,
  profile: {
    id: 0,
    first_name: '',
    last_name: '',
    avatar: '',
  },
  certification: {
    id: 0,
    created_at: '',
    est_complete: '',
  },
  onComplete: () => {},
}

export default memo(CertificationUser)
