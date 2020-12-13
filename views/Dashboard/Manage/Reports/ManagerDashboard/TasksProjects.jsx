import React, { memo } from 'react'
import { Avatar, Button } from '@components'
import { history } from '~/reducers'
import { avatarBackgroundColor } from '~/services/util'

function TasksProjects(props) {
  const { active_projects, habits_completed, tasks_completed, popular_projects, top_users } = props.data
  const payload = {
    type: 'Add New Task',
    data: { before: {}, after: null },
    callBack: {},
  }

  return (
    <div className="card mb-3 mr-3 custom-width">
      <p className="dsl-b22 bold">Tasks & Projects</p>
      <div className="d-flex">
        <div className="tasks-card d-flex-3 mr-3">
          <p className="dsl-m12 text-400 mb-0">Tasks</p>
          <p className="dsl-m12 text-400 mb-2">Completed</p>
          <p className="dsl-b16 text-400 mb-0">{tasks_completed}</p>
        </div>
        <div className="tasks-card d-flex-4 mr-3">
          <p className="dsl-m12 text-400 mb-0">Habits</p>
          <p className="dsl-m12 text-400 mb-2">Completed</p>
          <p className="dsl-b16 text-400 mb-0">{habits_completed}</p>
        </div>
        <div className="tasks-card d-flex-3">
          <p className="dsl-m12 text-400 mb-0">Active</p>
          <p className="dsl-m12 text-400 mb-2">Projects</p>
          <p className="dsl-b16 text-400 mb-0">{active_projects}</p>
        </div>
      </div>
      <p className="dsl-b18 bold mt-4">Popular Projects</p>
      <div className="px-0 px-md-3">
        <div className="d-flex pb-3 border-bottom">
          <span className="dsl-m12 text-400 d-flex-3">Projects</span>
          <span className="dsl-m12 text-400 d-flex-1 justify-end">Completed</span>
          <span className="dsl-m12 text-400 d-flex-1 justify-end">Past Due</span>
        </div>
        {popular_projects.length > 0 ? (
          popular_projects.map((item, index) => (
            <div className="d-flex align-items-center mt-3" key={`pp${index}`}>
              <div className="d-flex d-flex-3 align-items-center">
                <span className="dsl-b16">{item.project.name}</span>
              </div>
              <div className="d-flex-1 justify-end">
                <span className="dsl-b16 text-400">{item.complete}</span>
              </div>
              <div className="d-flex-1 justify-end">
                <span className="dsl-b16 text-400">{item.past_due}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="dsl-m12 mt-3">No popular projects</p>
        )}
        <div className="d-flex pb-3 mt-4 border-bottom">
          <span className="dsl-m12 text-400 d-flex-3">Most Active Employees</span>
          <span className="dsl-m12 text-400 d-flex-1 d-flex-2 justify-end">Completed Tasks</span>
        </div>
        {top_users.length > 0 ? (
          top_users.map((item, index) => (
            <div className="d-flex align-items-center mt-3" key={`tu${index}`}>
              <div className="d-flex d-flex-3 align-items-center">
                <Avatar
                  size="tiny"
                  type="initial"
                  url={item.user.profile.avatar}
                  name={`${item.user.profile.first_name} ${item.user.profile.last_name}`}
                  backgroundColor={avatarBackgroundColor(item.user.id)}
                />
                <span className="dsl-b16 ml-3">{`${item.user.profile.first_name} ${item.user.profile.last_name}`}</span>
              </div>
              <div className="d-flex-1 justify-end">
                <span className="dsl-b16 text-400">{item.total}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="dsl-m12 text-center mt-3">No active employees</p>
        )}
      </div>
      <div className="justify-end mt-3">
        <Button className="text-400 mr-2" type="low" name="ASSIGN TASK" onClick={() => props.onModal(payload)} />
        <Button
          className="text-400"
          type="medium"
          name="TASK REPORT"
          onClick={() => history.push('/hcm/report-task')}
        />
      </div>
    </div>
  )
}

export default memo(TasksProjects)
