import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { DatePicker, EditDropdown, Filter } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { QuotaReportTabs, IndividualQuotaReportMenu } from '~/services/config'
import Report from './Report'

const moment = extendMoment(originalMoment)

class IndividualQuota extends React.Component {
  state = {
    startDate: moment()
      .subtract(11, 'months')
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
    activeTab: 'scorecard',
    page: 1,
    perPage: 25,
    userId: Number(this.props.match.params.id),
  }

  handleTab = activeTab => {
    const { startDate, endDate, page, perPage, userId } = this.state
    const payload = {
      user_id: userId,
      date_start: startDate,
      date_end: endDate,
      fliter: activeTab,
      page,
      per_page: perPage,
    }
    this.props.getIndividualReport(payload)
    this.setState({ activeTab })
  }

  handleDate = e => {
    const { activeTab, page, perPage, userId } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    const payload = {
      user_id: userId,
      date_start: startDate,
      date_end: endDate,
      fliter: activeTab,
      page,
      per_page: perPage,
    }
    this.props.getIndividualReport(payload)
    this.setState({ startDate, endDate })
  }

  handlePagination = (page, perPage) => {
    const { startDate, endDate, userId, activeTab } = this.state

    if (perPage > 50) {
      page = 1
    }
    const payload = {
      user_id: userId,
      date_start: startDate,
      date_end: endDate,
      fliter: activeTab,
      page,
      per_page: perPage,
    }
    this.props.getIndividualReport(payload)
    this.setState({ page, perPage })
  }

  handleSelectMenu = (event, item) => {
    switch (event) {
      case 'edit actuals':
        break

      case 'edit program assignment':
        break

      case 'edit scorecard assignment':
        break

      case 'view scorecards':
        break

      case 'view programs':
        break

      default:
        break
    }
  }

  render() {
    const { individualQuotaReport, history, userRole } = this.props
    const { activeTab, startDate, endDate } = this.state
    const date = moment.range(startDate, endDate)
    const tabMenu = QuotaReportTabs.filter(tab => tab.name !== 'all')

    return (
      <div className="individaul-quota-reports">
        <Filter backTitle="all quotas" onBack={() => history.goBack()} />
        <div className="card">
          <div className="d-flex justify-content-between mb-2 mt-4 align-items-center">
            <span className="dsl-b22 bold">Employees Quotas</span>
            <EditDropdown
              options={IndividualQuotaReportMenu[userRole]}
              onChange={this.handleSelectMenu.bind(this, individualQuotaReport)}
            />
          </div>
          <div className="d-flex align-self-end">
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM YYYY"
              as="span"
              align="right"
              value={date}
              onSelect={this.handleDate}
            />
          </div>
          <Tabs
            defaultActiveKey="scorecard"
            activeKey={activeTab}
            id="records"
            onSelect={this.handleTab}
            className="py-3 py-md-4 d-none d-md-flex"
          >
            {tabMenu.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Report
                  data={individualQuotaReport}
                  startDate={startDate}
                  endDate={endDate}
                  onPage={this.handlePagination}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  userRole: state.app.app_role_id,
  individualQuotaReport: state.manage.individualQuotaReport,
})

const mapDispatchToProps = dispatch => ({
  getIndividualReport: (payload, route) => dispatch(MngActions.postindividualquotareportRequest(payload, null)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualQuota)
