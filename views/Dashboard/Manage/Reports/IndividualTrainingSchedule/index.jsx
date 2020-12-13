import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, isEmpty, isNil, propEq, path } from 'ramda'
import { ErrorBoundary, Filter } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import AddSchedule from './AddSchedule'
import EditSchedule from './EditSchedule'
import './IndividualTrainingSchedule.scss'

class IndividualTrainingSchedule extends Component {
  constructor(props) {
    super(props)

    const { userId, company, trainingSchedules, employees } = props
    const id = Number(props.match.params.id)
    const editable = path(['state', 'editable'], props.location) || false
    const card = path(['state', 'schedule'], props.location)
    const schedule = find(propEq('id', id), trainingSchedules.data) || card
    const scheduleUser = isNil(schedule) ? {} : find(propEq('id', schedule.user_id), employees) || {}

    this.state = { userId, company, schedule, scheduleUser, editable }

    if (!isNil(schedule)) {
      this.props.getScheduleDetail(schedule)
    }
    if (isNil(props.userAuthors) || isEmpty(props.userAuthors)) {
      this.props.getAuthorlist()
    }
  }

  handleFilter = (type, e) => {
    if (!isEmpty(e)) {
      if (type === 'assignee') {
        this.setState({ userId: e[0].id })
      } else {
        this.setState({ company: e[0] })
      }
    }
  }

  render() {
    const { userId, company, schedule, editable } = this.state
    const { employees, globalCompanies, scheduleDetail, userAuthors, userRole, competencies } = this.props

    return (
      <ErrorBoundary className="report-training-schedule-detail" dataCy="trainingSchedules">
        <Filter
          mountEvent
          backTitle="all training schedules"
          onBack={() => this.props.history.push(`/hcm/report-training-schedule`)}
          onChange={this.handleFilter}
          dataCy="trainingScheduleTopFilter"
        />
        {isNil(schedule) ? (
          <AddSchedule
            admin={true}
            userId={userId}
            authors={userAuthors}
            companyId={company.id}
            companies={globalCompanies}
            employees={employees}
            onModal={e => this.props.toggleModal(e)}
            onSave={e => this.props.saveSchedule(e)}
            onSelectCompany={e => this.props.selectCompany()}
          />
        ) : (
          <EditSchedule
            editable={editable}
            userId={userId}
            userRole={userRole}
            authors={userAuthors}
            data={scheduleDetail}
            company={company}
            employees={employees}
            competencies={competencies}
            onBack={() => this.props.history.goBack()}
            onModal={e => this.props.toggleModal(e)}
            onSave={e => this.props.saveSchedule(e)}
            onDelete={e => this.props.deleteSchedule(e)}
          />
        )}
      </ErrorBoundary>
    )
  }
}

IndividualTrainingSchedule.propTypes = {
  userId: PropTypes.number,
  userRole: PropTypes.number,
  userAuthors: PropTypes.array,
  company: PropTypes.shape({
    id: PropTypes.number,
  }),
  trainingSchedules: PropTypes.shape({
    current_page: PropTypes.number,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.array,
  }),
  employees: PropTypes.array,
  competencies: PropTypes.array,
  globalCompanies: PropTypes.array,
  selectCompany: PropTypes.func,
  toggleModal: PropTypes.func,
  saveSchedule: PropTypes.func,
  deleteSchedule: PropTypes.func,
}

IndividualTrainingSchedule.defaultProps = {
  userId: 0,
  userRole: 1,
  userAuthors: [],
  company: {
    id: 0,
  },
  trainingSchedules: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    data: [],
  },
  employees: [],
  competencies: [],
  globalCompanies: [],
  selectCompany: () => {},
  toggleModal: () => {},
  saveSchedule: () => {},
  deleteSchedule: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  userRole: state.app.app_role_id,
  userAuthors: state.app.userAuthors,
  company: state.app.company_info,
  employees: state.app.employees,
  globalCompanies: state.app.companies,
  competencies: state.app.competencies,
  trainingSchedules: state.develop.trainingSchedules,
  scheduleDetail: state.develop.trainingScheduleDetail,
})

const mapDispatchToProps = dispatch => ({
  saveSchedule: e => dispatch(DevActions.librarysaveRequest(e)),
  deleteSchedule: e => dispatch(DevActions.libraryeventRequest(e)),
  getScheduleDetail: e => dispatch(DevActions.trainingscheduledetailRequest(e)),
  selectCompany: () => dispatch(AppActions.postmulticompanydataRequest()),
  getAuthorlist: () => dispatch(AppActions.getauthorsRequest()),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTrainingSchedule)
