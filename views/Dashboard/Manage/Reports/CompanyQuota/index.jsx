import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { DatePicker, Filter, Icon } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { QuotaReportTabs } from '~/services/config'
import { exportCsv } from '~/services/util'
import Report from './Report'
import CompanyQuotaPdf from './CompanyQuotaPdf'

const moment = extendMoment(originalMoment)

class CompanyQuota extends React.Component {
  state = {
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
    companyId: [this.props.companyId],
    userId: [],
    filter: 'all',
  }

  componentDidMount() {
    const { startDate, endDate, companyId, userId } = this.state
    const payload = {
      date_start: startDate,
      date_end: endDate,
      company_id: companyId,
      user_id: userId,
    }
    this.props.getReports(payload)
  }

  handleFilter = (type, e) => {
    const { startDate, endDate, filter } = this.state
    const payload = {
      date_start: startDate,
      date_end: endDate,
    }
    if (type === 'company' && e[0].id === -1) {
      // Case for when all comopanies selected
      const companyIds = this.props.companies.map(item => item.id)
      payload.company_id = companyIds
      this.props.getReports(payload)
      this.setState({ companyId: [e[0].id] })
    } else {
      // Case when specific company selected or employee selected
      if (type === 'company') {
        const companyIds = e.map(item => item.id)
        payload.company_id = companyIds
        this.props.getReports(payload)
        this.setState({ companyId: companyIds })
      } else if (type == 'employee' && e.length > 0) {
        const userIds = e.map(item => item.id)
        const companyIds = this.props.companies.map(item => item.id)
        payload.company_id = companyIds
        payload.user_id = userIds
        this.props.getReports(payload)
        this.setState({ userId: userIds })
      }
    }
  }

  handleDate = e => {
    const { companyId, userId } = this.state
    const startDate = moment(e.start)
    const endDate = moment(e.end)

    const payload = {
      date_start: startDate,
      date_end: endDate,
      company_id: companyId,
      user_id: userId,
    }
    this.props.getReports(payload)
    this.setState({ startDate, endDate })
  }

  handleTab = filter => {
    const { companyId, userId, startDate, endDate } = this.state

    const payload = {
      date_start: startDate,
      date_end: endDate,
      company_id: companyId,
      user_id: userId,
    }
    this.props.getReports(payload)
    this.setState({ filter })
  }

  handleQuotaEmployeeModal = quota => {
    const payload = {
      type: 'Quota Employee',
      data: { before: { quota: quota }, after: null },
      callBack: null,
    }
    this.props.toggleModal(payload)
  }

  handleIndividualReport = employee => {
    const startDate = moment()
      .subtract(11, 'months')
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = moment()
      .endOf('month')
      .format('YYYY-MM-DD')
    const payload = {
      user_id: employee,
      date_start: startDate,
      date_end: endDate,
      fliter: 'scorecard',
      page: 1,
      per_page: 25,
    }
    const route = `/hcm/report-quota/${employee}`
    this.props.getIndividualReport(payload, route)
  }

  handlePdf = async () => {
    const { startDate, endDate, filter } = this.state
    const { quotaReports } = this.props
    const date = moment.range(startDate, endDate)
    const pdfData = {
      date: date,
      quotaReports: quotaReports,
      type: filter,
    }
    const bolb = await CompanyQuotaPdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleExcelReport = () => {
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
    const { filter } = this.state
    const { quotaReports } = this.props
    let quotaData = []

    quotaReports.quota_data.map(quota => {
      const { name, data, users, actual_count } = quota
      const { actual_saved_percentage, high, low, average } = data
      const sheet = {
        Quotas: name,
        'Employees \nAssigned': users?.length,
        'Actuals \nSaved': actual_count,
        '% Actual \nSaved': Number(actual_saved_percentage).toFixed(2) || 'NA',
        Low: Number(low).toFixed(2) || 'NA',
        High: Number(high).toFixed(2) || 'NA',
        Average: Number(average).toFixed(2) || 'NA',
      }
      quotaData.push(sheet)
    })
    const key = ['Quotas', 'Employees \nAssigned', 'Actuals \nSaved', '% Actual \nSaved', 'Low', 'High', 'Average']
    exportCsv(quotaData, key, `Report-Quota-${filter}`, true)
  }

  render() {
    const { filter, startDate, endDate } = this.state
    const date = moment.range(startDate, endDate)

    return (
      <div className="quota-reports">
        <Filter onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between mb-2 mt-4 align-items-center">
            <span className="dsl-b22 bold">Employees Quotas</span>
            <div className="d-flex">
              <DatePicker
                calendar="month"
                append="caret"
                format="MMM YY"
                as="span"
                align="right"
                append="caret"
                value={date}
                onSelect={this.handleDate}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} />
              </div>
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handleExcelReport}>
                <Icon name="fal fa-file-excel" color="#343f4b" size={16} />
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey="all"
            activeKey={filter}
            id="records"
            onSelect={this.handleTab}
            className="py-3 py-md-4 d-none d-md-flex"
          >
            {QuotaReportTabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Report
                  tab={tab.name}
                  data={this.props.quotaReports}
                  history={this.props.history}
                  onReport={this.handleIndividualReport}
                  onShowModal={this.handleQuotaEmployeeModal}
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
  companies: state.app.companies,
  companyId: state.app.company_info.id,
  quotaReports: state.manage.quotaReports,
})

const mapDispatchToProps = dispatch => ({
  getReports: payload => dispatch(MngActions.postquotareportRequest(payload)),
  getIndividualReport: (payload, route) => dispatch(MngActions.postindividualquotareportRequest(payload, route)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyQuota)
