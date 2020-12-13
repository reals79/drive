import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Dropdown } from 'react-bootstrap'
import { length } from 'ramda'
import moment from 'moment'
import { Icon, Thumbnail, CustomDatePicker, EmployeeDropdown } from '@components'
import './TrainingCourse.scss'

const TrainingCourseItem = ({
  course,
  employees,
  noDueDate,
  minDate,
  maxDate,
  onSelectDueDate,
  onUpdateUsers,
  onMenuEvent,
}) => (
  <Row className="mx-0 training-course-item">
    <Col xs={7} className="course-detail">
      <Thumbnail src={course.data.thumb_url} size="tiny" />
      <div className="pl-2">
        <p className="dsl-b14 mb-5 truncate-one">{course.name}</p>
        <p className="dsl-b12 mb-0 truncate-two">{course.data.description}</p>
      </div>
    </Col>
    <Col xs={1}>
      <EmployeeDropdown
        noCaret
        selectedUsers={course.data.users}
        label={length(course.data.users)}
        employees={employees}
        onSelected={e => onUpdateUsers(e)}
      />
    </Col>
    <Col xs={1}>
      <p className="dsl-b14 mb-0">
        0/
        {length(course.children)}
      </p>
    </Col>
    <Col xs={1}>
      <p className="dsl-b14 mb-0">0</p>
    </Col>
    <Col xs={1}>
      {noDueDate ? (
        <CustomDatePicker
          right
          format="M/D/YY"
          placeholder="no date"
          minDate={minDate}
          maxDate={maxDate}
          onSelect={e => onSelectDueDate(course.id, e)}
        />
      ) : (
        <p className="dsl-b14 mb-0">{moment(course.data.due_date).format('M/D/YY')}</p>
      )}
    </Col>
    <Col xs={1}>
      <Dropdown
        id="course-dropdown"
        className="border-0"
        onSelect={eventKey => onMenuEvent(eventKey)}
      >
        <Dropdown.Toggle className="border-0 bg-none p-5">
          <Icon name="fal fa-ellipsis-h" color="#969faa" size={25} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="remove">Remove</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  </Row>
)

TrainingCourseItem.propTypes = {
  course: PropTypes.any,
  employees: PropTypes.array,
  noDueDate: PropTypes.bool,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  onSelectDueDate: PropTypes.func,
  onUpdateUsers: PropTypes.func,
  onMenuEvent: PropTypes.func,
}

TrainingCourseItem.defaultProps = {
  course: {},
  employees: [],
  noDueDate: false,
  minDate: null,
  maxDate: null,
  onSelectDueDate: () => {},
  onUpdateUsers: () => {},
  onMenuEvent: () => {},
}

const mapStateToProps = state => ({
  employees: state.manage.managerEmployees,
})

export default connect(mapStateToProps, null)(TrainingCourseItem)
