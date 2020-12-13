import React, { memo } from 'react'
import PropTypes from 'prop-types'
import './Placeholder.scss'

const Placeholder = ({ type }) => {
  let html

  switch (type) {
    case 'task':
      html = (
        <div className="placeholder-task-item">
          <div className="d-flex align-items-center py-2">
            <div className="check-mark" />
            <div className="task-list-detail">
              <div className="title" />
              <div className="description" />
            </div>
            <div className="due-date px-2">
              <div className="avatar mx-auto" />
              <div className="date mx-auto mt-1" />
            </div>
            <div className="task-list-dropdown" />
          </div>
        </div>
      )
      break
    case 'training':
      html = (
        <div className="placeholder-task-item">
          <div className="d-flex border-bottom py-2">
            <div className="check-mark my-auto" />
            <div className="thumb" />
            <div className="task-list-detail ml-2">
              <div className="description mt-0" />
              <div className="title mt-5" />
            </div>
            <div className="task-list-info ml-2">
              <div className="description mt-0" />
              <div className="title mt-5 mx-auto" />
            </div>
          </div>
        </div>
      )
      break
    case 'blank':
      html = (
        <div className="placeholder-task-item">
          <div className="d-flex py-5"></div>
        </div>
      )
  }

  return html
}

Placeholder.propTypes = {
  type: PropTypes.oneOf(['task', 'training', 'blank']),
}

Placeholder.defaultProps = {
  type: 'blank',
}

export default memo(Placeholder)
