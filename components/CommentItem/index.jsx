import React, { memo } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Image } from 'react-bootstrap'
import { isNil } from 'ramda'

const CommentItem = ({ data }) => (
  <div className="d-flex p-2">
    <Image
      width="40"
      height="40"
      src={isNil(data.avatar) ? '/images/default.png' : data.avatar}
      className="rounded-circle mr-4"
    />
    <div className="align-items-start flex-column">
      <p className="dsl-b16 mb-0">
        <b>{data.name}</b>
      </p>
      <p className="dsl-b14 mb-0">{data.data.body}</p>
      <p className="dsl-d14 mb-0">
        {moment
          .utc(data.created_at)
          .local()
          .format('M/D/YYYY')}
      </p>
    </div>
  </div>
)

CommentItem.propTypes = {
  data: PropTypes.any,
}

export default memo(CommentItem)
