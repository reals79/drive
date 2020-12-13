import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clone, filter, find, isNil, keys } from 'ramda'
import originalMoment from 'moment'
import { OverlayTrigger, Tab, Tabs } from 'react-bootstrap'
import { extendMoment } from 'moment-range'
import { AverageTooltip, DatePicker, Dropdown, Filter, Icon, Rating } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import ManageActions from '~/actions/manage'
import { CompanyPerforamceTabs, SPECIALOPTIONS } from '~/services/config'
import EmployeeList from './EmployeeList'
import OrgChart from './OrgChart'
import PerformanceReviewPdf from './PerformanceReviewPdf'
import './CompanyPerformance.scss'

const moment = extendMoment(originalMoment)

class CompanyPerformance extends Component {
  state = {
    data: this.props.reviews,
    companyId: this.props.companyId,
    userId: this.props.userId,
    startDate: moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD'),
    page: 1,
    per: 25,
    column: 1,
    activeTab: 'employees',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isManager, reviews, appId } = nextProps
    let data = clone(reviews)

    if (reviews.last_page == 0 || reviews.users.length == 0) {
      data.users = []
      return { data }
    }

    if (isManager) {
      data = reviews
    } else {
      const user = find(item => appId == item.user.id, reviews.users)
      if (user) data.users = [user]
      else data.users = []
    }

