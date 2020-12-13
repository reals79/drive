import React, { memo } from 'react'
import './StatsCard.scss'

const SectionOpenStatus = props => (
  <div className="tasks-status border-5 px-4 align-items-center justify-content-between text-center">
    <div className="col-xs-2 px-0">
      <p className="dsl-d12">Open</p>
      <p className="dsl-b12 bold mb-0">{props.status.pending + props.status.past_due}</p>
    </div>
    <div className="col-xs-2 px-0">
      <p className="dsl-d12">Current</p>
      <p className="dsl-b12 bold mb-0">{props.status.pending}</p>
    </div>
    <div className="col-xs-4 px-0">
      <p className="dsl-d12">Past due</p>
      <p className="dsl-b12 bold mb-0">{props.status.past_due}</p>
    </div>
    <div className="col-xs-4 px-0">
      <p className="dsl-d12">Completed Today</p>
      <p className="dsl-b12 bold mb-0">
        {props.status.total == 0
          ? 0
          : Math.round((props.status.complete * 100) / props.status.total)}
        %
      </p>
    </div>
  </div>
)

export default memo(SectionOpenStatus)
