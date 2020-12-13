import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { DatePicker, Filter, Icon, ToggleColumnMenu, Dropdown } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { CompanyDevelopTabs } from '~/services/config'
import { exportCsv } from '~/services/util'
import Report from './Report'
import CompanyTrainingPdf from './CompanyTrainingPdf'
import './CompanyTraining.scss'

const moment = extendMoment(originalMoment)

class CompanyTraining extends Component {
  state = {
    type: 'overall',
    companyId: this.props.companyIds,
    userId: -1,
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
    page: 1,
    per_page: 25,
    column: 1,
  }

  handleCompany = e => {
    const type = 'individual'
    const { startDate, endDate, page, per_page } = this.state
    const payload = {
      page,
      per_page,
      date_start: startDate,
      date_end: endDate,
      company_id: [e.id],
    }
    this.props.getReports(payload, type)
    this.setState({ companyId: [e.id] })
  }

  handlePdf = async () => {
    const { startDate, endDate, companyId, type } = this.state
    const { trainingReports, userRole } = this.props
    const date = moment.range(startDate, endDate)
    const activeType = CompanyDevelopTabs.filter(item => item.name === type)
    const mode = companyId[0] === -1 ? 'company' : 'individual'
    const Total = trainingReports[mode][type]
    const pdfData = {
      date: date,
      trainingReports: trainingReports,
      userRole: userRole,
      companyId: companyId,
      type: activeType[0].label,
      typeValue: type,
      total: Total,
    }
    const bolb = await CompanyTrainingPdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleDate = e => {
    const { companyId, page, per_page } = this.state
    const type = 'individual'
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    const payload = {
      page,
      per_page,
      date_start: startDate,
      date_end: endDate,
      company_id: companyId,
    }
    this.props.getReports(payload, type)
    this.setState({ startDate, endDate })
  }

  handleFilter = (type, e) => {
    const { page, per_page, startDate, endDate, companyId } = this.state
    const payload = {
      page,
      per_page,
      date_start: startDate,
      date_end: endDate,
    }
    let reportType = type

    if (type === 'company') {
      // Case for when all comopanies selected
      if (e[0].id === -1) {
        const companyIds = this.props.companies.map(item => item.id)
        payload.company_id = companyIds
      } else {
        payload.company_id = [e[0].id]
      }
      this.props.getReports(payload, reportType)
      this.setState({ companyId: [e[0].id] })
    }
    if (type === 'employee' && companyId[0] !== -1) {
      // Case when specific company or employee selected
      reportType = 'individual'
      if (type === 'company') {
        const companyIds = e.map(item => item.id)
        payload.company_id = companyIds
        this.setState({ companyId: companyIds })
      } else {
        const userId = e[0].id
        payload.company_id = companyId
        if (userId > 0) payload.user_id = [userId]
        this.setState({ userId })
      }
      this.props.getReports(payload, reportType)
    }
  }

  handlePagination = (page, per) => {
    const { startDate, endDate, companyId } = this.state
    let companyIds = []
    let type = 'company'
    if (Number(companyId) === -1) {
      companyIds = this.props.companies.map(item => item.id)
    } else {
      companyIds = companyId
      type = 'individual'
    }
    if (per > 50) {
      page = 1
    }
    const payload = {
      page,
      per_page: per,
      date_start: startDate,
      date_end: endDate,
      company_id: companyIds,
    }
    this.props.getReports(payload, type)
    this.setState({ page, per_page: per })
  }

  handleTab = type => {
    this.setState({ type, column: 1 })
  }
  handleVisible = column => {
    this.setState({ column: column })
  }

  handleExcelReport = () => {
    const { companyId } = this.state
    const { trainingReports } = this.props
    const mode = companyId[0] === -1 ? 'company' : 'individual'
    const total = trainingReports[mode].total
    this.handlePagination(this.state.page, total)
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
    const { companyId, type } = this.state
    const { trainingReports } = this.props
    const mode = companyId[0] === -1 ? 'company' : 'individual'
    const total = trainingReports[mode][type]
    const selected = 'individual' === mode ? trainingReports[mode].individuals : trainingReports[mode].companies
    let trainingData = []
    const totalData = {
      Employees: 'Total',
      'Assigned \nCourse': `${total.courses_assigned.count} \n${total.courses_assigned.percent}%`,
      'Incomplete \nCourses': `${total.courses_incompleted.count} \n${total.courses_assigned.percent}%`,
      'Past Due \nCourses': `${total.courses_past_due.count} \n${total.courses_past_due.percent}%`,
      'Completed \nCourses': `${total.courses_completed.count} \n${total.courses_completed.percent}%`,
      'Completed \non time': `${total.courses_completed_on_time.count} \n${total.courses_completed_on_time.percent}%`,
      'Completed \npast due': `${total.courses_completed_past_due.count} \n${total.courses_completed_past_due.percent}%`,
    }
    trainingData.push(totalData)
    selected.map(item => {
      const { name, report } = item
      const employeeData = {
        Employees: name,
        'Assigned \nCourse': `${report[type].courses_assigned.count} \n${report[type].courses_assigned.percent}%`,
        'Incomplete \nCourses': `${report[type].courses_incompleted.count} \n${report[type].courses_assigned.percent}%`,
        'Past Due \nCourses': `${report[type].courses_past_due.count} \n${report[type].courses_past_due.percent}%`,
        'Completed \nCourses': `${report[type].courses_completed.count} \n${report[type].courses_completed.percent}%`,
        'Completed \non time': `${report[type].courses_completed_on_time.count} \n${report[type].courses_completed_on_time.percent}%`,
        'Completed \npast due': `${report[type].courses_completed_past_due.count} \n${report[type].courses_completed_past_due.percent}%`,
      }
      trainingData.push(employeeData)
    })
    const key = [
      'Employees',
      'Assigned \nCourse',
      'Incomplete \nCourses',
      'Past Due \nCourses',
      'Completed \nCourses',
      'Completed \non time',
      'Completed \npast due',
    ]
    exportCsv(trainingData, key, `Report-Training-${type}`, true)
    this.handlePagination(this.state.page, 25)
  }

  render() {
    const { type, startDate, endDate, companyId, column } = this.state
    const { userRole, history, trainingReports } = this.props
    const date = moment.range(startDate, endDate)
    const mode = companyId[0] === -1 ? 'company' : 'individual'

    return (
      <div className="company-reports">
        <Filter mountEvent onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex justify-content-between mb-2 mt-4 mt-lg-0 align-items-center">
            <span className="dsl-b22 bold">Training Report</span>
            <div className="d-flex">
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM D"
                as="span"
                align="right"
                append="caret"
                value={date}
                onSelect={this.handleDate}
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
          <div className="pt-2 pb-2">
            <div className="custom-dropdown-mobile">
              <Dropdown
                className="pb-2 mobile-screen core-dropdown-label core-dropdown"
                data={CompanyDevelopTabs}
                defaultIds={[0]}
                returnBy="data"
                getValue={e => e.label}
                onChange={e => this.handleTab(e[0].name)}
              />
            </div>
            <ToggleColumnMenu
              column={column}
              onVisible={this.handleVisible}
              activeTab={type}
              className="d-md-none"
              total={2}
            />
          </div>
          <Tabs
            defaultActiveKey="overall"
            activeKey={type}
            id="records"
            onSelect={this.handleTab}
            className="py-3 py-md-4 d-none d-md-flex"
          >
            {CompanyDevelopTabs.map(tab => (
              <Tab key={tab.name} eventKey={tab.name} title={tab.label}>
                <Report
                  total={trainingReports[mode][tab.name]}
                  data={trainingReports}
                  userRole={userRole}
                  type={tab.name}
                  mode={mode}
                  companyId={companyId}
                  history={history}
                  onCompany={this.handleCompany}
                  onPage={this.handlePagination}
                  column={column}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    )
  }
}

CompanyTraining.propTypes = {
  userRole: PropTypes.number.isRequired,
  companies: PropTypes.array.isRequired,
  companyId: PropTypes.number,
  getReports: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

CompanyTraining.defaultProps = {
  companyId: 0,
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  companies: state.app.companies,
  companyId: state.app.company_info.id,
  trainingReports: state.manage.trainingReports,
  companyIds: state.app.selectedCompany,
})

const mapDispatchToProps = dispatch => ({
  getReports: (payload, type) => dispatch(MngActions.posttrainingreportsRequest(payload, type)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTraining)
