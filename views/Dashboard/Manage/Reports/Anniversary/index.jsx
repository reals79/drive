import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import { isNil, isEmpty, length, prop, slice, sortBy } from 'ramda'
import { Avatar, DatePicker, EditDropdown, Filter, Icon, Pagination, ToggleColumnMenu } from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { avatarBackgroundColor, exportCsv } from '~/services/util'
import AnniversaryPdf from './AnniversaryPdf'
import './Anniversary.scss'

const moment = extendMoment(originalMoment)
const today = moment()

class Anniversary extends Component {
  state = {
    date: moment.range(today.clone(), today.clone().add(1, 'year')),
    currentPage: 1,
    perPage: 25,
    company: this.props.company,
    base: 'anniversary',
    orderBy: 'name',
    asc: true,
    month_start: '01',
    month_end: '12',
    column: 1,
  }

  handleFetchAnniversary(companyId, base, orderBy, asc, month_start, month_end) {
    this.props.getAnniversaryReports(companyId, base, orderBy, asc, month_start, month_end)
  }

  handleFilter = (type, e) => {
    const { base, asc, orderBy, month_start, month_end } = this.state

    if (isNil(e)) return
    if (type === 'company' && e[0].id > 0) {
      this.handleFetchAnniversary(e[0].id, base, orderBy, asc, month_start, month_end)
      this.setState({ company: e[0] })
    } else if (type === 'employee') {
    }
  }

  handleDate = e => {
    const { company, base, asc, orderBy } = this.state
    const date = moment.range(moment(e.start).format('MM/DD/YYYY'), moment(e.end).format('MM/DD/YYYY'))
    const month_start = date.start.format('MM')
    const month_end = date.end.format('MM')
    this.handleFetchAnniversary(company.id, base, orderBy, asc, month_start, month_end)
    this.setState({ date, month_start, month_start })
  }

  handlePage = e => {
    this.setState({ currentPage: e })
  }

  handlePer = e => {
    this.setState({ perPage: e })
  }

  handleSort = event => {
    const { base, asc, company, month_start, month_end } = this.state
    this.handleFetchAnniversary(company.id, base, event, asc, month_start, month_end)
    this.setState({ orderBy: event, asc: !asc })
  }

  handleMenu = item => {
    this.props.history.push(`/library/record-employee-info/${item.id}`)
  }

  handlePdf = async () => {
    const { date, currentPage, perPage } = this.state
    const { anniversaryReport } = this.props

    const activeEmployee = isEmpty(anniversaryReport.active) ? [] : anniversaryReport.active.employees[0]
    const from = (currentPage - 1) * perPage
    const to = currentPage * perPage
    const employees = slice(from, to, activeEmployee)

    const preparePdfData = {
      employees: employees,
      date: date,
    }

    const binary = await AnniversaryPdf(preparePdfData)
    const binaryUrl = URL.createObjectURL(binary)
    window.open(binaryUrl, '__blank')
  }

  handleVisible = column => {
    this.setState({ column })
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
    const { anniversaryReport } = this.props

    const employees = isEmpty(anniversaryReport.active) ? [] : anniversaryReport.active.employees[0]
    let anniversary = []
    employees.forEach(employee => {
      const excelData = {
        Name: employee.name,
        Company: employee.company_name,
        Departments: employee.department_name,
        'Anniversary Date':
          isNil(employee.anniversary_date) || isEmpty(employee.anniversary_date)
            ? 'NA'
            : moment(employee.anniversary_date).format('MMM DD, YYYY'),
        'Hire Date': moment(employee.hired_at).format('MMM DD, YYYY'),
      }
      anniversary.push(excelData)
    })

    const key = ['Name', 'Company', 'Departments', 'Anniversary Date', 'Hire Date']
    exportCsv(anniversary, key, 'Reports-Anniversary', true)
  }