    return { data }
  }

  componentDidMount() {
    const { history } = this.props
    if (history.action == 'POP') {
      const { companyId, userId, data, startDate, endDate } = this.state
      const user = find(e => e.performance, data.users)
      this.setState({
        page: data.page,
        per: data.per_page,
        startDate: user ? user.performance.date_start : startDate,
        endDate: user ? user.performance.date_end : endDate,
      })
      this.handleFetch(companyId, userId, data.per_page, data.page, startDate, endDate)
    }
  }

  handlePdf = async () => {
    const { userRole } = this.props
    const { startDate, endDate, data, activeTab } = this.state
    const date = moment.range(startDate, endDate)
    const pdfData = { date, data, userRole, activeTab }
    const bolb = await PerformanceReviewPdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleTab = tab => {
    this.setState({ activeTab: tab })
  }

  handleDate = e => {
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    const { companyId, userId, page, per } = this.state
    this.handleFetch(companyId, userId, per, page, startDate, endDate)
    this.setState({ startDate, endDate })
  }

  handleDetail = scorecard => e => {
    e.stopPropagation()
    if (scorecard) {
      const { startDate, endDate } = this.state
      const date = moment.range(startDate, endDate)
      const payload = {
        type: 'Scorecard Detail',
        data: { before: { scorecard, date }, after: {} },
        callBack: null,
      }
      this.props.toggleModal(payload)
    }
  }

  handleFetch = (companyIds, userIds, per, page, startDate, endDate) => {
    let _companyIds, _userIds
    if (companyIds[0] < 0) _companyIds = this.props.companies.map(item => item.id)
    else _companyIds = companyIds

    if (userIds[0] < 0) _userIds = null
    else _userIds = userIds

    this.props.fetchCompanyReviews(_companyIds, _userIds, per, page, startDate, endDate)
  }

  handleFilter = (type, e) => {
    const { companyId, userId, per, page, startDate, endDate } = this.state
    if (type === 'company' && e.length > 0) {
      const companyIds = e.map(item => item.id)
      this.handleFetch(companyIds, userId, per, page, startDate, endDate)
      this.setState({ companyId: companyIds })
    } else if (type === 'employee' && e.length > 0) {
      const userIds = e.map(item => item.id)
      this.handleFetch(companyId, userIds, per, page, startDate, endDate)
      this.setState({ userId: userIds })
    }
  }

  handlePagination = page => {
    const { companyId, userId, per, startDate, endDate } = this.state
    this.handleFetch(companyId, userId, per, page, startDate, endDate)
    this.setState({ page })
  }

  handlePer = per => {
    const { companyId, userId, page, startDate, endDate } = this.state
    this.handleFetch(companyId, userId, per, page, startDate, endDate)
    this.setState({ per })
  }

  handleSelectMenu = data => e => {
    const { startDate, endDate } = this.state
    const { scorecards, user } = data
    switch (e) {
      case 'save actuals':
        this.props.toggleModal({
          type: 'Save Actuals',
          data: {
            before: {
              user,
              scorecards: filter(e => e.status !== 3, scorecards),
              date: moment(startDate).format('YYYY-MM-DD'),
            },
            after: {},
          },
          callBack: {},
        })
        break

      case 'employee profile':
        this.props.history.push(`/community/profile/about`)
        break

      case 'start review':
        this.handleReview(data)
        break

      case 'assign scorecard':
        this.handleAssign(data)
        break

      case 'performance report':
        {
          const userId = user.id
          const companyId =
            scorecards.length > 0 && scorecards[0].company_id
              ? scorecards[0].company_id
              : Number(keys(user.data.company)[0])
          this.props.fetchPersonalReviews(
            userId,
            companyId,
            {
              pathname: `/hcm/report-performance/${userId}`,
              search: `date_start=${moment(startDate).format('YYYY-MM-DD')}`,
              state: { lastReview: data.last_review },
            },
            startDate,
            endDate
          )
        }
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

      case 'unassign scorecard': {
        this.props.toggleModal({
          type: 'Quick Edit',
          data: {
            before: {
              template: scorecards.length ? scorecards : {},
              userId: user.id,
              type: 'performanceScorecards',
              from: 'template',
              after: null,
            },
          },
          callBack: {
            onAssign: () => {
              this.handleAssign(data)
            },
            onDelete: e => {
              this.handleUnassignScorecard(e)
            },
          },
        })
      }

      default:
        break
    }
  }

  handleReview = e => {
    const { startDate, endDate } = this.state
    if (e.scorecards.length == 0) {
      this.handleAssign(e)
    } else {
      const userId = e.user.id
      const companyId = e.scorecards[0].company_id || Number(keys(e.user.data.company)[0])
      this.props.fetchPersonalReviews(
        userId,
        companyId,
        `/hcm/performance-reviews/${userId}?date_start=${moment(startDate).format('YYYY-MM-DD')}`,
        startDate,
        endDate
      )
    }
  }

  handlePerformanceReport = item => e => {
    e.stopPropagation()
    const { startDate, endDate } = this.state
    const userId = item.user.id
    const companyId =
      item.scorecards.length > 0 && item.scorecards[0].company_id
        ? item.scorecards[0].company_id
        : Number(keys(item.user.data.company)[0])
    this.props.fetchPersonalReviews(
      userId,
      companyId,
      {
        pathname: `/hcm/report-performance/${userId}`,
        search: `date_start=${moment(startDate).format('YYYY-MM-DD')}`,
        state: { lastReview: item.last_review },
      },
      startDate,
      endDate
    )
  }

  handleUnassignScorecard = e => {
    if (isNil(e)) return
    this.props.toggleModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Unassign Scorecard',
          body: 'This will permanently delete the scorecard from your assignments.  Are you sure?',
        },
      },
      callBack: {
        onYes: () => {
          this.props.deleteScorecard({
            scorecard: { id: e.id },
          })
        },
      },
    })
  }

  handleAssign = e => {
    const { companyId, userId, per, page, startDate, endDate } = this.state

    let _companyIds, _userIds
    if (companyId[0] < 0) _companyIds = this.props.companies.map(item => item.id)
    else _companyIds = companyId
    if (userId[0] < 0) _userIds = null
    else _userIds = userId

    const payload = {
      type: 'Assign ToDo',
      data: {
        before: {
          modules: [],
          disabled: ['habits', 'habitslist', 'quotas'],
          assignees: [e.user.id],
          after: {
            type: 'COMPANYPERFORMANCEREVIEWS_REQUEST',
            companyIds: _companyIds,
            userIds: _userIds,
            perPage: per,
            page,
            startDate,
            endDate,
          },
        },
        after: null,
      },
      callBack: null,
    }
    this.props.toggleModal(payload)
  }

  handleRowClick = (item, type) => () => {
    this.handleSelectMenu(item)(type)
  }

  handleVisible = column => {
    this.setState({ column })
  }

  render() {
    const { data, startDate, endDate, column, activeTab } = this.state
    const { userRole } = this.props
    const date = moment.range(startDate, endDate)

    return (
      <div className="cmp-performance-reviews" dataCy="performanceReviewsPage">
        <Filter
          mountEvent
          removed={[[], [SPECIALOPTIONS.LIST]]}
          dataCy="performanceReviewFilter"
          onChange={this.handleFilter}
        />
        <div className="card pt-4">
          <div className="d-flex justify-content-between align-items-md-start px-3">
            <span className="dsl-b22 bold">{moment(startDate).format('MMMM')} Reviews</span>
            <div className="d-flex">
              <DatePicker
                calendar="month"
                dataCy="filterByMonth"
                append="caret"
                format="MMM YY"
                as="span"
                align="right"
                value={date}
                disabledDate={e => moment(e).isSameOrAfter(moment().startOf('month'))}
                onSelect={this.handleDate}
              />
              <div
                dataCy="printIcon"
                className="d-flex justify-content-end cursor-pointer ml-3"
                onClick={this.handlePdf}
              >
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
            </div>
          </div>
          <div className="custom-dropdown-mobile ml-2">
            <Dropdown
              className="mobile-screen"
              data={CompanyPerforamceTabs}
              defaultIds={[0]}
              returnBy="data"
              getValue={e => e.label}
              onChange={e => this.handleTab(e[0].name)}
            />
          </div>
          <div className="mt-0 mt-md-4">
            <Tabs
              className="bg-white pt-0 d-none d-md-flex px-3"
              defaultActiveKey="employees"
              activeKey={activeTab}
              id="com-tab"
              onSelect={this.handleTab}
            >
              <Tab eventKey="employees" title="Employees">
                <div className="px-3 mt-3">
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
                        {data?.stats?.reviews_completed?.count}&#47;{data?.stats?.scorecards?.count}&nbsp;Reviews
                        completed
                      </span>
                    </div>
                  </div>
                </div>
                <EmployeeList
                  data={data}
                  userRole={userRole}
                  column={column}
                  startDate={startDate}
                  endDate={endDate}
                  pagination
                  onRowClick={(item, type) => this.handleRowClick(item, type)}
                  onSelectMenu={item => this.handleSelectMenu(item)}
                  onReport={item => this.handlePerformanceReport(item)}
                  onScorecardDetail={item => this.handleDetail(item)}
                  onPagination={this.handlePagination}
                  onPer={this.handlePer}
                />
              </Tab>
              <Tab eventKey="chart" title="OrgChart">
                <div className="px-3 mt-3">
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
                        {data?.stats?.reviews_completed?.count}&#47;{data?.stats?.scorecards?.count}&nbsp;Reviews
                        completed
                      </span>
                    </div>
                  </div>
                </div>
                <OrgChart
                  data={data}
                  userRole={userRole}
                  column={column}
                  startDate={startDate}
                  endDate={endDate}
                  onRowClick={(item, type) => this.handleRowClick(item, type)}
                  onSelectMenu={item => this.handleSelectMenu(item)}
                  onReport={item => this.handlePerformanceReport(item)}
                  onScorecardDetail={item => this.handleDetail(item)}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isManager: state.app.app_role_id < 4,
  appId: state.app.id,
  userRole: state.app.app_role_id,
  companyId: state.app.selectedCompany,
  userId: state.app.selectedEmployee['team'],
  companies: state.app.companies,
  employees: state.app.employees,
  locations: state.app.locations,
  reviews: state.manage.companyPerformanceReviews,
})

const mapDispatchToProps = dispatch => ({
  fetchPersonalReviews: (userId, companyId, route, dateStart, dateEnd) =>
    dispatch(ManageActions.individualperformancereviewRequest(userId, companyId, route, dateStart, dateEnd)),
  fetchCompanyReviews: (companyIds, userIds, perPage, page, startDate = null, endDate = null) =>
    dispatch(ManageActions.companyperformancereviewsRequest(companyIds, userIds, perPage, page, startDate, endDate)),
  deleteScorecard: payload => dispatch(DevActions.postdeletescorecardRequest(payload)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyPerformance)
