import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import classNames from 'classnames'
import { extendMoment } from 'moment-range'
import { filter, includes, isNil, isEmpty, length, prop, slice, sortBy } from 'ramda'
import { Avatar, DatePicker, Filter, Icon, Pagination, EditDropdown, ToggleColumnMenu } from '@components'
import { avatarBackgroundColor, exportCsv } from '~/services/util'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import BirthdayPDF from './BirthdayPDF'
import './Birthday.scss'

const moment = extendMoment(originalMoment)

class Birthday extends Component {
  constructor(props) {
    super(props)

    const today = moment().startOf('month')
    const date = moment.range(today.clone(), today.clone().add(1, 'year'))

    this.state = {
      date,
      currentPage: 1,
      perPage: 25,
      company: { id: props.company[0] },
      userIds: [],
      base: 'birthday',
      orderBy: 'days_remaining',
      asc: true,
      month_start: '',
      month_end: '',
      column: 1,
    }
  }

  handleFetchBirthday(companyId, base, orderBy, asc, month_start, month_end) {
    this.props.getBirthdayReport(companyId, base, orderBy, asc, month_start, month_end)
  }

  handleFilter = (type, e) => {
    const { base, asc, orderBy, month_start, month_end } = this.state
    if (isNil(e)) return
    if (type === 'company' && e[0].id > 0) {
      this.handleFetchBirthday(e[0].id, base, orderBy, asc, month_start, month_end)
      this.setState({ company: e[0] })
    } else if (type === 'employee') {
      const userIds = e[0].id < 0 ? [] : e.map(item => item.id)
      this.setState({ userIds })
    }
  }

  handleDate = e => {
    const { company, base, asc } = this.state
    const date = moment.range(moment(e.start).format('MM/DD/YYYY'), moment(e.end).format('MM/DD/YYYY'))
    const month_start = date.start.format('MM')
    const month_end = date.end.format('MM')
    this.handleFetchBirthday(company.id, base, event, asc, month_start, month_end)
    this.setState({ date, month_start, month_end })
  }

  handlePage = e => {
    this.setState({ currentPage: e })
  }

  handlePer = e => {
    this.setState({ perPage: e })
  }

  handleSort = event => {
    const { base, asc, company, month_start, month_end } = this.state
    this.handleFetchBirthday(company.id, base, event, asc, month_start, month_end)
    this.setState({ orderBy: event, asc: !asc })
  }

  handleMenu = item => {
    this.props.history.push(`/library/record-employee-info/${item.id}`)
  }

  handlePDF = async () => {
    const { date, currentPage, perPage } = this.state
    const { birthdayReport } = this.props

    const activeEmployee = isEmpty(birthdayReport.active) ? [] : birthdayReport.active.employees[0]
    const from = (currentPage - 1) * perPage
    const to = currentPage * perPage
    const employees = slice(from, to, activeEmployee)

    const preparePdfData = { employees, date }

    const binary = await BirthdayPDF(preparePdfData)
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
    const { birthdayReport } = this.props

    const employees = isEmpty(birthdayReport.active) ? [] : birthdayReport.active.employees[0]
    let birthday = []

    employees.forEach(employee => {
      const excelData = {
        Name: employee.name,
        Company: employee.company_name,
        Departments: employee.department_name,
        Birthday:
          isNil(employee.birthday) || isEmpty(employee.birthday)
            ? 'NA'
            : moment(employee.birthday).format('MMM DD, YYYY'),
        'Hire Date': moment(employee.hired_at).format('MMM DD, YYYY'),
      }
      birthday.push(excelData)
    })

    const key = ['Name', 'Company', 'Departments', 'Birthday', 'Hire Date']
    exportCsv(birthday, key, 'Reports-Birthday', true)
  }

