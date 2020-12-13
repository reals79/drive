import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty } from 'ramda'
import { toast } from 'react-toastify'
import { Icon, Button, Input, Dropdown } from '@components'
import './EditProject.scss'

class EditProject extends Component {
  state = {
    formValues: {
      name: this.props.project.name,
      description: this.props.project.data.description || '',
    },
    submitted: false,
    userId: this.props.project.data.users || [],
    selectedEmployees: this.props.project.users || [],
  }

  handleSelect = e => {
    this.setState({ selectedEmployees: e })
  }

  handleChange = (e, value) => {
    const { formValues } = this.state
    formValues[e] = value
    this.setState({ formValues })
  }

  handleDelete = () => {
    const payload = {
      type: 'Confirm',
      data: {
        before: {
          title: 'Delete',
          body:
            'This will delete the project and all the associated tasks. This cannot be undone. Are you sure?',
        },
      },
      callBack: {
        onYes: () => this.props.onDelete(this.props.project.id),
      },
    }
    this.props.onClose()
    this.props.onModal(payload)
  }

  handleSubmit = () => {
    const { formValues, selectedEmployees } = this.state
    const { project } = this.props

    if (isEmpty(formValues['name']) || isEmpty(formValues['description'])) {
      toast.warn('Oops, The required information is missing', {
        position: toast.POSITION.TOP_CENTER,
      })
    }

    this.setState({ submitted: true })
    if (formValues['name'].length < 5) return
    if (formValues['description'].length < 5) return

    const payload = {
      ...project,
      data: {
        name: formValues.name,
        description: formValues.description,
        users: selectedEmployees,
      },
    }
    this.props.onUpdate(payload)
  }

  getValidationState = e => {
    const length = e.length
    if (!this.state.submitted) return null

    if (length >= 5) return 'success'
    else if (length > 0) return 'warning'
    else return 'error'
  }

  render() {
    const { formValues, submitted, userId } = this.state
    const { employees } = this.props
    return (
      <div className="edit-project">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={14} />
          <span className="dsl-w14">Edit Project</span>
        </div>
        <div className="modal-body">
          <Input
            title="Project name"
            value={formValues['name']}
            placeholder="Type here..."
            direction="vertical"
            onChange={this.handleChange.bind(this, 'name')}
          />
          <Input
            className="mt-3"
            title="Project description"
            as="textarea"
            rows={5}
            value={formValues['description']}
            placeholder="Type here..."
            direction="vertical"
            onChange={this.handleChange.bind(this, 'description')}
          />
          <div className="mt-3">
            <Dropdown
              className="mt-3"
              multi
              title="Participating employees"
              width="fit-content"
              data={employees}
              direction="vertical"
              defaultIds={userId}
              getId={e => e['id']}
              getValue={e => `${e['name']}`}
              onChange={this.handleSelect}
            />
          </div>
        </div>

        <div className="modal-footer mx-0 pb-4">
          <Button type="link" name="Delete" onClick={() => this.handleDelete()} />
          <Button
            className="ml-3"
            name="Update Project"
            disabled={submitted && !equals('success', this.getValidationState(formValues['name']))}
            onClick={() => this.handleSubmit()}
          />
        </div>
      </div>
    )
  }
}

EditProject.propTypes = {
  employees: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

EditProject.defaultProps = {
  employees: [],
  onModal: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  onClose: () => {},
}

export default EditProject
