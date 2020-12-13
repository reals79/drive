import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { dropLast, find, isEmpty, isNil, keys, length, propEq } from 'ramda'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import { toast } from 'react-toastify'
import { Filter, Pagination, DatePicker, Icon, ToggleColumnMenu } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { exportCsv } from '~/services/util'
import Employees from './Employees'
import Careers from './Careers'
import CareerPdf from './CareerPdf'
import './CareerList.scss'

const moment = extendMoment(originalMoment)

class Career extends Component {
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
    const curPage = isNil(props.history.location.state) ? 1 : props.history.location.state.curPage
    const perPage = isNil(props.history.location.state) ? 25 : props.history.location.state.perPage

    const company = find(propEq('id', props.company[0]), props.companies)
    const jobRoles = company?.job_roles || []

    this.state = {
      careers: null,
      curPage,
      totalPage: 1,
      perPage,
      company,
      user: {},
      jobRoles,
      activeTab: 'employees',
      startDate,
      endDate,
      column: 1,
    }
  }

  handleFetchCareers = (type, company_id, user_id, per, page, date_start, date_end) => {
    this.props.getCareerReports(type, { company_id, user_id, page, per, date_start, date_end })
  }

  handleSelectTab = tab => {
    const { activeTab, company, user, curPage, perPage, startDate, endDate } = this.state
    if (activeTab !== tab) {
      this.handleFetchCareers(tab, company?.id, user?.id, perPage, curPage, startDate, endDate)
      this.setState({ activeTab: tab, column: 1 })
    }
  }

  handleFilter = (type, e) => {
    if (isNil(e)) return

    const { activeTab, company, user, curPage, perPage, startDate, endDate } = this.state
    if (type === 'company') {
      const newCompany = e[0]
      if (newCompany.id < 0) return
      if (newCompany.id !== company?.id) {
        this.handleFetchCareers(activeTab, newCompany.id, user.id, perPage, curPage, startDate, endDate)
        this.setState({ company: newCompany })
      }
    } else if (type === 'employee' && e.length > 0) {
      if (e[0].id > 0) {
        this.handleFetchCareers(activeTab, company?.id, e[0].id, perPage, curPage, startDate, endDate)
        this.setState({ user: e[0] })
      } else {
        this.handleFetchCareers(activeTab, company?.id, null, perPage, curPage, startDate, endDate)
        this.setState({ user: {} })
      }
    }
  }

  handlePage = curPage => {
    const { activeTab, company, user, perPage, startDate, endDate } = this.state
    this.handleFetchCareers(activeTab, company?.id, user?.id, perPage, curPage, startDate, endDate)
    this.setState({ curPage })
  }

  handlePer = perPage => {
    const { activeTab, company, user, startDate, endDate } = this.state
    this.handleFetchCareers(activeTab, company?.id, user?.id, perPage, 1, startDate, endDate)
    this.setState({ perPage, curPage: 1 })
  }

  handleMenu = (event, item, user) => {
    const { company, activeTab, startDate, endDate, curPage, perPage } = this.state
    const type = dropLast(1, activeTab)

    switch (event) {
      case 'edit career':
        this.props.toggleModal({
          type: 'Quick Edit',
          data: { before: { template: item, type: 'careers', from: 'instance', companyId: company?.id, after: null } },
          callBack: {
            onDelete: () => this.handleDeleteProgram(item),
          },
        })
        break
      case 'assign career':
        this.props.toggleModal({
          type: 'Assign Program',
          data: {
            before: {
              modules: [],
              disabled: ['certifications'],
              assignees: [user.id],
              companyId: company?.id,
              after: {
                type: 'FETCHCAREERREPORTS_REQUEST',
                payload: {
                  type: activeTab,
                  companyId: company?.id,
                  per: perPage,
                  page: curPage,
                  startDate,
                  endDate,
                },
              },
            },
          },
        })
        break
      case 'view career': {
        if (isNil(item)) {
          toast.warn('No Career assigned to the user', {
            position: toast.POSITION.TOP_CENTER,
          })
        } else {
          const programId = item.id
          const route =
            type === 'employee'
              ? {
                  pathname: `/hcm/report-careers/${type}/${user.id}/view`,
                  state: { startDate, endDate, curPage, perPage },
                }
              : `/hcm/report-careers/${type}/${item.id}/${event}`
          this.props.getCareerProgram(programId, route)
        }
        break
      }
      case 'save actuals': {
        if (item.quotas.length === 0) {
          toast.warn(`This program doesn't have any QUOTAs that you can update!`, {
            position: toast.POSITION.TOP_RIGHT,
          })
        } else {
          this.props.toggleModal({
            type: 'Save Actuals',
            data: {
              before: {
                user,
                userId: user.id,
                scorecards: [item],
                type: 'programs',
                after: {
                  type: 'FETCHCAREERREPORTS_REQUEST',
                  payload: {
                    type: activeTab,
                    companyId: company?.id,
                    per: perPage,
                    page: curPage,
                    startDate,
                    endDate,
                  },
                },
              },
              after: {},
            },
            callBack: {},
          })
        }
        break
      }
      default:
        break
    }
  }

  handleDeleteProgram = program => {
    const { activeTab, company, curPage, perPage, startDate, endDate } = this.state
    const payload = {
      event: 'delete',
      data: {
        program: { id: program.id },
      },
      after: {
        type: 'FETCHCAREERREPORTS_REQUEST',
        payload: {
          type: activeTab,
          companyId: company?.id,
          per: perPage,
          page: curPage,
          startDate,
          endDate,
        },
      },
    }
    this.props.deleteProgram(payload)
  }

  handleDate = e => {
    const { activeTab, company, user, curPage, perPage } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.handleFetchCareers(activeTab, company?.id, user?.id, perPage, curPage, startDate, endDate)
    this.setState({ startDate, endDate })
  }

  handlePdf = async () => {
    const { activeTab, startDate, endDate, jobRoles } = this.state
    const { careerReports } = this.props
    const { users, programs } = careerReports
    const date = moment.range(startDate, endDate)
    const pdfData = { users, programs, jobRoles, date, tab: activeTab }

    const blob = await CareerPdf(pdfData)
    const url = URL.createObjectURL(blob)
    window.open(url, '__blank')
  }

  handleExcelReport = () => {
    const { careerReports } = this.props
    this.handlePer(careerReports.total)
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
    const { activeTab, jobRoles } = this.state
    const { careerReports } = this.props
    const { users, programs } = careerReports
    let data = []
    let key = []
    if (activeTab === 'employees') {
      users.forEach(item => {
        const { profile, stats } = item
        let currentCareer = stats.open_careers[0]
        if (stats.open === 0 && stats.completed !== 0) {
          currentCareer = stats.completed_careers[0]
        }
        const title = isNil(currentCareer) ? 'No Program Assigned' : currentCareer.title
        const name = isNil(profile) ? '' : `${profile.first_name} ${profile.last_name}`
        const careerRole = isNil(currentCareer) ? null : find(propEq('id', currentCareer.job_role_id), jobRoles)
        const jobTitle = isNil(careerRole) ? '' : careerRole.name
        const level = isNil(currentCareer)
          ? 'N/A'
          : `(${currentCareer.level}/${
              isNil(currentCareer.data) || isNil(currentCareer.data.levels)
                ? 1
                : length(keys(currentCareer.data.levels))
            })`
        const started = isNil(currentCareer)
          ? 'N/A'
          : moment
              .utc(currentCareer.started_at || currentCareer.created_at)
              .local()
              .format('MMM DD, YYYY')
        const end =
          isNil(currentCareer) || isNil(currentCareer.end_estimate)
            ? 'N/A'
            : moment
                .utc(item.program.end_estimate)
                .local()
                .format('MMM DD, YYYY')
        let completed = 0
        if (!isNil(currentCareer)) {
          const currentStats = currentCareer.stats
          const { courses, quotas } = currentStats
          const totals = (isNil(quotas) ? 0 : quotas.total) + (isNil(courses) ? 0 : courses.total)
          const completes = (isNil(quotas) ? 0 : quotas.complete) + (isNil(courses) ? 0 : courses.complete)
          completed = totals === 0 ? 100 : ((completes * 100) / totals).toFixed(2)
        }
        const employeeData = {
          Employee: name,
          Career: title,
          Level: `${jobTitle} ${level}`,
          Started: started,
          'Est. Compl.': end,
          Completed: `${completed}%`,
        }
        data.push(employeeData)
      })
      key = ['Employee', 'Career', 'Level', 'Started', 'Est. Compl.', 'Completed']
    } else {
      programs.map(program => {
        const openEmployees = program.stats.open_employees
          ? program.stats.open_employees.map(e => {
              const { profile } = e
              return {
                name: `${profile.first_name} ${profile.last_name}`,
              }
            })
          : []
        const completedEmployees = program.stats.completed_employees
          ? program.stats.completed_employees.map(e => {
              const { profile } = e
              return { name: `${profile.first_name} ${profile.last_name}` }
            })
          : []
        let openEmpolyeesName = []
        openEmployees.forEach(e => {
          openEmpolyeesName.push(e.name)
        })
        let completedEmployeesName = []
        completedEmployees.forEach(e => {
          completedEmployeesName.push(e.name)
        })
        const careerData = {
          Careers: program.title,
          Open: program.stats.open,
          'Open Employees': isEmpty(openEmpolyeesName) ? 'No employee' : openEmpolyeesName.join(', '),
          Completed: program.stats.completed,
          'Completed Employees': isEmpty(completedEmployeesName) ? 'No employee' : completedEmployeesName.join(', '),
        }
        data.push(careerData)
      })

      key = ['Careers', 'Open', 'Open Employees', 'Completed', 'Completed Employees']
    }
    exportCsv(data, key, `Career-Reports-${activeTab}`, true)
    this.handlePer(25)
  }

  render() {
    const { userRole, careerReports } = this.props
    const { activeTab, jobRoles, startDate, endDate, column } = this.state
    const { page, per_page, last_page, users, programs } = careerReports
    const date = moment.range(startDate, endDate)

    return (
      <div className="mng-career-list" data-cy="careerReportShowcase">
        <Filter mountEvent onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex align-items-center mb-2 mb-md-3">
            <div className="dsl-b22 bold d-flex-1">Career</div>
            <DatePicker
              calendar="range"
              dataCy="careerReportFilterDate"
              append="caret"
              format="MMM D"
              align="right"
              as="span"
              value={date}
              onSelect={this.handleDate}
            />
            <div
              className="d-flex justify-content-end cursor-pointer ml-3"
              data-cy="careerPrintIcon"
              onClick={this.handlePdf}
            >
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
            column={column}
            activeTab={activeTab}
            className={activeTab == 'careers' ? 'd-md-none' : 'd-lg-none'}
            dataCy="careerToggleColumnMenu"
            total={activeTab == 'careers' ? 2 : 3}
            onVisible={e => this.setState({ column: e })}
          />
          <Tabs
            id="careers-report"
            data-cy="careerTabText"
            defaultActiveKey="employees"
            activeKey={activeTab}
            onSelect={this.handleSelectTab}
          >
            <Tab key="employees" eventKey="employees" title="Employees" data-cy="careerEmployeeTabContent">
              <Employees
                data={users}
                dataCy="employeeList"
                role={userRole}
                jobRoles={jobRoles}
                history={this.props.history}
                column={column}
                onMenu={this.handleMenu}
              />
            </Tab>
            <Tab key="careers" eventKey="careers" title="Careers" data-cy="careerCareersTabContent">
              <Careers data={programs} role={userRole} column={column} onMenu={this.handleMenu} />
            </Tab>
          </Tabs>
          <Pagination
            current={page}
            perPage={per_page}
            total={last_page}
            onChange={this.handlePage}
            onPer={this.handlePer}
          />
        </div>
      </div>
    )
  }
}