  render() {
    const { date, currentPage, perPage, column } = this.state
    const { anniversaryReport } = this.props
    const activeEmployee = isEmpty(anniversaryReport.active) ? [] : anniversaryReport.active.employees[0]

    const from = (currentPage - 1) * perPage
    const to = currentPage * perPage
    const totalPage = Math.ceil(length(activeEmployee) / perPage)
    const selected = slice(from, to, activeEmployee)
    const menu = ['Profile']

    return (
      <div className="mng-anniversary">
        <Filter mountEvent onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex align-items-center mb-2">
            <span className="dsl-b22 bold d-flex-1">Anniversary Report</span>
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM DD, YYYY"
              as="span"
              align="right"
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
          <ToggleColumnMenu
            column={column}
            onVisible={this.handleVisible}
            activeTab="anniversary"
            className="d-md-none"
            total={2}
          />
          <div className="list-header mt-4">
            <div
              className="d-flex d-flex-3 d-flex-ssm-4 dsl-m12 text-400 cursor-pointer"
              onClick={e => this.handleSort('name')}
            >
              Employee's Name
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-2 dsl-m12 text-400 cursor-pointer mr-4 mr-md-5 ml-md-3',
                column == 2 && 'd-none d-md-block'
              )}
              onClick={e => this.handleSort('company')}
            >
              Company
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames('d-flex-2 dsl-m12 text-400 cursor-pointer', column == 2 && 'd-none d-md-block')}
              onClick={e => this.handleSort('departments')}
            >
              Departments
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-2 d-flex-ssm-3 dsl-m12 text-right text-400 cursor-pointer d-none d-md-block',
                column == 2 && 'd-block'
              )}
              onClick={e => this.handleSort('anniversary_date')}
            >
              Anniversary date
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-2 d-flex-ssm-3 dsl-m12 text-right text-400 cursor-pointer d-none d-md-block',
                column == 2 && 'd-block'
              )}
              onClick={e => this.handleSort('hired_at')}
            >
              Hire Date
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div className={classNames('d-flex-1 dsl-m12 d-none d-md-block', column == 2 && 'd-block')} />
          </div>
          {selected.map((employee, index) => {
            const hireDate = moment(employee.hired_at).format('MMM DD, YY')
            const anniversaryDate =
              isNil(employee.anniversary_date) || isEmpty(employee.anniversary_date)
                ? 'NA'
                : moment(employee.anniversary_date).format('MMM DD')

            return (
              <div className="list-item cursor-pointer" key={`anniversary${index}`}>
                <div className="d-flex d-flex-3 d-flex-ssm-4 dsl-m12 align-items-center custom-br-ssm">
                  <Avatar
                    url={employee.profile.avatar}
                    size="tiny"
                    type="initial"
                    name={employee.name}
                    backgroundColor={avatarBackgroundColor(employee.id)}
                    onToggle={() => this.props.history.push(`/library/record-employee-info/${employee.id}`)}
                  />
                  <span className="dsl-b14 ml-2 text-400 ml-3">{employee.name}</span>
                </div>
                <div
                  className={classNames(
                    'd-flex-2 mr-3 mr-md-5 ml-2 ml-md-3 custom-br-ssm',
                    column == 2 && 'd-none d-md-block'
                  )}
                >
                  <div className="dsl-b14 company-name text-400">{employee.company_name}</div>
                </div>
                <div className={classNames('d-flex-2', column == 2 && 'd-none d-md-block')}>
                  <span className="dsl-b14 text-400">{employee.department_name}</span>
                </div>
                <div
                  className={classNames(
                    'd-flex-2 d-flex-ssm-3 text-right custom-br-ssm pt-4 pt-md-0 d-none d-md-block',
                    column == 2 && 'd-block'
                  )}
                >
                  <span className="dsl-b14 text-400 ">{anniversaryDate}</span>
                </div>
                <div
                  className={classNames(
                    'd-flex-2 d-flex-ssm-3 text-right d-none d-md-block pt-4 pt-md-0 custom-br-ssm',
                    column == 2 && 'd-block'
                  )}
                >
                  <span className="dsl-b14 text-400">{hireDate}</span>
                </div>
                <div className={classNames('d-flex-1 dsl-m12 text-right d-none d-md-block', column == 2 && 'd-block')}>
                  <EditDropdown options={menu} onChange={() => this.handleMenu(employee)} />
                </div>
              </div>
            )
          })}
          <Pagination
            current={currentPage}
            perPage={perPage}
            total={totalPage}
            onChange={this.handlePage}
            onPer={this.handlePer}
          />
        </div>
      </div>
    )
  }
}

Anniversary.propTypes = {
  userId: PropTypes.number,
  company: PropTypes.shape({ id: PropTypes.number }),
  anniversaryReport: PropTypes.shape({
    active: PropTypes.object,
    prior: PropTypes.object,
    recruit: PropTypes.object,
  }),
  getAnniversaryReports: PropTypes.func,
  toggleModal: PropTypes.func,
}

Anniversary.defaultProps = {
  userId: 0,
  company: { id: 0 },
  anniversaryReport: { active: {}, prior: {}, recruit: {} },
  getAnniversaryReports: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  company: state.app.company_info,
  anniversaryReport: state.manage.anniversarybirthdayReport,
})

const mapDispatchToProps = dispatch => ({
  getAnniversaryReports: (companyId, base, orderBy, asc, month_start, month_end) =>
    dispatch(MngActions.getanniversarybirthdayRequest(companyId, base, orderBy, asc, month_start, month_end)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Anniversary)
