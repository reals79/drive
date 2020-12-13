import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { isNil, equals, type } from 'ramda'
import { CareerRequiredInstances as Instances } from '@components'
import { length } from '~/services/util'
import './CareerContent.scss'

const emptyStats = {
  courses: { complete: 0, completion: 0, expired: 0, pending: 0, total: 0 },
  habits: {
    day: { complete: 0, total: 0, completion: 0, items: {} },
    week: { complete: 0, total: 0, completion: 0, items: {} },
    month: { complete: 0, total: 0, completion: 0, items: {} },
  },
  modules: { complete: 0, completion: 0, expired: 0, pending: 0, total: 0 },
  quotas: { total: 0, complete: 0, pending: 0, completion: 0 },
}

const Detail = ({ levels, stats, current }) => {
  if (isNil(levels[current - 1])) {
    return (
      <div className="lib-programs-career">
        <div className="career-content mt-3">
          <p className="dsl-m14 mb-0">No career contents.</p>
        </div>
      </div>
    )
  }
  const { habits, quotas, trainings, documents } = levels[current - 1]
  const habitsLength = equals(type(habits), 'Object')
    ? length(habits.day) + length(habits.week) + length(habits.month)
    : length(habits)
  const levelStats = stats.levels[current] || emptyStats

  return (
    <div className="lib-programs-career">
      <div className="career-content mt-3">
        <div className="py-4">
          <p className="dsl-b18 text-500">Required Quotas</p>
          {length(quotas) > 0 ? (
            <Instances.QuotasDetail data={quotas} type="instance" />
          ) : (
            <p className="dsl-m12 text-center">No Quotas assigned</p>
          )}
        </div>
        <div className="py-4">
          <p className="dsl-b18 text-500">Required Habits</p>
          {habitsLength > 0 ? (
            <Instances.HabitsDetail data={habits} stats={levelStats.habits} />
          ) : (
            <p className="dsl-m12 text-center">No Habits assigned</p>
          )}
        </div>
        <div className="py-4">
          <p className="dsl-b18 text-500">Required Training</p>
          {length(trainings.items) > 0 ? (
            <Instances.TrainingsDetail data={trainings.items} />
          ) : (
            <p className="dsl-m12 text-center">No Training assigned</p>
          )}
        </div>
        <div className="py-4 mb-4 border-top">
          <p className="dsl-b18 text-500">Documents</p>
          {length(documents) > 0 ? (
            <Instances.DocumentsDetail data={documents} />
          ) : (
            <p className="dsl-m12 text-center mb-0">No documents uploaded yet...</p>
          )}
        </div>
      </div>
    </div>
  )
}

Detail.propTypes = {
  levels: PropTypes.array,
  stats: PropTypes.shape({
    levels: PropTypes.any,
  }),
  current: PropTypes.number,
}

Detail.defaultProps = {
  levels: [],
  current: 1,
  stats: {
    levels: {},
  },
}

export default memo(Detail)
