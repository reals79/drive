import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { find, propEq } from 'ramda'
import { Avatar, DatePicker, Filter, Icon } from '@components'
import AppActions from '~/actions/app'
import ManageActions from '~/actions/manage'
import TrainingActivity from './TrainingActivity'
import PerformanceReviews from './PerformanceReviews'
import TasksProjects from './TasksProjects'
import NewHireOrientation from './NewHireOrientations'
import CareerManagement from './CareerManagement'
import EmployeeRecords from './EmployeeRecords'
import ManagerDashboardPdf from './ManagerDashboardPdf'
import './ManagerDashboard.scss'

class ManagerDashboard extends React.Component {
  state = {
    companyId: this.props.company,
    dateStart: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    dateEnd: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
  }

  handleDate = e => {
    const dateStart = moment(e.start).format('YYYY-MM-DD')
    const dateEnd = moment(e.end).format('YYYY-MM-DD')
    this.props.fetchDashboard(this.state.companyId, dateStart, dateEnd)
    this.setState({ dateStart, dateEnd })
  }

  handleFilter = (type, e) => {
    const { dateStart, dateEnd } = this.state
    if (type === 'company' && e.length > 0) {
      this.props.fetchDashboard(e[0].id, dateStart, dateEnd)
      this.setState({ companyId: e[0].id })
    }
  }

  handleModal = e => {
    this.props.toggleModal(e)
  }

  handlePdf = async () => {
    const { dateStart, dateEnd } = this.state
    const { reports } = this.props
    const date = moment.range(dateStart, dateEnd)
    const pdfData = { reports, date }
    const blob = await ManagerDashboardPdf(pdfData)
    const url = URL.createObjectURL(blob)
    window.open(url, '__blank')
  }

  render() {
    const { companies, reports } = this.props
    const { companyId, dateStart, dateEnd } = this.state
    const date = moment.range(dateStart, dateEnd)
    const company = find(propEq('id', companyId), companies)

    return (
      <div className="mng-dashboard">
        <Filter mountEvent onChange={this.handleFilter} />
        {company && (
          <div className="card flex-row mb-3">
            <Avatar
              size="large"
              url="/images/default_company.svg"
              type="logo"
              borderWidth={2}
              backgroundColor="#FFFFFF"
              borderColor="#e0e0e0"
            />
            <div className="d-flex-1 ml-3 ml-md-5 pt-2">
              <p className="dsl-b22 bold mb-1 mb-md-3">{company?.name}</p>
              <p className="dsl-b14 text-400 mb-2">{company?.data?.profile.address.street}</p>
              <p className="dsl-b14 text-400 mb-2 mb-md-2">
                {`${company?.data?.profile.address.city} ${company.data?.profile.address.state}`}
              </p>
              <p className="dsl-b14 text-400 mobile-screen">Employees: {reports.users.length}</p>
            </div>
            <div className="top-stats">
              <div className="d-flex">
                <DatePicker
                  calendar="range"
                  append="caret"
                  format="MMM D"
                  as="span"
                  align="right"
                  value={date}
                  mountEvent
                  onSelect={this.handleDate}
                />
                <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                  <Icon name="fal fa-print" color="#343f4b" size={16} />
                </div>
              </div>
              <p className="dsl-b14 text-400">Employees: {reports.users.length}</p>
            </div>
          </div>
        )}
        <div className="mr-0 mr-md-2 w-100">
          <div className="custom-wrap-block">
            <TrainingActivity data={reports.training} onModal={this.handleModal} />
            <NewHireOrientation data={reports.new_hire} onModal={this.handleModal} />
          </div>
          <div className="custom-wrap-block">
            <PerformanceReviews data={reports.performance} onModal={this.handleModal} />
            <CareerManagement data={reports.career} onModal={this.handleModal} />
          </div>
          <div className="custom-wrap-block">
            <TasksProjects data={reports.tasks} onModal={this.handleModal} />
            <EmployeeRecords data={reports.employee_records} onModal={this.handleModal} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  company: state.app.selectedCompany[0],
  companyId: state.app.company_info.id,
  companies: state.app.companies,
  reports: state.manage.managerDashboard,
})

const mapDispatchToProps = dispatch => ({
  fetchDashboard: (companyId, dateStart, dateEnd) =>
    dispatch(ManageActions.getmanagerdashboardRequest(companyId, dateStart, dateEnd)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManagerDashboard)
