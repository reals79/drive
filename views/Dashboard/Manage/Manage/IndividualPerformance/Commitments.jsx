import React from 'react'
import moment from 'moment'
import classNames from 'classnames'
import { equals, find, propEq, isNil } from 'ramda'
import { Avatar, CheckBox, EditDropdown, Icon, Thumbnail } from '@components'
import { RecurringType, PerforamnceCommitMenu } from '~/services/config'
import './IndividualPerformance.scss'

const Task = ({ role, task, projects, users, yellow = false, onSelect }) => {
  const { data, status, project_id, user_id } = task
  const { name, due_date, approval_id, schedule_interval, user_name } = data
  const completed = equals(status, 3)
  const dueDate = moment.unix(due_date).format('M/D/YY')
  const user = find(propEq('id', user_id), users) || {}
  const avatar = isNil(user) ? '' : user.profile.avatar
  const isTask = equals(data.type, 'single')
  const project = find(propEq('id', project_id), projects)
  let type = isNil(project_id) ? 'General' : (project && project.name) || 'General'
  if (!isTask) type = RecurringType[schedule_interval || 'month'].label
  else if (!isNil(approval_id)) type = `${type} (Requested by ${user_name})`

  return (
    <div className={classNames('performance-commitments-item', yellow && 'bg-yellow')}>
      <div className="d-flex d-flex-1 align-items-center cursor-pointer" onClick={() => onSelect('detail view')}>
        <CheckBox className="my-auto mr-2" size="regular" checked={completed} disabled />
        <div className="d-flex-1 ml-2">
          <span className="dsl-m12 text-400">{type}</span>
          <p className={classNames('dsl-b12 truncate-two mb-0', completed && 'text-line-through')}>{name}</p>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="avatar-section">
          <Avatar url={avatar} type="logo" />
          <div className="d-flex align-items-center mt-1">
            {equals(status, 2) && <Icon name="fas fa-exclamation-triangle mr-1" color="#ff0000" size={10} />}
            <span className={status == 2 ? 'dsl-r12' : 'dsl-b12'}>{dueDate}</span>
          </div>
        </div>
        <div className="edit">
          <EditDropdown options={PerforamnceCommitMenu[role]} onChange={onSelect} />
          {yellow && <Icon name="fas fa-info-circle" color="#ff0000" size={14} />}
        </div>
      </div>
    </div>
  )
}

const Training = ({ role, training, users, yellow = false, onSelect }) => {
  const { data, status, due_at, user_id } = training
  const { thumb_url, name, due_date } = data
  const completed = equals(status, 3)
  const dueDate = isNil(due_at) ? moment.unix(due_date).format('M/D/YY') : moment(due_at).format('M/D/YY')
  const user = find(propEq('id', user_id), users) || {}
  const avatar = isNil(user) ? '' : user.profile.avatar

  return (
    <div className={classNames('performance-commitments-item', yellow && 'bg-yellow')}>
      <div className="d-flex d-flex-1 align-items-center cursor-pointer" onClick={() => onSelect('detail view')}>
        <CheckBox className="my-auto mr-2" size="regular" checked={completed} disabled />
        <Thumbnail src={thumb_url} size="tiny" />
        <div className="d-flex-1 ml-2 mw-10">
          <p className={classNames('dsl-b12 truncate-two mb-0', completed && 'text-line-through')}>{name}</p>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="avatar-section">
          <Avatar url={avatar} type="logo" />
          <div className="mt-1">
            <span className="dsl-b12">{dueDate}</span>
          </div>
        </div>
        <div className="edit">
          <EditDropdown options={PerforamnceCommitMenu[role]} onChange={onSelect} />
          {yellow && <Icon name="fas fa-info-circle" color="#ff0000" size={14} />}
        </div>
      </div>
    </div>
  )
}

export { Task, Training }
