import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isNil, keys, values } from 'ramda'
import { OverlayTrigger, Tab, Tabs } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { AverageTooltip, DatePicker, ErrorBoundary, Filter, Icon, Rating, ToggleColumnMenu } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import ManageActions from '~/actions/manage'
import { exportCsv } from '~/services/util'
import CompanyPerformancePdf from './CompanyPerformancePdf'
import EmployeeList from './EmployeeList'
import OrgChart from './OrgChart'
import './CompanyPerformance.scss'

const moment = extendMoment(originalMoment)

class CompanyPerformance extends Component {
  state = {
    startDate: isNil(this.props.history.location.state)
      ? moment()
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD')
      : this.props.history.location.state.startDate,
    endDate: isNil(this.props.history.location.state)
      ? moment()
          .subtract(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD')
      : this.props.history.location.state.endDate,
    page: isNil(this.props.history.location.state) ? 1 : this.props.history.location.state.page,
    per: isNil(this.props.history.location.state) ? 25 : this.props.history.location.state.per,
    activeTab: 'employees',
  }

  componentDidMount() {
    const { companyIds, userIds, history } = this.props
    const { page, per, startDate, endDate } = this.state
    if (history.action !== 'POP') {
      this.handleFetch(companyIds, userIds, per, page, startDate, endDate)
    }
  }

  handleDateChange = e => {
    const { companyIds, userIds } = this.props
    const { page, per } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.handleFetch(companyIds, userIds, per, page, startDate, endDate)
    this.setState({ startDate, endDate })
  }

  handleFetch = (companyIds, userIds, per, page, startDate, endDate) => {
    let _companyIds, _userIds
    if (companyIds[0] < 0) {
      _companyIds = this.props.companies.map(item => item.id)
    } else {
      _companyIds = companyIds
    }
    if (userIds[0] < 0) {
      _userIds = null
    } else {
      _userIds = userIds
    }
    this.props.fetchCompanyReviews(_companyIds, _userIds, per, page, startDate, endDate)
  }

  handleFilter = (type, e) => {
    const { companyIds, userIds } = this.props
    const { per, page, startDate, endDate } = this.state
    if (type === 'company' && e.length > 0) {
      const _companyIds = e.map(item => item.id)
      this.handleFetch(_companyIds, userIds, per, page, startDate, endDate)
    } else if (type === 'employee' && e.length > 0) {
      const _userIds = e.map(item => item.id)
      this.handleFetch(companyIds, _userIds, per, page, startDate, endDate)
    }
  }

  handlePagination = e => {
    const { companyIds, userIds } = this.props
    const { per, startDate, endDate } = this.state
    this.handleFetch(companyIds, userIds, per, e, startDate, endDate)
    this.setState({ page: e })
  }

  handlePer = per => {
    const { companyIds, userIds } = this.props
    const { startDate, endDate } = this.state
    let page = this.state.page
    if (per >= 50) page = 1
    this.handleFetch(companyIds, userIds, per, page, startDate, endDate)
    this.setState({ page, per })
  }

  handleReport = e => {
    const userId = e?.performance ? e?.performance?.user_id : e?.user?.id
    const companyId = e?.performance ? e?.performance?.company_id : e?.company?.id
    const { startDate, endDate } = this.state
    this.props.fetchPersonalReviews(userId, companyId, 1, 25, startDate, endDate, {
      pathname: `/hcm/report-performance/${userId}`,
      search: `date_start=${moment(startDate).format('YYYY-MM-DD')}`,
      state: { lastReview: e?.last_review },
    })
  }

  handleSelectMenu = data => e => {
    const { startDate, endDate } = this.state
    const { scorecards, user } = data

    switch (e) {
      case 'assign scorecard':
        this.props.toggleModal({
          type: 'Assign ToDo',
          data: {
            before: {
              modules: scorecards,
              disabled: ['habits', 'habitslist', 'quotas'],
              assignees: [user.id],
            },
            after: null,
          },
          callBack: null,
        })
        break

      case 'save actuals':
        this.props.toggleModal({
          type: 'Save Actuals',
          data: {
            before: {
              user,
              userId: user?.id,
              scorecards,
              date: moment(startDate).format('YYYY-MM-DD'),
              after: null,
            },
            after: {},
          },
          callBack: {},
        })
        break

      case 'start review':
        {
          const userId = user.id
          const companyId = scorecards[0].company_id || Number(keys(user.data.company)[0])
          this.props.fetchIndividualReviews(
            userId,
            companyId,
            `/hcm/performance-reviews/${userId}?date_start=${moment(startDate).format('YYYY-MM-DD')}`,
            startDate,
            endDate
          )
        }
        break

      case 'unassign scorecard':
        this.props.deleteScorecard({
          scorecard: { id: scorecards[0].id },
          after: {
            type: 'COMPANYPERFORMANCEREVIEWS_REQUEST',
            companyIds: [this.props.companyId],
            perPage: this.state.per,
            page: this.state.page,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
          },
        })
        break
      case 'view individual report':
        this.handleReport(data)
        break
      case 'preview scorecard': {
        const date = moment.range(startDate, endDate)
        const payload = {
          type: 'Scorecard Detail',
          data: { before: { scorecard: scorecards[0], date }, after: {} },
          callBack: null,
        }
        this.props.toggleModal(payload)
        break
      }
      default:
        break
    }
  }

  handlePdf = async () => {
    const { data, userRole } = this.props
    const { startDate, endDate } = this.state
    const date = moment.range(startDate, endDate)
    const pdfData = { date, data, userRole }
    const bolb = await CompanyPerformancePdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleVisible = column => {
    this.setState({ column })
  }

  handleExcelReport = () => {
    this.handlePer(this.props.data.total)
    this.props.toggleModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Confirm',
          body: 'Would you like to download this reports data to excel?',
        },
      },
      callBack: {
        onYes: () => {
          this.handleExcel()
        },
      },
    })
  }

  handleExcel = () => {
    const { data } = this.props
    let performance = []
    data.users.forEach(item => {
      const excelData = {
        Name: `${item.user.profile.first_name} ${item.user.profile.last_name}`,
        Scorecard: 0 == item.scorecards.length ? 'No Scorecard assigned' : item.scorecards[0].title,
        Score: isNil(item.performance)
          ? 'Incomplete'
          : item.performance.status == 2
          ? item.performance.data && 'N/A' !== item.performance.data.average_star_rating
            ? item.performance.data.average_star_rating
            : 'N/A'
          : 'Incomplete',
        Task: isNil(item.performance) ? 'Incomplete' : item.performance.tasks.length,
        Training: isNil(item.performance) ? 'Incomplete' : item.performance.trainings.length,
        Completed:
          item.performance && item.performance.status == 2
            ? moment(item.performance.completed_at).format('MM/DD/YYYY')
            : 'Incomplete',
      }
      performance.push(excelData)
    })
    const key = ['Name', 'Scorecard', 'Score', 'Task', 'Training', 'Completed']
    exportCsv(performance, key, 'Reports-Performance', true)
    this.handlePer(25)
  }

  handleTab = tab => {
    this.setState({ activeTab: tab })
  }

  render() {
    const { data, userRole } = this.props
    const { startDate, endDate, column, activeTab } = this.state
    const date = moment.range(startDate, endDate)

    return (
      <ErrorBoundary className="cmp-performance-reports">
        <Filter onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between pt-2 pt-md-4 pt-lg-0 pb-2 pb-md-0">
            <span className="dsl-b22 bold">Performance Reports</span>
            <div className="mt-2 mt-md-0 d-flex">
              <DatePicker
                calendar="month"
                append="caret"
                format="MMM YY"
                as="span"
                align="right"
                value={date}
                disabledDate={e => moment(e).isSameOrAfter(moment().startOf('month'))}
                onSelect={this.handleDateChange}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
              <div
                className="d-flex justify-content-end cursor-pointer ml-3"
                data-cy="careerExcelIcon"
                onClick={this.handleExcelReport}
              >
                <Icon name="fal fa-file-excel" size={16} color="#343f4b" />
              </div>
            </div>
          </div>
          <ToggleColumnMenu
            column={column}
            onVisible={this.handleVisible}
            activeTab="performance"
            className="d-md-none"
            total={2}
          />
          <div className="mt-0 mt-md-4">
            <Tabs
              className="bg-white pt-0 d-none d-md-flex"
              defaultActiveKey="employees"
              activeKey={activeTab}
              id="com-tab"
              onSelect={this.handleTab}
            >
              <Tab eventKey="employees" title="Employees">
                <div className="mt-2">
                  <div className="align-items-start avg-score d-inline-block">
                    <span className="dsl-b14">Average Score</span>
                    <div className="cursor-pointer pb-1 pt-1">
                      <OverlayTrigger placement="right" overlay={AverageTooltip(data?.stats)}>
                        <div>
                          <Rating score={data?.stats?.completed_average_star_score?.stars} size="small" />
                        </div>
                      </OverlayTrigger>
                    </div>
                    <div>
                      <span className="dsl-b12">
                        {data?.stats?.reviews_completed?.count}/{data?.stats?.scorecards?.count}/Reviews completed
                      </span>
                    </div>
                  </div>
                </div>
                <EmployeeList
                  data={data}
                  userRole={userRole}
                  column={column}
                  onReport={item => this.handleReport(item)}
                  onSelectMenu={item => this.handleSelectMenu(item)}
                  onPagination={this.handlePagination}
                  onPer={this.handlePer}
                />
              </Tab>
              <Tab eventKey="chart" title="OrgChart">
                <div className="mt-2">
                  <div className="align-items-start avg-score d-inline-block">
                    <span className="dsl-b14">Average Score</span>
                    <div className="cursor-pointer pb-1 pt-1">
                      <OverlayTrigger placement="right" overlay={AverageTooltip(data?.stats)}>
                        <div>
                          <Rating score={data?.stats?.completed_average_star_score?.stars} size="small" />
                        </div>
                      </OverlayTrigger>
                    </div>
                    <div>
                      <span className="dsl-b12">
                        {data?.stats?.reviews_completed?.count}/{data?.stats?.scorecards?.count}/Reviews completed
                      </span>
                    </div>
                  </div>
                </div>
                <OrgChart
                  data={data}
                  userRole={userRole}
                  column={column}
                  onReport={item => this.handleReport(item)}
                  onSelectMenu={item => this.handleSelectMenu(item)}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  companyIds: state.app.selectedCompany,
  userIds: state.app.selectedEmployee['team'],
  companies: state.app.companies,
  data: state.manage.companyPerformanceReviews,
  users: state.app.employees,
})

const mapDispatchToProps = dispatch => ({
  fetchIndividualReviews: (userId, companyId, route, dateStart, dateEnd) =>
    dispatch(ManageActions.individualperformancereviewRequest(userId, companyId, route, dateStart, dateEnd)),
  fetchPersonalReviews: (userId, companyId, current, per, startDate, endDate, route) =>
    dispatch(ManageActions.getperformancereviewsRequest(userId, companyId, current, per, startDate, endDate, route)),
  fetchCompanyReviews: (companyIds, userIds, perPage, page, startDate = null, endDate = null) =>
    dispatch(ManageActions.companyperformancereviewsRequest(companyIds, userIds, perPage, page, startDate, endDate)),
  deleteScorecard: payload => dispatch(DevActions.postdeletescorecardRequest(payload)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyPerformance)