Career.propTypes = {
  userRole: PropTypes.number,
  company: PropTypes.shape({ id: PropTypes.number }),
  companies: PropTypes.array.isRequired,
  careerReports: PropTypes.shape({
    type: PropTypes.string,
    users: PropTypes.array,
    programs: PropTypes.array,
    page: PropTypes.number,
    per_page: PropTypes.number,
    last_page: PropTypes.number,
    total: PropTypes.number,
  }),
  getCareerReports: PropTypes.func,
  getCareerProgram: PropTypes.func,
  deleteProgram: PropTypes.func,
}

Career.defaultProps = {
  userRole: 2,
  company: { id: 0 },
  careerReports: {
    type: 'employees',
    users: [],
    programs: [],
    page: 1,
    per_page: 25,
    last_page: 1,
    total: 1,
  },
  getCareerReports: () => {},
  getCareerProgram: () => {},
  deleteProgram: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  company: state.app.selectedCompany,
  companies: state.app.companies,
  careerReports: state.manage.careerReport,
})

const mapDispatchToProps = dispatch => ({
  getCareerReports: (mode, payload) => dispatch(MngActions.fetchcareerreportsRequest(mode, payload)),
  getCareerProgram: (programId, route) => dispatch(MngActions.getcareerprogramRequest(programId, route)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
  deleteProgram: e => dispatch(DevActions.programeventRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Career)
