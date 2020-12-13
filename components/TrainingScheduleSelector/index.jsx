import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { length, equals } from 'ramda'
import { Dropdown, Input, Button, DatePicker } from '@components'
import AppActions from '~/actions/app'
import { TrainingCourseHeader, TrainingCourseItem } from '../TrainingCourse'
import './TrainingScheduleSelector.scss'

const TrainingScheduleSelector = ({
  title,
  startDate,
  endDate,
  selectedWeek,
  onInputTitle,
  onSelectDate,
  onSelectDueDate,
  employees,
  onSelectEmployee,
  companies,
  selectedCompany,
  onSelectCompany,
  toggleModal,
  onAddCourses,
  selectedCourses,
  selectedEmployees,
  onUpdateCourseUsers,
  onCourseEvent,
  admin,
}) => (
  <div className="training-schedule-selector">
    <div className="d-flex justify-content-between align-items-center">
      <p className="dsl-b18 text-500 mb-0">Add Training Schedule</p>
    </div>
    <Row className="mx-0">
      <Col xs={12} className="px-0 schedule-title-input">
        <Input
          className="title-input-form my-3"
          title="Title"
          value={title}
          type="text"
          placeholder="Type here..."
          as="textarea"
          onChange={e => onInputTitle(e)}
        />
      </Col>
    </Row>
    <Row className="mx-0">
      <Col xs={12} sm={10} md={9} className="px-0 schedule-date-selector">
        <Col xs={6}>
          <DatePicker
            title="Date range"
            className="schedule-date-picker"
            value={startDate}
            append="caret"
            as="input"
            align="left"
            format="M/D/YY"
            onSelect={e => onSelectDate(e)}
            calendar="range"
          />
        </Col>
        <Col xs={6}>
          <div className="week-selector">
            <p className="dsl-m12 mb-0">Weeks to accomplish:</p>
            <p className="dsl-d13 my-1">{selectedWeek}</p>
          </div>
        </Col>
      </Col>
    </Row>
    <Row className="mx-0 assign-training">
      <Col xs={12} className="px-0 add-employees">
        {admin && (
          <Dropdown
            className="training-company-selector"
            multi
            title="Comapny"
            direction="vertical"
            width="fit-content"
            data={companies}
            getValue={companies => companies['name']}
            onChange={onSelectCompany}
            placeholder="Select Multiple"
          />
        )}
        <Dropdown
          className="training-employee-selector ml-4"
          multi
          title="Assignee"
          direction="vertical"
          width="fit-content"
          data={employees}
          getValue={employees => `${employees.profile.first_name} ${employees.profile.last_name}`}
          placeholder="Select Multiple"
          onChange={e => onSelectEmployee(e)}
        />
      </Col>
      <Col xs={12} className="px-0">
        {length(selectedCourses) > 0 && (
          <>
            <p className="dsl-d12 assign-label">Assign training</p>
            <TrainingCourseHeader />
            {selectedCourses.map(course => (
              <TrainingCourseItem
                key={course.id}
                course={course}
                noDueDate
                minDate={startDate}
                maxDate={endDate}
                onSelectDueDate={(id, e) => onSelectDueDate(id, e)}
                onUpdateUsers={e => onUpdateCourseUsers(course.id, e)}
                onMenuEvent={e => onCourseEvent(e, course.id)}
              />
            ))}
          </>
        )}
        <Button
          type="low"
          size="small"
          variant="link"
          className="px-0 fr disable-add-course"
          onClick={() =>
            toggleModal({
              type: 'Attach Library',
              data: { before: {}, after: {} },
              callBack: { onAttach: e => onAddCourses(e) },
            })
          }
          disabled={equals(selectedWeek, '0')}
          name="+ Add Courses"
        />
      </Col>
    </Row>
  </div>
)

TrainingScheduleSelector.propTypes = {
  title: PropTypes.string,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  selectedWeek: PropTypes.string,
  selectedCompany: PropTypes.number,
  companies: PropTypes.array,
  onInputTitle: PropTypes.func,
  onSelectDate: PropTypes.func,
  onSelectDueDate: PropTypes.func,
  onSelectEmployee: PropTypes.func,
  toggleModal: PropTypes.func,
  onAddCourses: PropTypes.func,
  onUpdateCourseUsers: PropTypes.func,
  onCourseEvent: PropTypes.func,
}

TrainingScheduleSelector.defaultProps = {
  title: '',
  startDate: null,
  endDate: null,
  selectedWeek: '',
  employees: [],
  companies: [],
  selectedCompany: 0,
  onInputTitle: () => {},
  onSelectDate: () => {},
  onSelectDueDate: () => {},
  onSelectEmployee: () => {},
  toggleModal: () => {},
  onAddCourses: () => {},
  onUpdateCourseUsers: () => {},
  onCourseEvent: () => {},
}

const mapStateToProps = state => ({
  companies: state.app.companies,
  employees: state.app.employees,
})

const mapDispatchToProps = dispatch => ({
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TrainingScheduleSelector)
