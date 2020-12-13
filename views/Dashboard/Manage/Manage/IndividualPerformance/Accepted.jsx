import React from 'react'
import moment from 'moment'
import { CheckIcon } from '@components'

function Accepted(props) {
  const { data = {} } = props
  return (
    <>
      <div className="d-flex align-items-center">
        <CheckIcon className="color-basic" size={26} checked />
        <span className="dsl-b20 bold">Accepted</span>
      </div>
      <div className="d-flex align-items-center mt-3 agreed">
        <span className="dsl-m12">Date</span>
        <span className="dsl-b14">
          {moment
            .utc(data.time)
            .local()
            .format('MMM DD YYYY')}
        </span>
      </div>
      <div className="d-flex align-items-center mt-3 agreed">
        <span className="dsl-m12">Time</span>
        <span className="dsl-b14">
          {moment
            .utc(data.time)
            .local()
            .format('hh:mm A')}
        </span>
      </div>
      <div className="d-flex align-items-center mt-3 agreed">
        <span className="dsl-m12">IP address</span>
        <span className="dsl-b14">{data.ip}</span>
      </div>
    </>
  )
}

export default Accepted
