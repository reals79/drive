import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { isNil, isEmpty, type as RamdaType, propEq, find } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { toast } from 'react-toastify'
import { DatePicker, ErrorBoundary, Filter, Icon, Pagination, ToggleColumnMenu } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import DevActions from '~/actions/develop'
import { exportCsv } from '~/services/util'
import EmployeesReport from './EmployeesReport'
import CertReport from './CertReport'
import CertificationPdf from './CertificationPdf'
import './Certifications.scss'

const moment = extendMoment(originalMoment)

class Certifications extends Component {
  constructor(props) {
    super(props)

    const startDate = isNil(props.history.location.state)
      ? moment()
          .startOf('month')
          .format('YYYY-MM-DD')
      : props.history.location.state.startDate
    const endDate = isNil(props.history.location.state)
      ? moment()
          .endOf('month')
          .format('YYYY-MM-DD')
      : props.history.location.state.endDate
    const company = find(propEq('id', props.company[0]), props.companies)

    const page = isNil(props.history.location.state) ? 1 : props.history.location.state.page
    const per = isNil(props.history.location.state) ? 25 : props.history.location.state.per
    this.state = { company, user: {}, page, per, startDate, endDate, activeTab: 'employees', column: 1 }
  }

  handleCertifications = (type, company_id, user_id, page, per, date_start, date_end) => {
    this.props.getCertifications(type, { company_id, user_id, page, per, date_start, date_end })
  }

  handleDate = e => {
    const { activeTab, company, user, page, per } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.setState({ startDate, endDate })
    this.handleCertifications(activeTab, company?.id, user?.id, page, per, startDate, endDate)
  }

  handleFilter = (type, e) => {
    if (isNil(e)) return
    const { activeTab, company, startDate, endDate } = this.state
    if (type === 'company') {
      if (e[0].id < 0) return
      if (e[0].id !== company?.id) {
        this.setState({ company: e[0] })
        this.handleCertifications(activeTab, e[0].id, null, 1, 25, startDate, endDate)
      }
    } else if (type === 'employee') {
      if (e[0].id > 0) {
        this.setState({ user: e[0] })
        this.handleCertifications(activeTab, company?.id || e[0].company_id, e[0].id, 1, 25, startDate, endDate)
      } else {
        this.setState({ user: {} })
        this.handleCertifications(activeTab, company?.id, null, 1, 25, startDate, endDate)
      }
    }
  }

  handleSelectTab = tab => {
    const { activeTab, page, per, company, user, startDate, endDate } = this.state
    if (activeTab !== tab) {
      this.setState({ activeTab: tab, column: 1 })
      this.handleCertifications(tab, company?.id, user?.id, page, per, startDate, endDate)
    }
  }

  handlePage = page => {
    const { activeTab, company, user, per, startDate, endDate } = this.state
    this.setState({ page })
    this.handleCertifications(activeTab, company?.id, user?.id, page, per, startDate, endDate)
  }

  handlePer = per => {
    const { activeTab, company, user, startDate, endDate } = this.state
    let page = this.state.page
    if (per > 50) page = 1
    this.setState({ per })
    this.handleCertifications(activeTab, company?.id, user?.id, page, per, startDate, endDate)
  }

  handleOpenCertification = (event, item, user, type) => {
    const { company, page, per, startDate, endDate } = this.state
    switch (event) {
      case 'view certification': {
        const data = RamdaType(item) === 'Array' ? item[0] : item
        if (type === 'employees') {
          if (isNil(data)) {
            toast.warn('No Certification assigned to the user', { position: toast.POSITION.TOP_CENTER })
          } else {
            this.props.getProgramDetail(data, 'certifications', {
              pathname: `/hcm/report-certifications/${data.user_id}/${data.id}/view`,
              state: { startDate, endDate, page, per },
            })
          }
        } else {
          this.props.getProgramDetail(data, 'certifications', `/library/programs/certifications/${data.id}/view`)
        }

        break
      }
      case 'edit certification':
        this.props.toggleModal({
          type: 'Advanced Edit',
          data: {
            before: {
              programs: item,
              userId: user.id,
              after: {
                type: 'FETCHCERTIFICATIONSREPORT_REQUEST',
                payload: { type, companyId: company?.id, page, per, startDate, endDate },
              },
            },
          },
          callBack: {},
        })
        break

      case 'assign certification':
        this.props.toggleModal({
          type: 'Assign Program',
          data: {
            before: {
              modules: type === 'employees' ? [] : [item],
              disabled: ['careers'],
              assignees: user ? [user.id] : [],
              levels: type === 'employees' ? null : item.data.levels,
              companyId: company?.id,
              after: {
                type: 'FETCHCERTIFICATIONSREPORT_REQUEST',
                payload: { type, companyId: company?.id, page, per, startDate, endDate },
              },
            },
          },
        })
        break
      case 'save actuals': {
        this.props.toggleModal({
          type: 'Save Actuals',
          data: {
            before: {
              user,
              userId: user.id,
              scorecards: item,
              type: 'programs',
              after: {
                type: 'FETCHCERTIFICATIONSREPORT_REQUEST',
                payload: { type, companyId: company?.id, page, per, startDate, endDate },
              },
            },
            after: {},
          },
          callBack: {},
        })

        break
      }
      default:
        break
    }
  }

  handlePdf = async () => {
    const { activeTab, startDate, endDate } = this.state
    const { certificationsReport, jobRoles } = this.props
    const { users, programs } = certificationsReport
    const date = moment.range(startDate, endDate)
    const pdfData = { users: users, programs: programs, jobRoles: jobRoles, date: date, tab: activeTab }

    const blob = await CertificationPdf(pdfData)
    const url = URL.createObjectURL(blob)
    window.open(url, '__blank')
  }

