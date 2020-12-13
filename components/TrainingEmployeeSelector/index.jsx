import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { length, isEmpty, propEq, find } from 'ramda'
import { EmployeeDropdown } from '@components'
import './TrainingEmployeeSelector.scss'

const TrainingEmployeeSelector = ({ label, employees, selectedEmployees, onSelected }) => (
  <div className="training-employee-selector ml-2">
    <p className="dsl-m12 mb-0">{`${label} ${
      isEmpty(selectedEmployees) ? '' : `(${length(selectedEmployees)})`
    }:`}</p>
    {!isEmpty(selectedEmployees) && (
      <Row className="selected-employees mx-0">
        {selectedEmployees.map(employeeId => {
          const employee = find(propEq('id', employeeId), employees)
          const { profile } = employee
          return (
            <Col key={employeeId} xs={12} sm={6} md={4} className="px-0">
              <p className="dsl-b14 mb-0">{`${profile.first_name} ${profile.last_name}`}</p>
            </Col>
          )
        })}
      </Row>
    )}
    <EmployeeDropdown
      employees={employees}
      onSelected={e => onSelected(e)}
      selectedUsers={selectedEmployees}
    />
  </div>
)

TrainingEmployeeSelector.propTypes = {
  label: PropTypes.string,
  employees: PropTypes.array,
  selectedEmployees: PropTypes.array,
  onSelected: PropTypes.func,
}

TrainingEmployeeSelector.defaultProps = {
  label: 'Employees',
  employees: [],
  selectedEmployees: [],
  onSelected: () => {},
}

export default memo(TrainingEmployeeSelector)
