import React from 'react'
import { Icon } from '@components'
import { isEmpty } from 'ramda'
import classNames from 'classnames'

const TaskHeader = ({ title, data, classname }) => (
  <div className={classNames('d-flex align-items-center justify-content-between my-md-4 my-3', classname)}>
    <span className="dsl-b22 bold">{title}</span>
    <Icon name="fas fa-chart-pie-alt" size={16} color="#c3c7cc" />
  </div>
)

export default TaskHeader
