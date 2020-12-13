import React, { memo, useState } from 'react'
import { filter, find, isEmpty, isNil, length, propEq } from 'ramda'
import { CoreTaskHeader as TaskHeader, Pagination, ScorecardItem } from '@components'
import { inPage } from '~/services/util'

const ScorecardList = ({
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
  onModal,
  onReview,
  onDelete,
}) => {
  const data = filter(task => (completed ? !isNil(task.completed_at) : isNil(task.completed_at)), tasks)
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <div className={`scorecard-list ${className}`}>
      <TaskHeader title={title} data={data} classname="scorecard-title" />
      <div className="box-detail">
        {isEmpty(data)
          ? footer
          : data.map((task, index) => {
              const project = find(propEq('id', task.project_id || 166), projects) || {}
              if (inPage(index, currentPage, 15)) {
                return (
                  <ScorecardItem
                    key={task.id}
                    className="task-list-item"
                    userId={userId}
                    role={userRole}
                    self={user}
                    users={users}
                    task={task}
                    project={project}
                    onModal={e => onModal(e)}
                    onReview={(userId, companyId, route, dateStart, dateEnd) =>
                      onReview(userId, companyId, route, dateStart, dateEnd)
                    }
                    onDelete={e => onDelete(e)}
                  />
                )
              }
            })}
      </div>
      {data.length >= 15 && (
        <Pagination
          current={currentPage}
          perPage={15}
          total={Math.ceil(length(data) / 15)}
          onChange={e => setCurrentPage(e)}
        />
      )}
    </div>
  )
}

export default memo(ScorecardList)