  handleExcelReport = () => {
    const { certificationsReport } = this.props
    this.handlePer(certificationsReport.total)
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
    const { activeTab } = this.state
    const { certificationsReport } = this.props
    const { users, programs } = certificationsReport
    let data = []
    let key = []
    if (activeTab === 'employees') {
      users.forEach(user => {
        const openCerts = user.stats.open_certifications.map(({ title }) => ({ title }))
        let openCertsTitle = []
        openCerts.forEach(e => {
          openCertsTitle.push(e.title)
        })
        const completedCerts = user.stats.completed_certifications.map(({ title }) => ({ title }))
        let completedCertsTitle = []
        completedCerts.forEach(e => {
          completedCertsTitle.push(e.title)
        })
        const employeeData = {
          Employee: user.profile.first_name + user.profile.last_name,
          Open: user.stats.open,
          'Open Certifications': isEmpty(openCerts) ? 'Nothing open' : openCertsTitle.join(', '),
          Completed: user.stats.completed,
          'Completed Certifications': isEmpty(completedCerts) ? 'Nothing Completed' : completedCertsTitle.join(', '),
        }
        data.push(employeeData)
      })
      key = ['Employee', 'Open', 'Open Certifications', 'Completed', 'Completed Certifications']
    } else {
      programs.map(program => {
        const openEmployees = program.stats.open_employees.map(e => {
          const { profile } = e
          return { name: `${profile.first_name} ${profile.last_name}` }
        })
        const completedEmployees = program.stats.completed_employees.map(e => {
          const { profile } = e
          return { name: `${profile.first_name} ${profile.last_name}` }
        })
        let openEmployeesName = []
        openEmployees.forEach(e => {
          openEmployeesName.push(e.name)
        })
        let completedEmployeesName = []
        completedEmployees.forEach(e => {
          completedEmployeesName.push(e.name)
        })
        const certificationData = {
          Certifications: program.title,
          Open: program.stats.open,
          'Open Employees': isEmpty(openEmployees) ? 'No employee' : openEmployeesName.join(', '),
          Completed: program.stats.completed,
          'Completed Employees': isEmpty(completedEmployees) ? 'No employee' : completedEmployeesName.join(', '),
        }
        data.push(certificationData)
      })

      key = ['Certifications', 'Open', 'Open Employees', 'Completed', 'Completed Employees']
    }
    exportCsv(data, key, `Certification-${activeTab}`, true)
    this.handlePer(25)
  }

  render() {
    const { activeTab, startDate, endDate, column, page } = this.state
    const { userRole, certificationsReport } = this.props
    const { last_page, users, programs } = certificationsReport
    const title = activeTab === 'employees' ? 'Company Certification Report' : 'Certifications'
    const date = moment.range(startDate, endDate)

    return (
      <ErrorBoundary className="manage-report-certifications" data-cy="certificationsShowcase">
        <Filter mountEvent onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex align-items-center mb-3 pt-1 pt-md-2">
            <div className="dsl-b22 text-500 d-flex-1">{title}</div>
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM D"
              align="right"
              as="span"
              value={date}
              onSelect={this.handleDate}
            />
            <div className="d-flex justify-content-end cursor-pointer pl-3" onClick={this.handlePdf}>
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
          <ToggleColumnMenu
            className="d-md-none"
            column={column}
            activeTab={activeTab}
            total={2}
            onVisible={e => this.setState({ column: e })}
          />
          <Tabs id="certifications" defaultActiveKey="employees" activeKey={activeTab} onSelect={this.handleSelectTab}>
            <Tab key="employees" eventKey="employees" title="Employees">
              <EmployeesReport
                role={userRole}
                data={users}
                history={this.props.history}
                column={column}
                onClick={this.handleOpenCertification}
              />
            </Tab>
            <Tab data-cy="certificationsList" key="certifications" eventKey="certifications" title="Certifications">
              <CertReport role={userRole} data={programs} column={column} onClick={this.handleOpenCertification} />
            </Tab>
          </Tabs>
          <Pagination current={page} total={last_page} onChange={this.handlePage} onPer={this.handlePer} />
        </div>
      </ErrorBoundary>
    )
  }
}

Certifications.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  certificationsReport: PropTypes.shape({
    type: PropTypes.string,
    users: PropTypes.array,
    programs: PropTypes.array,
    page: PropTypes.number,
    per_page: PropTypes.number,
    last_page: PropTypes.number,
  }),
  getCertifications: PropTypes.func,
  getProgramDetail: PropTypes.func,
  toggleModal: PropTypes.func,
}

Certifications.defaultProps = {
  company: { id: 0, name: '' },
  certificationsReport: {
    type: 'employees',
    users: [],
    programs: [],
    page: 1,
    per_page: 25,
    last_page: 1,
    total: 1,
  },
  getCertifications: () => {},
  getProgramDetail: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  company: state.app.selectedCompany,
  userRole: state.app.app_role_id,
  companies: state.app.companies,
  certificationsReport: state.manage.certificationsReport,
})

const mapDispatchToProps = dispatch => ({
  getCertifications: (mode, payload) => dispatch(MngActions.fetchcertificationsreportRequest(mode, payload)),
  getProgramDetail: (payload, type, route) => dispatch(DevActions.libraryprogramdetailRequest(payload, type, route)),
  deleteProgram: e => dispatch(DevActions.programeventRequest(e)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Certifications)
