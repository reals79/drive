import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isNil, isEmpty } from 'ramda'
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@components'
import './CareerMap.scss'

const Detail = ({ className, levels, current }) => (
  <div className={classNames('career-map', className)}>
    <div className="header">
      <span className="dsl-b22 bold">Career Map</span>
    </div>
    <div className="map-header">
      <span className="d-flex-5 dsl-m12">Level</span>
      <span className="d-flex-2 dsl-m12 text-right">Started</span>
      <span className="d-flex-3 dsl-m12 text-right">Completed</span>
    </div>
    {isEmpty(levels) ? (
      <div className="map-item">
        <p className="dsl-m14">No Career program level assigned.</p>
      </div>
    ) : (
      levels.map(({ title, started_at, completed_at }, index) => {
        const isCompleted = !isNil(completed_at)
        const isCurrent = equals(index + 1, current)
        return (
          <div className="map-item" key={`level-${index}`}>
            <div className="d-flex d-flex-5 career-name">
              {isCompleted ? (
                <Icon name="check fal fa-check" color="#c3c7cc" size={14} />
              ) : (
                <div className="check" />
              )}
              <span
                className={`dsl-${isCurrent ? 'b16 text-400' : 'l16'} ${
                  isCompleted ? 'line-through' : ''
                } truncate-one`}
              >
                {title}
              </span>
              <div className="career-name-modal dsl-b16 text-400">{title}</div>
            </div>
            <span className={`d-flex-2 text-right dsl-${isCurrent ? 'b16 text-400' : 'l16'}`}>
              {!isNil(started_at)
                ? moment
                    .utc(started_at)
                    .local()
                    .format('MMM D, YY')
                : ''}
            </span>
            <span className={`d-flex-3 text-right dsl-${isCurrent ? 'b16 text-400' : 'l16'}`}>
              {isCompleted &&
                moment
                  .utc(completed_at)
                  .local()
                  .format('MMM D, YY')}
              {isNil(started_at) && 'Not started'}
              {!isNil(started_at) && isCurrent && 'In Progress'}
            </span>
          </div>
        )
      })
    )}
  </div>
)

Detail.propTypes = {
  levels: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      chronology_lock: PropTypes.bool,
      time_lock: PropTypes.bool,
      habits: PropTypes.shape({
        day: PropTypes.array,
        week: PropTypes.array,
        month: PropTypes.array,
      }),
      quotas: PropTypes.array,
      trainings: PropTypes.shape({
        days_to_complete: PropTypes.string,
        items: PropTypes.array,
      }),
      started_at: PropTypes.string,
    })
  ),
  current: PropTypes.number,
}

Detail.defaultProps = {
  levels: {
    title: '',
    chronology_lock: false,
    time_lock: false,
    habits: {
      day: [],
      week: [],
      month: [],
    },
    quotas: [],
    trainings: {
      days_to_complete: '',
      items: [],
    },
    started_at: '',
  },
  current: 1,
}

export default memo(Detail)
