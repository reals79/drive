import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Row, Col } from 'react-bootstrap'
import { includes, filter, equals } from 'ramda'
import { Avatar, Icon, Button } from '@components'
import { convertUrl, length } from '~/services/util'
import './EmployeeDropdown.scss'

class EmployeeDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: props.selectedUsers || [],
      selectedProps: props.selectedUsers,
    }

    this.handleClearSelection = this.handleClearSelection.bind(this)
    this.handleSelectAllEmployees = this.handleSelectAllEmployees.bind(this)
    this.handleSelectEmployee = this.handleSelectEmployee.bind(this)
    this.handleAddEmployees = this.handleAddEmployees.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { selectedUsers } = props
    const { selectedProps } = state
    if (!equals(selectedUsers, selectedProps)) {
      return {
        selectedProps: selectedUsers,
        selected: selectedUsers,
      }
    }
    return null
  }

  handleSelectEmployee(employeeId) {
    const { selected } = this.state
    if (includes(employeeId, selected)) {
      const newlist = filter(x => x !== employeeId, selected)
      this.setState({ selected: newlist })
    } else {
      selected.push(employeeId)
      this.setState({ selected })
    }
  }

  handleAddEmployees() {
    const { selected } = this.state
    this.props.onSelected(selected)
  }

  handleClearSelection() {
    this.setState({ selected: [] })
  }

  handleSelectAllEmployees() {
    const { employees } = this.props
    const selected = employees.map(e => e.id)
    this.setState({ selected })
  }

  getLabel() {
    const { noLabel, employees, label } = this.props
    const { selected } = this.state
    if (!noLabel) return label
    if (length(employees) == length(selected)) return 'All'
    return `(${length(selected)})`
  }

  render() {
    const { employees, noArrow } = this.props
    const { selected } = this.state

    return (
      <Dropdown id="employee-dropdown" className="employee-dropdown my-3 ml-3" drop="down">
        <Dropdown.Toggle className="dsl-d14 btn-dropdown-toggle">{this.getLabel()}</Dropdown.Toggle>
        <Dropdown.Menu bsPrefix={`employee-dropdown-menu ${noArrow ? 'no-arrow-dropdown' : ''}`}>
          {!noArrow && <div className="arrow" />}
          <p className="dsl-l12 mb-0">Your company employees ({length(employees)})</p>
          <div className="employee-list">
            <Row className="mx-0">
              {employees.map(employee => {
                const { id, profile } = employee
                const url = convertUrl(profile.avatar, '/images/default.png')
                return (
                  <Col
                    key={id}
                    xs={12}
                    sm={6}
                    className="employee-item px-0"
                    onClick={this.handleSelectEmployee.bind(this, id)}
                  >
                    <div className="employee-avatar">
                      <Avatar url={url} type="logo" />
                      {includes(id, selected) && (
                        <div className="selected-employee">
                          <Icon name="fal fa-check" size={20} color="white" />
                        </div>
                      )}
                    </div>
                    <p className="dsl-b14 mb-0 ml-2">
                      {`${profile.first_name} ${profile.last_name}`}
                    </p>
                  </Col>
                )
              })}
            </Row>
          </div>
          <Dropdown.Item as="div" className="d-flex justify-content-end px-0">
            <Button onClick={this.handleAddEmployees}>Add Employeess</Button>
          </Dropdown.Item>
          <Button type="medium" className="btn-clear" onClick={this.handleSelectAllEmployees}>
            Select All
          </Button>
          <Button type="link" className="btn-clear" onClick={this.handleClearSelection}>
            Clear
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

EmployeeDropdown.propTypes = {
  noLabel: PropTypes.bool,
  noArrow: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  employees: PropTypes.array,
  selectedUsers: PropTypes.array,
  onSelected: PropTypes.func,
}

EmployeeDropdown.defaultProps = {
  noLabel: false,
  noArrow: false,
  label: '+ Add Employee',
  employees: [],
  selectedUsers: [],
  onSelected: () => {},
}

export default EmployeeDropdown
