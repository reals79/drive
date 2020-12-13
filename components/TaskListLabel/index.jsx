import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import { Icon } from '@components'
import './TaskListLabel.scss'

const TaskListLabel = ({ title, status, right }) => (
  <div className="task-list-label">
    <span className="dsl-b18 text-500">{title}</span>
    <Dropdown id="task-dropdown" className="todo-dropdown" pullRight={right}>
      <Dropdown.Toggle className="btn-task-chart">
        <Icon name="fas fa-chart-pie-alt" color="#969faa" size={15} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div className="arrow" />
        {status.type == 'single' ? (
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
  </div>
)

TaskListLabel.propTypes = {
  status: PropTypes.any,
  title: PropTypes.string,
  right: PropTypes.bool,
}

TaskListLabel.defaultProps = {
  status: {},
  title: '',
  right: false,
}

export default TaskListLabel
