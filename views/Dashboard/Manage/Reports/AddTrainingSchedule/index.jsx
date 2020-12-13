import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clone, concat, equals, find, findIndex, isEmpty, isNil, propEq, remove, without } from 'ramda'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Button, ErrorBoundary, Filter, TrainingScheduleSelector, TrainingWeeks } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { WeekSelectors } from '~/services/config'
import './AddTrainingSchedule.scss'

class AddTrainingSchedule extends Component {
  state = {
    title: '',
    startDate: null,
    endDate: null,
    selectedWeek: 0,
    selectedEmployees: [],
    selectedCourses: [],
    assignedCourses: [],
    selectedCompany: [],
    selectedCompanyInd: 0,
  }

  handleInputTitle(e) {
    this.setState({ title: e })
  }

  handleSelectDate(e) {
    const { endDate } = this.state
    if (!isNil(e.endDate)) {
      const startDateObj = moment(new Date(e.start))
      const endDateObj = moment(new Date(e.end))
      const week = Math.ceil(endDateObj.diff(startDateObj, 'weeks', true))
      this.setState({ selectedWeek: week, endDate })
    }

    this.setState({ startDate: e.start, endDate: e.end })
  }

  handleSelectEmployee(e) {
    this.setState({ selectedEmployees: e })
  }

  handleSelectCompany(e) {
    this.props.fetchCompanyUsers()
    this.setState({ selectedCompany: e })
  }

  handleAddCourse(e) {
    const { selectedEmployees, selectedCourses } = this.state

    const courses = e.map(course => {
      return {
        ...course,
        data: {
          ...course.data,
          users: clone(selectedEmployees),
          company_id: this.state.selectedCompany,
        },
      }
    })
    const newCourses = concat(selectedCourses, courses)
    this.setState({ selectedCourses: newCourses })
  }

  handleSelectedCourseEvent(e, courseId) {
    const { selectedCourses } = this.state
    if (e === 'remove') {
      const ind = findIndex(propEq('id', courseId), selectedCourses)
      if (ind > -1) {
        const newCourses = remove(ind, 1, selectedCourses)
        this.setState({ selectedCourses: newCourses })
      }
    }
  }

  handleAssignedCourseEvent(e, courseId) {
    const { selectedCourses, assignedCourses } = this.state
    if (e === 'remove') {
      const ind = findIndex(propEq('id', courseId), assignedCourses)
      if (ind > -1) {
        const course = assignedCourses[ind]
        const newSelectedCourses = concat(selectedCourses, [course])
        const newAssignedCourses = remove(ind, 1, assignedCourses)
        this.setState({ selectedCourses: newSelectedCourses, assignedCourses: newAssignedCourses })
      }
    }
  }

  handleSelectDueDate(courseId, dueDate) {
    const { selectedCourses, assignedCourses } = this.state
    const course = find(propEq('id', courseId), selectedCourses)
    const newSelectedCourses = without([course], selectedCourses)
    assignedCourses.push({
      ...course,
      data: { ...course.data, due_date: dueDate.format('YYYY-MM-DD') },
    })
    this.setState({ selectedCourses: newSelectedCourses, assignedCourses })
  }

  handleUpdateCourseUsers(courseId, users) {
    const { selectedCourses, assignedCourses } = this.state
    const newSelected = selectedCourses.map(course => {
      if (course.id === courseId) return { ...course, data: { ...course.data, users } }
      return { ...course }
    })
    const newAssigned = assignedCourses.map(course => {
      if (equals(course.id, courseId)) return { ...course, data: { ...course.data, users } }
      return { ...course }
    })
    this.setState({ selectedCourses: newSelected, assignedCourses: newAssigned })
  }

  handleSaveSchedule() {
    const { title, assignedCourses, startDate, endDate } = this.state
    const { userId, assignCourses } = this.props
    if (isEmpty(title)) {
      toast.error('Sorry, you are missing the title.', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    const cards = assignedCourses.map(course => ({
      users: course.data.users,
      company_id: course.data.company_id,
      due_date: course.data.due_date,
      card_type: 'course',
      blocked_by: null,
      alert_manager: 0,
      complete_track: 0,
      card_template_id: course.id,
    }))
    const payload = {
      track: {
        user_id: userId,
        title,
        status: 0,
        data: { cards, users: [], category: [], thumb_url: '', competency: [], department: [], days_to_complete: 0 },
        result: null,
        deleted_at: null,
        author_id: 5,
        type: 3,
        completed_at: null,
        designation: 1,
        program_id: null,
        archived: 0,
        description: '',
        start_at: moment(startDate).format('YYYY-MM-DD'),
        end_at: moment(endDate).format('YYYY-MM-DD'),
        thumbnail: '',
      },
    }
    assignCourses(payload)
  }

  render() {
    const {
      title,
      startDate,
      endDate,
      selectedWeek,
      selectedCourses,
      assignedCourses,
      selectedEmployees,
      selectedCompany,
    } = this.state
    const { companies, admin } = this.props
    return (
      <ErrorBoundary className="dev-training-schedule bg-light">
        <Filter aligns={['left', 'right']} backTitle="Training Schedule" onBack={() => this.props.history.goBack()} />
        <TrainingScheduleSelector
          title={title}
          startDate={startDate}
          endDate={endDate}
          companies={companies}
          selectedWeek={WeekSelectors[selectedWeek]}
          selectedCourses={selectedCourses}
          selectedEmployees={selectedEmployees}
          selectedCompany={selectedCompany}
          onSelectDate={e => this.handleSelectDate(e)}
          onInputTitle={e => this.handleInputTitle(e)}
          onSelectCompany={e => this.handleSelectCompany(e)}
          onSelectEmployee={e => this.handleSelectEmployee(e)}
          onAddCourses={e => this.handleAddCourse(e)}
          onSelectDueDate={(id, date) => this.handleSelectDueDate(id, date)}
          onUpdateCourseUsers={(id, e) => this.handleUpdateCourseUsers(id, e)}
          onCourseEvent={(e, id) => this.handleSelectedCourseEvent(e, id)}
          admin={admin}
        />
        {selectedWeek !== 0 && (
          <TrainingWeeks
            weeks={selectedWeek}
            startDate={startDate}
            courses={assignedCourses}
            onUpdateCourseUsers={(id, e) => this.handleUpdateCourseUsers(id, e)}
            onCourseEvent={(e, id) => this.handleAssignedCourseEvent(e, id)}
          />
        )}
        <Button
          className="fr mt-3"
          name="+ ADD TRAINING"
          disabled={!isEmpty(selectedCourses) || selectedWeek === 0}
          onClick={() => this.handleSaveSchedule()}
        />
      </ErrorBoundary>
    )
  }
}

AddTrainingSchedule.propTypes = {
  userId: PropTypes.number,
  companies: PropTypes.array,
  assignCourses: PropTypes.func,
  fetchCompanyUsers: PropTypes.func,
}

AddTrainingSchedule.defaultProps = {
  userId: 0,
  companies: [],
  assignCourses: () => {},
  fetchCompanyUsers: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companies: state.app.companies,
  admin: state.app.app_role_id < 4,
})

const mapDispatchToProps = dispatch => ({
  assignCourses: e => dispatch(MngActions.assigncoursesRequest(e)),
  fetchCompanyUsers: () => dispatch(AppActions.postmulticompanydataRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTrainingSchedule)
