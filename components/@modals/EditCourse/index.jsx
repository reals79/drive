import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { isEmpty, equals, split } from 'ramda'
import { Icon, Button, Select } from '@components'
import './EditCourse.scss'

class EditCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formValues: {
        name: props.card.data.name,
        description: props.card.data.description,
      },
      dueDate: isEmpty(props.card.due_at)
        ? moment(split(' ', props.card.updated_at)[0]).add(
            Number(props.card.data.estimated_completion),
            'days'
          )
        : moment(split(' ', props.card.due_at)[0]),
      submitted: false,
      userIds: [props.userId],
      selectedAssignees: props.assignees,
    }
    this.handleDateSelected = this.handleDateSelected.bind(this)
  }

  handleDateSelected(dueDate) {
    this.setState({ dueDate })
  }

  handleSelect(e) {
    const users = []
    e.forEach(element => {
      users.push(element.value)
    })
    this.setState({ userIds: users, selectedAssignees: e })
  }

  handleChange(e) {
    let formValues = this.state.formValues
    const name = e.target.name
    const value = e.target.value
    formValues[name] = value
    this.setState({ formValues })
  }

  handleSubmit() {
    const { formValues, dueDate, userIds } = this.state
    const { card } = this.props
    const status =
      card.data.status < 3 ? (moment().unix() > dueDate.unix() ? 2 : 0) : card.data.status
    this.setState({ submitted: true })
    if (formValues['name'].length < 5) return
    if (formValues['description'].length < 5) return

    const data = {
      ...card.data,
      name: formValues['name'],
      description: formValues['description'],
      due_date: dueDate.unix(),
      users: userIds,
    }
    const payload = {
      ...card,
      data,
      due_at: dueDate.format('YYYY-MM-DD HH:mm:ss'),
      status,
    }
    this.props.onUpdate(payload)
    this.props.onClose()
  }

  getValidationState(e) {
    const length = e.length
    if (!this.state.submitted) return null
    if (length >= 5) return 'success'
    else if (length > 0) return 'warning'
    else return 'error'
  }

  render() {
    const { selectedAssignees, formValues, dueDate, submitted } = this.state
    const { employees } = this.props
    return (
      <div className="edit-course-modal modal-content">
        <div className="modal-header text-center bg-primary text-white">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={17} />
          <span>Edit Course</span>
          <button type="button" className="close" onClick={() => this.props.onClose()}>
            <Icon name="fal fa-times" color="white" size={20} />
          </button>
        </div>
        <div className="modal-body p-4">
          <Row>
            <Col xs={12} className="pt-2">
              <Form.Group
                controlId="formInputTitle"
                validationState={this.getValidationState(formValues['name'])}
              >
                <Form.Label className="dsl-d12 text-400">Course Title</Form.Label>
                <Form.Control
                  className="course-input"
                  name="name"
                  value={formValues['name']}
                  placeholder="Type here..."
                  onChange={e => this.handleChange(e)}
                />
                <Form.Control.Feedback />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="pt-2">
              <Form.Group
                controlId="formInputDescription"
                validationState={this.getValidationState(formValues['description'])}
              >
                <Form.Label className="dsl-d12 text-400">Course Description</Form.Label>
                <Form.Control
                  as="textarea"
                  className="course-input desc"
                  name="description"
                  value={formValues['description']}
                  placeholder="Type here..."
                  onChange={e => this.handleChange(e)}
                />
                <Form.Control.Feedback />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="pt-2">
              <p className="dsl-d12 due">Due Date:</p>
              <div className="date-box">
                <Icon name="fal fa-calendar-alt" color="#376CAF" size={14} />
                <DatePicker
                  name="due_date"
                  value={dueDate.format('MM/DD/YYYY')}
                  selected={dueDate}
                  onSelect={this.handleDateSelected}
                  placeholderText="Select"
                  shouldCloseOnSelect
                  preventOpenOnFocus
                />
                <Icon name="fal fa-angle-down" color="#376CAF" size={18} />
              </div>
            </Col>
          </Row>
          <Row className="pt-2">
            <Col xs={12} className="pt-2">
              <Select
                name="multiselect"
                isMulti
                isSearchable
                maxMenuHeight={150}
                value={selectedAssignees}
                itemLabel="label"
                itemValue="value"
                options={employees}
                renderHeader={<p className="dsl-d12">Assign to:</p>}
                renderIcon={<Icon name="fal fa-user-plus" size={14} color="#376caf" />}
                onChange={e => this.handleSelect(e)}
              />
            </Col>
          </Row>
        </div>
        <Row className="modal-footer mx-0 pb-4">
          <Button
            className="ml-3"
            name="Update Course"
            disabled={submitted && !equals('success', this.getValidationState(formValues['name']))}
            onClick={() => this.handleSubmit()}
          />
        </Row>
      </div>
    )
  }
}

EditCourse.propTypes = {
  employees: PropTypes.array,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

EditCourse.defaultProps = {
  employees: [],
  onUpdate: () => {},
}

export default EditCourse
