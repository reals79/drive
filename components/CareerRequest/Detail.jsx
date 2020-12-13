import React, { memo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { isNil } from 'ramda'
import { Button, Input, ProgressBar, Icon } from '@components'
import { ProgramStatus } from '~/services/config'
import './CareerRequest.scss'

const Detail = ({ program, requestable, current, contentLevel, onComplete, handlePdf }) => {
  const { title, data, estimated_completion, stats, status } = program
  const levels = data.levels
  const isCompleted = !isNil(levels[current]) && !isNil(levels[current].completed_at)
  const completedDate = isCompleted
    ? moment
        .utc(levels[current].completed_at)
        .local()
        .format('MMM DD, YY')
    : ''
  const levelStats = stats.levels ? stats.levels[current] : stats
  const { courses, quotas } = levelStats
  const isCourseCompleted = isNil(courses) ? true : courses.complete === courses.total
  const isQuotaCompleted = isNil(quotas) ? true : quotas.complete === quotas.total
  const isRequireCompleted = !isNil(levelStats) && isCourseCompleted && isQuotaCompleted
  const totals = (isNil(quotas) ? 0 : quotas.total) + (isNil(courses) ? 0 : courses.total)
  const completes = (isNil(quotas) ? 0 : quotas.complete) + (isNil(courses) ? 0 : courses.complete)
  const totalProgress = totals === 0 ? 100 : ((completes * 100) / totals).toFixed(2)

  return (
    <div className="career-request mt-3">
      <div className="d-flex justify-content-between mb-3">
        <span className="dsl-b22 bold">{title}</span>
        <div className="d-flex justify-content-end cursor-pointer ml-3">
          <Icon name="fal fa-print" color="#343f4b" size={16} onClick={handlePdf} />
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <Input
          disabled
          className="career-title"
          title="Level Title"
          value={data.levels[contentLevel].title}
          direction="vertical"
        />
        <ProgressBar className="level-progress" title="Progress" value={totalProgress} />
      </div>
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
            requestable &&
            !(status === ProgramStatus.PROMOTION) && (
              <Button
                name="REQUEST COMPLETION"
                disabled={!isRequireCompleted || program.id === 0}
                onClick={onComplete}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

Detail.propTypes = {
  program: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    stats: PropTypes.shape({
      levels: PropTypes.any,
    }),
    level: PropTypes.number,
    estimated_completion: PropTypes.string,
  }),
  current: PropTypes.number,
  requestable: PropTypes.bool,
  onComplete: PropTypes.func,
}

Detail.defaultProps = {
  program: {
    id: 0,
    title: '',
    stats: {
      levels: {},
    },
    level: 1,
    estimated_completion: '',
  },
  current: 1,
  requestable: false,
  onComplete: () => {},
}

export default memo(Detail)
