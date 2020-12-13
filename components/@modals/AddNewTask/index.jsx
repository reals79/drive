import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { filter, findIndex, isEmpty, isNil, propEq } from 'ramda'
import moment from 'moment'
import { Dropdown, DatePicker, Button, Icon, Input, Upload } from '@components'
import './AddNewTask.scss'

class AddNewTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formValues: { name: '', description: '' },
      file: null,
      userIds: props.userIds,
      projects: [],
      dueDate: moment(),
      selectedCompany: props.companyId,
      selectedProject: -1,
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDueDate = this.handleDueDate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleProject = this.handleProject.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleDueDate(e) {
    if (this.state.dueDate !== e) {
      this.setState({ dueDate: e })
      this.props.onChange()
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let defaultProjectIndex = 1
    let selectedProject = -1
    let projectsData = []

    if (nextProps.projects !== prevState.projects) {
      const { projects, companyId, projectId } = nextProps
      if (!isNil(projects) && !isEmpty(projects)) {
        projectsData = filter(project => project.company_id === companyId, projects)

        defaultProjectIndex = findIndex(propEq('name', 'General'), projectsData)
        if (defaultProjectIndex < 0) defaultProjectIndex = 0
        selectedProject = projectId
          ? projectId
          : prevState.selectedProject !== -1
          ? prevState.selectedProject
          : projectsData[defaultProjectIndex].id
      }
      return {
        selectedProject,
        defaultProjectIndex,
        projects: projectsData,
      }
    }

    return null
  }

  handleSelect(e) {
    this.setState({ userIds: e })
  }

  handleChange(name, value) {
    let formValues = this.state.formValues

    formValues[name] = value
    this.setState({ formValues })
    if (!isEmpty(this.state.formValues['name']) || !isEmpty(this.state.formValues['description'])) {
      this.props.onChange()
    }
  }

  handleDrop(file) {
    this.setState({ file: file[0] })
    this.props.onChange()

    const _payload = {
      attachment_hash: null,
      file: file[0],
    }
    this.props.onUpload(_payload)
  }

  handleProject(e) {
    this.setState({ selectedProject: e[0] })
    this.props.onChange()
    this.props.onSelectProject(e[0])
  }

  handleSubmit() {
    const { callback } = this.props
    const { formValues, userIds, selectedProject, file, dueDate } = this.state
    const momentObj = moment.isMoment(dueDate) ? dueDate : moment(new Date(dueDate))

    if (callback.onAdd) {
      callback.onAdd({
        name: formValues.name,
        description: formValues.description,
        due_date: momentObj.format('YYYY-MM-DD'),
        project_id: selectedProject,
        user_id: userIds,
      })
    } else {
      const payload = {
        data: {
          name: formValues.name,
          description: formValues.description,
          due_date: momentObj.format('YYYY-MM-DD'),
          type: 'single',
        },
        due_at: momentObj.format('YYYY-MM-DD'),
        project_id: selectedProject,
      }

      this.props.onAdd(payload, userIds, selectedProject)

      if (!isNil(file)) {
        const _payload = {
          attachment_hash: null,
          file,
        }
        this.props.onUpload(_payload)
      }
    }
    this.props.onClose()
  }

  render() {
    const { projects, formValues, dueDate } = this.state
    const { employees, userIds, selectedProject } = this.props

    return (
      <div className="add-task-modal">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={16} />
          <span className="dsl-w16">Add Task</span>
        </div>
        <div className="modal-body">
          <Dropdown
            title="Project"
            dataCy="hcm-task-project-AddTaskProject"
            direction="vertical"
            width="fit-content"
            placeholder="Select"
            defaultIds={[selectedProject]}
            data={projects}
            getValue={e => e['name']}
            onChange={this.handleProject}
          />
          <Input
            className="task-input my-3"
            title="Task Title"
            dataCy="hcm-task-project-AddTaskTitle"
            value={formValues['name']}
            placeholder="Type here..."
            direction="vertical"
            onChange={this.handleChange.bind(this, 'name')}
          />
          <Input
            className="task-text"
            title="Task Description"
            dataCy="hcm-task-project-AddTaskDescription"
            placeholder="Type here..."
            direction="vertical"
            as="textarea"
            value={formValues['description']}
            onChange={this.handleChange.bind(this, 'description')}
          />
          <DatePicker
            className="mt-3"
            title="Due date"
            dataCy="hcm-task-project-AddTaskDueDate"
            direction="vertical"
            value={dueDate}
            format="MMM DD, YY"
            fontColor="secondary"
            calendar="day"
            as="span"
            append="caret"
            closeAfterSelect
            onSelect={this.handleDueDate}
          />

          <Dropdown
            className="mt-3"
            multi
            title="Assign to"
            dataCy="hcm-task-project-AddTaskAssignTo"
            width="fit-content"
            data={employees}
            direction="vertical"
            defaultIds={userIds}
            getValue={e => e['name']}
            onChange={this.handleSelect}
          />

          <p className="dsl-m12 mt-3 mb-0">Uploads</p>
          <Upload title="UPLOAD FILE" icon="fal fa-file-import" color="#376caf" size={14} onDrop={this.handleDrop} />
        </div>
        <div className="modal-footer mx-0 pb-4">
          <Button name="ADD TASK" dataCy="hcm-task-project-AddTaskBtn" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddNewTask.propTypes = {
  companies: PropTypes.array.isRequired,
  companyId: PropTypes.number.isRequired,
  employees: PropTypes.array.isRequired,
  projectId: PropTypes.number,
  projects: PropTypes.array.isRequired,
  userIds: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  selectedProject: state.app.selectedProject,
})

export default connect(mapStateToProps, null)(AddNewTask)
