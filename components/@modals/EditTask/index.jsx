import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, length, clone, filter, find, isNil } from 'ramda'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Icon, Upload, Input, Button, Dropdown, DatePicker } from '@components'
import './EditTask.scss'

class EditTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      task: props.task,
      uploadFile: null,
      preview: null,
      userIds: [props.task.user_id],
      projectList: [],
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleProject = this.handleProject.bind(this)
    this.handleDueDate = this.handleDueDate.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { projects, task, companyId } = nextProps
    const compId = task.data.company_id || companyId
    const projectList = filter(project => equals(project.company_id, compId), projects)
    return { projectList }
  }

  handleChange(name, value) {
    const task = clone(this.state.task)
    task.data[name] = value

    this.setState({ task })
  }

  handleProject(e) {
    const task = clone(this.state.task)
    task.project_id = e[0]

    this.setState({ task })
  }

  handleSelect(e) {
    const task = clone(this.state.task)
    const user = find(user => user.id === this.props.task.user_id, e)
    const userId = e.map(user => user.id)
    task.user_id = user ? user.id : e[0].id
    task.feed_id = user ? user.feed_id : e[0].feed_id
    this.setState({ task, userIds: userId })
  }

  handleDrop(file) {
    if (equals(length(file), 0)) return

    this.setState({ preview: file[0].name, uploadFile: file[0] })
  }

  handleDueDate(e) {
    const task = clone(this.state.task)
    const date = moment(e).format('YYYY-MM-DD')
    if (
      moment(date).isBefore(moment(task.due_at).format('YYYY-MM-DD')) &&
      moment(date).isBefore(moment().format('YYYY-MM-DD'))
    ) {
      toast.error(`Selected Due date ${moment(e).format('YYYY-MM-DD')} is before ${moment().format('YYYY-MM-DD')}`, {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    } else {
      task.due_at = moment(e).format('YYYY-MM-DD')
      task.data.due_date = moment(e).unix()
      if (moment(e) > moment() && equals(task.status, 2)) {
        task.status = 0
      }
      this.setState({ task })
    }
  }

  handleSubmit() {
    if (!equals(this.state.task, this.props.task) && equals(this.state.userIds, [this.props.task.user_id])) {
      const { task, uploadFile } = this.state
      const attachment = {
        attachment_hash: task.data.attachment_hash,
        file: uploadFile,
      }
      const newTask = {
        ...task,
        data: {
          ...task.data,
          attachment: task.data.attachment || [],
        },
      }
      let nextAfter = null
      const userIds = filter(id => id !== this.props.task.user_id, this.state.userIds)
      if (userIds.length > 0) {
        const addPayload = {
          data: {
            name: task.data.name,
            description: task.data.description,
            due_date: moment(task.due_at || moment.unix(task.data.due_date)),
            type: 'single',
          },
          due_at: moment(task.due_at || moment.unix(task.data.due_date)),
          project_id: task.project_id || 166,
        }
        nextAfter = {
          type: 'ADDTASK_REQUEST',
          payload: addPayload,
          users: userIds,
          projectId: task.project_id || 166,
        }
        if (!isNil(uploadFile)) {
          const _payload = {
            attachment_hash: null,
            file,
          }
          this.props.onUpload(_payload)
        }
      }

      const payload = {
        event: 'update',
        cardId: task.id,
        card: newTask,
        attachment,
        after: this.props.after,
        nextAfter,
      }
      this.props.onEdit(payload)
      this.props.onClose()
    }
  }

  render() {
    const { employees, userId } = this.props
    const { task, projectList } = this.state

    return (
      <div className="edit-task-modal modal-content">
        <div className="modal-header text-center bg-primary text-white">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={17} />
          <span>Edit Task</span>
        </div>
        <div className="modal-body">
          <Input
            className="task-input mt-3 mb-4"
            title="Task Title"
            value={task.data.name}
            placeholder="Type here..."
            direction="vertical"
            onChange={this.handleChange.bind(this, 'name')}
          />

          <Input
            className="task-text mb-4"
            title="Task Description"
            placeholder="Type here..."
            direction="vertical"
            as="textarea"
            rows="3"
            value={task.data.description}
            onChange={this.handleChange.bind(this, 'description')}
          />

          <Dropdown
            className="mb-4"
            title="Project"
            direction="vertical"
            width="fit-content"
            placeholder="Select"
            defaultIds={[task.project_id || 166]}
            data={projectList}
            getValue={e => e.name}
            onChange={this.handleProject}
          />

          <DatePicker
            title="Due date"
            direction="vertical"
            value={moment(task.due_at || moment.unix(task.data.due_date))}
            format="MMM DD, YY"
            fontColor="secondary"
            calendar="day"
            append="caret"
            as="span"
            append="caret"
            className="mb-4 dsl-font"
            onSelect={this.handleDueDate}
          />

          <Dropdown
            multi
            className="mb-4 dsl-font"
            title="Assign to"
            width="fit-content"
            data={employees}
            direction="vertical"
            returnBy="data"
            defaultIds={[userId]}
            getValue={e => e['name']}
            onChange={this.handleSelect}
          />

          <p className="dsl-m12 mb-0">Uploads</p>
          <div className="d-flex">
            <Upload size={14} multiple={false} color="#376caf" title="Upload File" onDrop={this.handleDrop} />
          </div>
        </div>
        <div className="modal-footer mx-0 pb-4">
          <div className="d-flex mb-1 justify-content-end align-items-center">
            <Button
              className="ml-auto core-button medium size-small btn btn-primary"
              name="Cancel"
              type="link"
              onClick={() => this.props.onClose()}
            />
            <Button name="Update Task" onClick={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

EditTask.propTypes = {
  userId: PropTypes.number.isRequired,
  companyId: PropTypes.number.isRequired,
  employees: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  task: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

EditTask.defaultProps = {
  userId: 0,
  companyId: 0,
  employees: [],
  projects: [],
  task: {},
  onEdit: () => {},
  onUpload: () => {},
  onClose: () => {},
}

export default EditTask
