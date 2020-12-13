import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Placeholder } from '@components'
import './TaskEmptyList.scss'

const TaskEmptyList = ({ className, type = 'blank', title, message }) => (
  <div className={`task-empty-list ${className}`}>
    <Placeholder type={type} />
    <div className="messages" dangerouslySetInnerHTML={{ __html: title + '<br>' + message }} />
  </div>
)

TaskEmptyList.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string,
}

TaskEmptyList.defaultProps = {
  className: '',
  message: '',
  title: '',
}

export default memo(TaskEmptyList)