  render() {
    const { date, currentPage, perPage, column, userIds } = this.state
    const { birthdayReport } = this.props
    const activeEmployee = isEmpty(birthdayReport.active) ? [] : birthdayReport.active.employees[0]
    const from = (currentPage - 1) * perPage
    const to = currentPage * perPage
    const totalPage = Math.ceil(length(activeEmployee) / perPage)
    const menu = ['Profile']
    const _employees = sortBy(prop('name'), activeEmployee)
    const selected =
      userIds.length === 0 ? slice(from, to, activeEmployee) : filter(e => includes(e.id, userIds), _employees)

    return (
      <div className="mng-birthday">
        <Filter mountEvent onChange={this.handleFilter} />
        <div className="card">
          <div className="d-flex align-items-center mb-2">
            <span className="dsl-b22 bold d-flex-1">Birthday Report</span>
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM DD, YY"
              as="span"
              align="right"
              append="caret"
              value={date}
              onSelect={this.handleDate}
            />
            <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePDF}>
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
            activeTab="birthday"
            className="d-lg-none"
            total={2}
          />
          <div className="list-header mt-4">
            <div
              className="d-flex d-flex-3 d-flex-sm-4 dsl-m12 text-400 cursor-pointer"
              onClick={() => this.handleSort('name')}
            >
              Employee's Name
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-3 dsl-m12 text-400 cursor-pointer ml-2 ml-lg-0',
                column == 2 && 'd-none d-lg-block'
              )}
              onClick={() => this.handleSort('company')}
            >
              Company
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-2 dsl-m12 text-400 cursor-pointer ml-1 ml-md-2 ml-lg-0',
                column == 2 && 'd-none d-md-block'
              )}
              onClick={() => this.handleSort('departments')}
            >
              Department
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-2 dsl-m12 text-right text-400 cursor-pointer',
                column == 1 && 'd-none d-md-block'
              )}
              onClick={() => this.handleSort('birth_date')}
            >
              Birthday
              <span className="ml-1 sort-item">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div
              className={classNames(
                'd-flex-2 dsl-m12 text-right text-400 cursor-pointer',
                column == 1 && 'd-none d-lg-block'
              )}
              onClick={() => this.handleSort('hired_at')}
            >
              Hire Date
              <span className="ml-1 sort-item d-flex-1">
                <Icon name="fas fa-sort-down caret" color="#343f4b" size={10} />
              </span>
            </div>
            <div className={classNames('d-flex-1 d-none d-md-block dsl-m12', column == 2 && 'd-block')} />
          </div>
          {selected.map(employee => {
            const hireDate = moment(employee.hired_at).format('MMM DD, YY')
            const birthday =
              isNil(employee.birthday) || isEmpty(employee.birthday)
                ? 'NA'
                : moment(employee.birthday).format('MMM DD, YY')
            return (
              <div className="list-item cursor-pointer" key={employee.id}>
                <div className="d-flex d-flex-3 d-flex-sm-4 dsl-m12 align-items-center custom-right-border-sm">
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
                <div className={column == 1 ? 'd-flex-3' : 'd-none'}>
                  <div className="dsl-b14 company-name text-400 custom-br-ssm">{employee.company_name}</div>
                </div>
                <div className={classNames('d-flex-2', column == 2 && 'd-none d-md-block')}>
                  <span className="dsl-b14 text-400">{employee.department_name}</span>
                </div>
                <div className={classNames('d-flex-2 text-right custom-br-ssm', column == 1 && 'd-none d-md-block')}>
                  <span className="dsl-b14 text-400 mr-2 mr-md-0">{birthday}</span>
                </div>
                <div className={classNames('d-flex-2 text-right custom-br-ssm', column == 1 && 'd-none d-lg-block')}>
                  <span className="dsl-b14 text-400">{hireDate}</span>
                </div>
                <div className={classNames('d-flex-1 dsl-m12 d-none d-md-block text-right', column == 2 && 'd-block')}>
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

Birthday.propTypes = {
  userId: PropTypes.number,
  company: PropTypes.array,
  birthdayReport: PropTypes.shape({
    active: PropTypes.object,
    prior: PropTypes.object,
    recruit: PropTypes.object,
  }),
  getBirthdayReport: PropTypes.func,
  toggleModal: PropTypes.func,
}

Birthday.defaultProps = {
  userId: 0,
  company: [],
  birthdayReport: { active: {}, prior: {}, recruit: {} },
  getBirthdayReport: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  company: state.app.selectedCompany,
  birthdayReport: state.manage.anniversarybirthdayReport,
})

const mapDispatchToProps = dispatch => ({
  getBirthdayReport: (companyId, base, orderBy, asc, month_start, month_end) =>
    dispatch(MngActions.getanniversarybirthdayRequest(companyId, base, orderBy, asc, month_start, month_end)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Birthday)
