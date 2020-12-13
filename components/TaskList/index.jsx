import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { filter, find, isEmpty, isNil, length, propEq } from 'ramda'
import { CoreTaskHeader as TaskHeader, CoreTaskItem as TaskItem, Pagination } from '@components'
import { inPage } from '~/services/util'
import './TaskList.scss'

const TaskList = ({
  className,
  userId,
  userRole,
  user,
  users,
  title,
  tasks,
  projects,
  footer,
  completed,
  onUpdate,
  onDelete,
  onModal,
  dataCy,
}) => {
  const data = filter(task => (completed ? !isNil(task.completed_at) : isNil(task.completed_at)), tasks)

  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className={`daily-work-plan-tasks ${className}`} data-cy={dataCy}>
      <TaskHeader title={title} data={data} classname="daily-title" />
      <div className="box-detail" id={dataCy}>
        {isEmpty(data)
          ? footer
          : data.map((task, index) => {
              const project = find(propEq('id', task.project_id || 166), projects) || {}
              if (inPage(index, currentPage, 15)) {
                return (
                  <TaskItem
                    key={task.id}
                    className="task-list-item"
                    dataCy={`${dataCy}-taskItem${index}`}
                    userIds={[userId]}
                    role={userRole}
                    self={user}
                    users={users}
                    task={task}
                    project={project}
                    onModal={e => onModal(e)}
                    onUpdate={e => onUpdate(e, task.id)}
                    onDelete={e => onDelete(e)}
                  />
                )
              }
            })}
      </div>
      {data.length >= 15 && (
        <Pagination
          dataCy={dataCy}
          current={currentPage}
          perPage={15}
          total={Math.ceil(length(data) / 15)}
          onChange={e => setCurrentPage(e)}
        />
      )}
    </div>
  )
}

TaskList.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.number,
  userRole: PropTypes.number,
  user: PropTypes.object,
  users: PropTypes.array,
  title: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  footer: PropTypes.node,
  completed: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
}

TaskList.defaultProps = {
  className: '',
  userId: 0,
  userRole: 1,
  title: '',
  user: {},
  users: [],
  tasks: [],
  projects: [],
  completed: false,
  onUpdate: () => {},
  onDelete: () => {},
  onModal: () => {},
}

export default memo(TaskList)
