import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { equals, find, isEmpty, isNil, propEq } from 'ramda'
import { Avatar, DatePicker, ErrorBoundary, Filter, Icon } from '@components'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { avatarBackgroundColor } from '~/services/util'
import Report from './Report'
import IndividualTrainingPdf from './IndividualTrainingPdf'
import './IndividualTraining.scss'

const moment = extendMoment(originalMoment)

class IndividualTraining extends Component {
  constructor(props) {
    super(props)

    const userId = Number(props.match.params.userId)
    const companyId = Number(props.match.params.companyId)
    const startDate = moment()
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = moment()
      .endOf('month')
      .format('YYYY-MM-DD')
    const company = { id: companyId }
    const user = find(propEq('id', userId), props.employees) || { id: userId }

    this.state = {
      startDate,
      endDate,
      user,
      company,
      userReport: {},
      activeTab: 'manager',
    }

    this.handleNavigation = this.handleNavigation.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.fetchDetails = this.fetchDetails.bind(this)
    this.handlePdf = this.handlePdf.bind(this)
    this.handleTab = this.handleTab.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { trainingReports } = nextProps
    const { user } = prevState
    if (isEmpty(trainingReports.individuals) || isNil(trainingReports.individuals)) {
      return { userReport: {} }
    }
    const userReport = find(propEq('id', user.id), trainingReports.individuals) || {}
    return { userReport }
  }

  componentDidMount() {
    const { company, user, startDate, endDate } = this.state
    this.fetchDetails(company, user, startDate, endDate)
  }

  handleNavigation() {
    this.props.history.goBack()
  }

  handleFilter(type, data) {
    const { company, user, startDate, endDate } = this.state
    if (equals('employee', type)) {
      if (!equals(user.id, data[0].id)) {
        this.fetchDetails(company, data[0], startDate, endDate)
        this.props.history.replace(`/hcm/report-training/${company.id}/${data[0].id}`)
      }
      this.setState({ user: data[0] })
    } else if (equals('company', type)) {
      this.setState({ company: data[0] })
      if (!equals(company.id, data[0].id)) {
        this.fetchDetails(data[0], user, startDate, endDate)
        this.props.history.replace(`/hcm/report-training/${data[0].id}/${user.id}`)
      }
    }
  }

  handleDateChange(e) {
    const { company, user } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.fetchDetails(company, user, startDate, endDate)
    this.setState({ startDate, endDate })
  }

  fetchDetails(company, user, startDate, endDate) {
    this.props.getUserCourseReport(user.id, startDate, endDate)
    const type = 'individual'
    const payload = {
      page: 1,
      per_page: 500,
      date_start: startDate,
      date_end: endDate,
      company_id: [company.id],
    }
    this.props.getReports(payload, type)
  }

