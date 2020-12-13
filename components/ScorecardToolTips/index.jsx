import React from 'react'
import { Tooltip } from 'react-bootstrap'
import { Rating } from '@components'
import { arrangeQuota, getUnit } from '~/services/util'
import './ScorecardToolTips.scss'

export const QuotaTooltip = (quotasDetail, quotaName) => (
  <Tooltip id="tooltip" className="quota-tooltip">
    <div className="py-2 w-100">
      <p className="dsl-b14 bold">{quotaName}</p>
      <span className="dsl-b14">{quotasDetail ? quotasDetail : 'This quota has no summary'}</span>
    </div>
  </Tooltip>
)

export const AverageTooltip = (stats, name = '') => (
  <Tooltip id="avgtool" className="score-tooltip">
    <span className="dsl-b14 dsl-score-title">{name ? `${name} Dpt Stats` : 'Ave Score Statistics'}</span>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Employees:</span>
      <span className="tooltip-value">{stats?.employees?.count}</span>
    </div>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Scorecards:</span>
      <span className="tooltip-value">
        {stats?.scorecards?.count}&#47;{stats?.scorecards?.percent}&#37;
      </span>
    </div>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Actual Saved:</span>
      <span className="tooltip-value">
        {stats?.actuals_saved?.count}&#47;{stats?.actuals_saved?.percent}&#37;
      </span>
    </div>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Review Compl:</span>
      <span className="tooltip-value">
        {stats?.reviews_completed?.count}&#47;{stats?.reviews_completed?.percent}&#37;
      </span>
    </div>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Ave Score:</span>
      <span className="tooltip-value">
        <Rating score={stats?.completed_average_star_score?.stars} />
      </span>
    </div>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Task Assign: </span>
      <span className="tooltip-value">{stats.task_assigned}</span>
    </div>
    <div className="d-flex mb-2 tooltip-list">
      <span className="dsl-b12 pr-2 tooltip-lable">Training Assign: </span>
      <span className="tooltip-value">{stats.training_assigned}</span>
    </div>
  </Tooltip>
)

export const RatingTooltip = data => {
  const stars = arrangeQuota(data.data.star_values, data.data.quota_direction)

  return (
    <Tooltip id="tooltip" className="rating-tooltip">
      <p className="text-left mt-2 mb-2">Rating Scale :</p>
      <div className="mb-2 text-right">
        {stars.map((item, index) => (
          <div className="d-flex mb-1 flex-row" key={index}>
            {data.data.star_values.length - 1 > index && (
              <>
                <span className="d-flex-2 text-right">{getUnit(item.value, data.data.target_types)}</span>
                <Rating className="ml-3 d-flex-4 text-right" score={item.star} />
              </>
            )}
          </div>
        ))}
      </div>
    </Tooltip>
  )
}
