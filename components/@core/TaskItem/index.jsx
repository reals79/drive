import React from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import moment from 'moment'
import { equals, find, includes, isNil, propEq } from 'ramda'
import { Avatar, CheckBox, Icon, EditDropdown } from '@components'
import { RecurringType, TaskDotsType, UserRoles } from '~/services/config'
import { avatarBackgroundColor, localDate } from '~/services/util'
import './TaskItem.scss'

const UnKnownUser = {
  id: 0,
  name: 'UnKnown User',
  profile: {
    avatar: null,
  },
}

class TaskItem extends React.Component {
  state = {
    checked: !isNil(this.props.task.completed_at),
    openedPopup: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { users, self, task } = nextProps

    if ((users && task) || self) {
      const user = find(propEq('id', task.user_id), users) || UnKnownUser
      const avatar = isNil(user) ? '' : user.profile.avatar
      const name = isNil(user) ? '' : user.name
      return { avatar, name }
    }

    return null
  }

  handleCheck = (id, e) => {
    const { role, task, userIds, project } = this.props
    if (role > UserRoles.MANAGER && !includes(task.user_id, userIds)) {
      toast.error('You do not have permission to do that.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }
    if (role > UserRoles.MANAGER && project.name === 'Approval') {
      toast.error(
        'Your Manager must complete this Approval Task in their feed. This copy of the task is a reminder that you sent them a request for approval. It will auto-complete once your manager gives approval.',
        {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        }
      )
      return
    }
    if (e.target.checked && !this.state.checked) {
      this.props.onUpdate('completed', id)
    } else {
      this.props.onUpdate('incompleted', id)
    }
    this.setState({ checked: e.target.checked })
  }

  handleModal = e => {
    const { task, onUpdate, onDelete, role, userIds } = this.props
    let payload = {}
    switch (e) {
      case 'archive': {
        if (role > UserRoles.MANAGER && !includes(task.user_id, userIds)) {
          toast.error('You do not have permission to do that.', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          return
        }
        payload = {
          type: 'Confirm',
          data: {
            before: {
              title: 'Archive',
              body: 'Are you sure you want to archive this item ?',
            },
          },
          callBack: {
            onYes: () => onUpdate('archived', task.id),
          },
        }
        break
      }
      case 'delete': {
        if (role > UserRoles.MANAGER && !includes(task.user_id, userIds)) {
          toast.error('You do not have permission to do that.', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          return
        }
        payload = {
          type: 'Confirm',
          data: {
            before: {
              title: 'Delete',
              body: 'Are you sure you want to delete this item ?',
            },
          },
          callBack: {
            onYes: () => onDelete(task.id),
          },
        }
        break
      }
      case 'edit': {
        const self = isNil(task.assigned_by) || includes(task.assigned_by, userIds)
        const after = this.props.after
          ? this.props.after
          : {
              type: 'FETCHTASKSFEED_REQUEST',
              userId: task.user_id,
              perPage: 500,
              page: 1,
            }
        if (role > UserRoles.MANAGER && !self) {
          toast.error('You do not have permission to do that.', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          return
        }
        payload = {
          type: 'Edit Task',
          data: {
            before: {
              card: task,
              after,
            },
          },
          callBack: null,
        }
        break
      }
      case 'detail view': {
        payload = {
          type: 'Task Detail',
          data: { before: { card: task, after: this.props.after } },
          callBack: null,
        }
        break
      }
      default:
        break
    }
    this.props.onModal(payload)
  }

  handlePopupOpen = () => {
    const { openedPopup } = this.state
    this.setState({ openedPopup: !openedPopup })
  }

  onOutsideClick = () => {
    this.setState({ openedPopup: false })
  }

  render() {
    const { project, className, task, userIds, role, dataCy } = this.props
    const { checked, avatar, openedPopup, name } = this.state

    const isTask = equals(task.data.type, 'single')
    let type = isNil(task.project_id) ? 'General' : project.name
    if (!isTask) {
      type = RecurringType[task.data.schedule_interval || 'month'].label
    } else if (!isNil(task.data.approval_id)) {
      type = `${type} (Requested by ${task.data.user_name})`
    }
    return (
      <div className={classNames('core-task-item', className)} data-cy={dataCy}>
        <CheckBox id={task.id} size="regular" checked={checked} onChange={this.handleCheck.bind(this, task.id)} />
        <div className="task-detail" onClick={this.handleModal.bind(this, 'detail view')}>
          <div className="d-flex mb-1">
            <span className="dsl-m12 text-400">{type}</span>
            {task.data.comments && (
              <Icon name="fas fa-comment ml-2" size={14} active={!includes(task.data.comments_viewed[0], userIds)} />
            )}
          </div>
          <p className={classNames('dsl-b14 mb-0 text-400', checked && ' text-line-through')}>
            {task.data.quota_actual_task === 'yes'
              ? `Save Actuals for ${moment(task.created_at)
                  .subtract(1, 'month')
                  .format('MMMM')}`
              : task.data.name}
          </p>
        </div>
        <div className="avatar-section">
          <Avatar url={avatar} name={name} type="initial" backgroundColor={avatarBackgroundColor(task.user_id)} />
          <div className="d-flex mt-1">
            {isTask && equals(task.status, 2) && (
              <Icon name="fas fa-exclamation-triangle mr-1" color="#ff0000" size={10} />
            )}
            <span className={isTask && equals(task.status, 2) ? 'dsl-r12' : 'dsl-b12'}>
              {isNil(task.due_at)
                ? moment.unix(task.data.due_date).format('M/D/YY')
                : moment(task.due_at).format('M/D/YY')}
            </span>
          </div>
        </div>
        <OutsideClickHandler display="flex" onOutsideClick={this.onOutsideClick}>
          <div className="d-center" onClick={this.handlePopupOpen}>
            <EditDropdown options={TaskDotsType[role]} onChange={this.handleModal} openedPopup={openedPopup} />
          </div>
        </OutsideClickHandler>
      </div>
    )
  }
}

TaskItem.propTypes = {
  className: PropTypes.string,
  userIds: PropTypes.array,
  users: PropTypes.array.isRequired,
}

TaskItem.defaultProps = {
  className: '',
  userIds: [],
  users: [],
}

export default TaskItem