  async handlePdf() {
    const { startDate, endDate, userReport, user, activeTab } = this.state
    const { selfsCoursesReport, careerCoursesReport, managerCoursesReport } = this.props
    const date = moment.range(startDate, endDate)
    const data =
      activeTab == 'manager' ? managerCoursesReport : activeTab == 'career' ? careerCoursesReport : selfsCoursesReport
    const tableHeader =
      activeTab == 'manager' ? 'Manager Assigned' : activeTab == 'career' ? 'Career Assigned' : 'Self Assigned'
    const pdfData = {
      date,
      user,
      userReport,
      data,
      activeTab,
      tableHeader,
    }
    const bolb = await IndividualTrainingPdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleTab(activeTab) {
    this.setState({ activeTab })
  }

  render() {
    const { selfsCoursesReport, careerCoursesReport, managerCoursesReport } = this.props
    const { user, userReport, startDate, endDate, activeTab } = this.state
    if (isEmpty(userReport)) return null
    const { manager, career, self, overall } = userReport.report
    const date = moment.range(startDate, endDate)

    return (
      <ErrorBoundary className="individual-reports">
        <Filter backTitle="all trainings" onBack={this.handleNavigation} onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between">
            <span className="dsl-b22 bold">Individual Training Report</span>
            <div className="d-flex justify-content-end">
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM D"
                as="span"
                align="right"
                append="caret"
                value={date}
                onSelect={this.handleDateChange}
              />
              <div className="d-flex justify-content-end cursor-pointer  ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
            </div>
          </div>
          <div className="d-flex mt-4 px-5">
            <div className="d-flex-1">
              <Avatar
                size="medium"
                className="mx-auto"
                url={user.profile.avatar}
                name={user.name}
                type="initial"
                backgroundColor={avatarBackgroundColor(user.id)}
              />
              <p className="dsl-b16 mb-0 mt-3 text-400">{user.name}</p>
            </div>
            <div className="d-flex-1" />
            <div className="d-flex-4">
              <div className="d-flex my-2">
                <div className="d-flex-2" />
                <div className="d-flex-2 text-right dsl-m12">Assigned</div>
                <div className="d-flex-1 text-right dsl-m12">Open</div>
                <div className="d-flex-1 text-right dsl-m12">Past Due</div>
                <div className="d-flex-1 text-right dsl-m12">Complete</div>
              </div>
              <div className="d-flex my-2">
                <div className="d-flex-2 text-right dsl-m12">Manager Assigned</div>
                <div className="d-flex-2 text-right dsl-m12">{manager.courses_assigned.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{manager.courses_incompleted.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{manager.courses_past_due.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{manager.courses_completed.count}</div>
              </div>
              <div className="d-flex my-2">
                <div className="d-flex-2 text-right dsl-m12">Career Assigned</div>
                <div className="d-flex-2 text-right dsl-m12">{career.courses_assigned.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{career.courses_incompleted.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{career.courses_past_due.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{career.courses_completed.count}</div>
              </div>
              <div className="d-flex my-2">
                <div className="d-flex-2 text-right dsl-m12">Self Assigned</div>
                <div className="d-flex-2 text-right dsl-m12">{self.courses_assigned.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{self.courses_incompleted.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{self.courses_past_due.count}</div>
                <div className="d-flex-1 text-right dsl-m12">{self.courses_completed.count}</div>
              </div>
              <div className="d-flex my-2">
                <div className="d-flex-2 text-right dsl-b12 bold">Total Assigned</div>
                <div className="d-flex-2 text-right dsl-b12 bold">{overall.courses_assigned.count}</div>
                <div className="d-flex-1 text-right dsl-b12 bold">{overall.courses_incompleted.count}</div>
                <div className="d-flex-1 text-right dsl-b12 bold">{overall.courses_past_due.count}</div>
                <div className="d-flex-1 text-right dsl-b12 bold">{overall.courses_completed.count}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <p className="dsl-b22 bold">Courses Assigned</p>
          <Tabs defaultActiveKey="manager" activeKey={activeTab} id="reports" onSelect={this.handleTab}>
            <Tab eventKey="manager" title="Manager Assigned">
              <Report type="manager" data={managerCoursesReport} />
            </Tab>
            <Tab eventKey="career" title="Career Assigned">
              <Report type="career" data={careerCoursesReport} />
            </Tab>
            <Tab eventKey="self" title="Self Assigned">
              <Report type="self" data={selfsCoursesReport} />
            </Tab>
          </Tabs>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  employees: state.app.employees,
  trainingReports: state.manage.trainingReports.individual,
  selfsCoursesReport: state.develop.selfsCoursesReport,
  careerCoursesReport: state.develop.careerCoursesReport,
  managerCoursesReport: state.develop.managerCoursesReport,
})

const mapDispatchToProps = dispatch => ({
  getReports: (payload, type) => dispatch(MngActions.posttrainingreportsRequest(payload, type)),
  getUserCourseReport: (userId, startDate, endDate) =>
    dispatch(DevActions.userscoursereportRequest(userId, startDate, endDate)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTraining)
