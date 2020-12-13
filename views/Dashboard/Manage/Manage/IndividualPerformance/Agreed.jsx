import React from 'react'
import moment from 'moment'

function Agreed(props) {
  const { title, data = {} } = props
  return (
    <div className="d-flex-1">
      <p className="dsl-m12">{title}</p>
      <p className="dsl-b18 m-3">{data.name}</p>
      <div className="d-flex align-items-center mb-3">
        <span className="dsl-m12 title">Date:</span>
        <span className="dsl-b16">
          {moment
            .utc(data.time)
            .local()
            .format('MMM DD YY')}
        </span>
      </div>
      <div className="d-flex align-items-center mb-3">
        <span className="dsl-m12 title">Time:</span>
        <span className="dsl-b16">
          {moment
            .utc(data.time)
            .local()
            .format('hh: mm A')}
        </span>
      </div>
      <div className="d-flex align-items-center">
        <span className="dsl-m12 title">IP:</span>
        <span className="dsl-b16">{data.ip}</span>
      </div>
    </div>
  )
}

export default Agreed
