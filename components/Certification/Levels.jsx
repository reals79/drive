import React, { memo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { values, isNil, isEmpty } from 'ramda'
import { Icon } from '@components'
import './Certification.scss'

const CertificationLevels = ({ data }) => {
  const levels = isEmpty(data) ? [] : values(data)
  return (
    <div className="cert-levels h-100">
      <div className="header">
        <span className="dsl-b22 bold">Levels</span>
      </div>
      <div className="levels-header">
        <span className="d-flex-5 dsl-m12">Level</span>
        <span className="d-flex-2 dsl-m12 text-right">Started</span>
        <span className="d-flex-2 dsl-m12 text-right">Completed</span>
      </div>
      {levels.map((level, index) => {
        const completed = !isNil(level.completed_at)
        const started = !isNil(level.started_at)
        const startDate = started
          ? moment
              .utc(level.started_at)
              .local()
              .format('MMM D, YY')
          : 'Not started'
        const compDate = completed
          ? moment
              .utc(level.completed_at)
              .local()
              .format('MMM D, YY')
          : 'Current'
        const completedDate = started ? compDate : ''
        return (
          <div className="levels-item" key={`cert-level-${index}`}>
            <div className="d-flex d-flex-5">
              {completed ? (
                <Icon name="check fal fa-check" color="#c3c7cc" size={14} />
              ) : (
                <div className="check" />
              )}
              <span className={completed ? 'dsl-l16 line-through' : 'dsl-b16'}>
                {level.title || 'Jr Sales Consultant'}
              </span>
            </div>
            <span
              className={`d-flex-2 text-right ${started && !completed ? 'dsl-b16' : 'dsl-l16'}`}
            >
              {startDate}
            </span>
            <span
              className={`d-flex-2 text-right ${started && !completed ? 'dsl-b16' : 'dsl-l16'}`}
            >
              {completedDate}
            </span>
          </div>
        )
      })}
    </div>
  )
}

CertificationLevels.propTypes = {
  data: PropTypes.any,
}

CertificationLevels.defaultProps = {
  data: {},
}

export default memo(CertificationLevels)
