import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { filter, isEmpty, isNil } from 'ramda'
import { toast } from 'react-toastify'
import { Button, Dropdown, Icon, Input } from '@components'
import './AddNewProject.scss'

class AddNewProject extends Component {
  state = {
    formValues: { name: '', description: '' },
    selectedEmployees: [this.props.userId],
    submitted: false,
  }

  handleSelect = e => {
    this.setState({ selectedEmployees: e })
  }

  handleChange = e => v => {
    const { formValues } = this.state
    formValues[e] = v
    this.setState({ formValues })
  }

  handleSubmit = () => {
    const { formValues, selectedEmployees } = this.state

    if (isEmpty(formValues['name']) || isEmpty(formValues['description'])) {
      toast.warn('Oops, The required information is missing', {
        position: toast.POSITION.TOP_CENTER,
      })
    }

    this.setState({ submitted: true })
    if (formValues['name'].length < 5) return
    if (formValues['description'].length < 5) return

    const payload = {
      data: {
        name: formValues.name,
        description: formValues.description,
        users: selectedEmployees,
      },
    }
    this.props.onAdd(payload)
  }

  render() {
    const { formValues, submitted } = this.state
    const { employees, userId } = this.props
    const employee = filter(item => !isNil(item.id), employees)

    return (
      <div className="add-new-project">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={14} />
          <span className="dsl-w14">Add Project</span>
        </div>
        <div className="modal-body">
          <Input
            title="Project name"
            value={formValues['name']}
            placeholder="Type here..."
            direction="vertical"
            onChange={this.handleChange('name')}
          />
          <Input
            className="mt-3"
            title="Project description"
            as="textarea"
            rows={5}
            value={formValues['description']}
            placeholder="Type here..."
            direction="vertical"
            onChange={this.handleChange('description')}
          />
          <div className="mt-3">
            <Dropdown
              className="mt-3"
              multi
              title="Participating employees"
              width="fit-content"
              data={employee}
              direction="vertical"
              defaultIds={[userId]}
              getId={e => e['id']}
              getValue={e => `${e['profile']['first_name']} ${e['profile']['last_name']}`}
              onChange={this.handleSelect}
            />
          </div>
        </div>
        <div className="modal-footer mx-0 pb-4">
          <Button name="ADD PROJECT" disabled={submitted && isEmpty(formValues['name'])} onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddNewProject.propTypes = {
  employees: PropTypes.array,
  userId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}

AddNewProject.defaultProps = {
  userId: null,
  employees: [],
  onAdd: () => {},
}

export default AddNewProject
