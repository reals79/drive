import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import { equals, isNil } from 'ramda'
import { Icon } from '@components'
import './TaskHeader.scss'

const TaskHeader = ({ title, counts = null, status = null, right = false }) => (
  <div className="task-header">
    <span className="dsl-b22 bold">{title}</span>
    {!isNil(counts) && <span className="dsl-l10 ml-2 mt-2">{counts}</span>}
    <div className="space" />
    {isNil(status) ? (
      <Icon name="fas fa-chart-pie-alt" size={14} color="#c3c7cc" />
    ) : (
      <Dropdown id="task-dropdown" className="todo-dropdown" pullRight={right}>
        <Dropdown.Toggle className="btn-task-chart">
          <Icon name="fas fa-chart-pie-alt" color="#c3c7cc" size={15} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <div className="arrow" />
          {equals(status.type, 'single') ? (
            <>
              <p className="dsl-b13 bold">{status.title}</p>
              {status.data.map(item => (
                <p className="dsl-d13" key={item.label}>
                  {item.label}: <b>{item.value | 0}</b>
                </p>
              ))}
            </>
          ) : (
            <>
              {status.data.map(subStatus => (
                <div key={subStatus.title} className="sub-todo">
                  <p className="dsl-b13 bold">{subStatus.title}</p>
                  {subStatus.data.map(item => (
                    <p className="dsl-d13" key={item.label}>
                      {item.label}: <b>{item.value | 0}</b>
                    </p>
                  ))}
                </div>
              ))}
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    )}
  </div>
)

export default memo(TaskHeader)
