import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import { equals, find, isEmpty, isNil, propEq } from 'ramda'
import { ErrorBoundary, Pagination, Filter, DatePicker, EditDropdown, Icon, ToggleColumnMenu } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import { UserRoles } from '~/services/config'
import { exportCsv } from '~/services/util'
import SchedulePdf from './SchedulePdf'
import './CompanyTrainingSchedule.scss'

const moment = extendMoment(originalMoment)

class CompanyTrainingSchedule extends Component {
  constructor(props) {
    super(props)

    const { userId, company, isAdmin } = props
    const startDate = moment()
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = moment()
      .endOf('month')
      .format('YYYY-MM-DD')

    this.state = {
      userId,
      company,
      startDate,
      endDate,
      page: 1,
      perPage: 25,
      column: 1,
    }

    this.handleFilter = this.handleFilter.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handlePer = this.handlePer.bind(this)
    this.handleOpenDetail = this.handleOpenDetail.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePdf = this.handlePdf.bind(this)
    this.handleVisible = this.handleVisible.bind(this)
    this.handleExcel = this.handleExcel.bind(this)
    this.handleExcelReport = this.handleExcelReport.bind(this)

    const payload = {
      page: 1,
      perPage: 25,
      startDate,
      endDate,
    }
    props.getTrainingSchedule(payload)
  }

  handleFilter(type, e) {
    if (equals('assignee', type)) {
      this.setState({ userId: e[0].id })
    } else {
      this.setState({ company: e[0] })
    }
  }

  handleDate(e) {
    const { perPage } = this.state
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.setState({ startDate, endDate })
    const payload = {
      startDate,
      endDate,
      page: 1,
      perPage,
    }
    this.props.getTrainingSchedule(payload)
  }

  handlePagination(page) {
    const { perPage, startDate, endDate } = this.state
    const payload = {
      startDate,
      endDate,
      page,
      perPage,
    }
    this.props.getTrainingSchedule(payload)
  }

  handlePer(perPage) {
    const { page, startDate, endDate } = this.state
    const payload = {
      startDate,
      endDate,
      page,
      perPage,
    }
    this.props.getTrainingSchedule(payload)
    this.setState({ perPage })
  }

  async handlePdf() {
    const { startDate, endDate } = this.state
    const { trainingSchedules, employees } = this.props
    const { data } = trainingSchedules
    const date = moment.range(startDate, endDate)
    const pdfData = {
      date: date,
      schedules: data,
      employee: employees,
    }
    const bolb = await SchedulePdf(pdfData)
    const url = URL.createObjectURL(bolb)
    window.open(url, '__blank')
  }

  handleOpenDetail(e, editable = false) {
    if (isNil(e)) {
      this.props.history.push(`/hcm/report-training-schedule/null`)
    } else {
      this.props.history.push({
        pathname: `/hcm/report-training-schedule/${e.id}`,
        state: { editable },
      })
    }
  }

  handleChange(schedule, event) {
    switch (event) {
      case 'detail view':
        this.handleOpenDetail(schedule, false)
        break

      case 'edit':
        this.handleOpenDetail(schedule, true)
        break

      default:
        break
    }
  }

  handleVisible(column) {
    this.setState({ column })
  }

  handleExcelReport() {
    const { trainingSchedules } = this.props
    this.handlePer(trainingSchedules.total)
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

  handleExcel() {
    const { trainingSchedules, employees } = this.props
    const { data } = trainingSchedules
    let excelData = []
    data.map(schedule => {
      const user = find(propEq('id', schedule.user_id), employees) || {}
      const scheduleData = {
        Schedule: schedule.title,
        Manager: user.name,
        Started: isNil(schedule.start_at) ? 'N/A' : moment(schedule.start_at).format('MMM D'),
        'End Date': isNil(schedule.end_at) ? 'N/A' : moment(schedule.end_at).format('MMM D'),
        Assigned: schedule.stats.assigned,
      }
      excelData.push(scheduleData)
    })

    const key = ['Schedule', 'Manager', 'Started', 'End Date', 'Assigned']
    exportCsv(excelData, key, 'Reports-Training Schedule', true)
    this.handlePer(25)
  }

  render() {
    const { isManager, company, trainingSchedules, employees } = this.props
    const { current_page, last_page, per_page, data } = trainingSchedules
    const { startDate, endDate, column } = this.state
    const date = moment.range(startDate, endDate)
    const dotsMenu = isManager ? ['Detail View', 'Edit'] : ['Detail View']

    return (
      <ErrorBoundary className="report-training-schedule">
        <Filter
          permission={UserRoles.USER}
          mountEvent
          addPrefix="Assign"
          addTitle="Training Schedule"
          onAdd={this.handleOpenDetail}
          onChange={this.handleFilter}
        />
        <div className="training-schedule-list" data-cy="hcm-report-trainingScheduleReportTable">
          <div className="d-flex justify-content-between">
            <p className="dsl-b22 bold">Training Schedule Report</p>
            <div className="d-flex">
              <DatePicker
                calendar="range"
                append="caret"
                format="MMM D"
                as="span"
                align="right"
                dataCy="hcm-report-trainingScheduleFilterByDate"
                value={date}
                closeAfterSelect
                onSelect={this.handleDate}
              />
              <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handlePdf}>
                <Icon name="fal fa-print" color="#343f4b" size={16} data-cy="hcm-report-trainingSchedulePrintBtn" />
              </div>
              {!isEmpty(data) && (
                <div className="d-flex justify-content-end cursor-pointer ml-3" onClick={this.handleExcelReport}>
                  <Icon name="fal fa-file-excel" size={16} color="#343f4b" />
                </div>
              )}
            </div>
          </div>
          <ToggleColumnMenu
            column={column}
            onVisible={this.handleVisible}
            activeTab="training-schedule"
            className="d-md-none mb-3"
            total={2}
          />
          <div className="d-flex border-bottom pt-0 pb-3 pt-md-3 pb-md-3">
            <div className="d-flex-5 dsl-m12">Schedule</div>
            <div className={classNames('d-flex-3 d-flex-ssm-4 dsl-m12 text-left', column == 2 && 'd-none d-md-block')}>
              Manager
            </div>
            <div className={classNames('d-flex-2 dsl-m12 text-right', column == 2 && 'd-none d-md-block')}>Started</div>
            <div className={classNames('d-flex-2 dsl-m12 text-right d-none d-md-block', column == 2 && 'd-block')}>
              End date
            </div>
            <div className={classNames('d-flex-2 dsl-m12 text-right d-none d-md-block', column == 2 && 'd-block')}>
              Assigned
            </div>
            <div className={classNames('d-flex-1 dsl-m12 d-none d-md-block', column == 2 && 'd-block')} />
          </div>
          {isEmpty(data) ? (
            <div className="d-center pt-4">
              <span className="dsl-m16">No Training Schedule Assigned</span>
            </div>
          ) : (
            data.map((schedule, index) => {
              const user = find(propEq('id', schedule.user_id), employees) || {}
              const started = isNil(schedule.start_at) ? 'N/A' : moment(schedule.start_at).format('MMM D')
              const endDate = isNil(schedule.end_at) ? 'N/A' : moment(schedule.end_at).format('MMM D')
              return (
                <div className="cursor-pointer d-flex border-bottom list-items" key={schedule.id}>
                  <div
                    className="d-flex-5 dsl-b14 text-400 custom-br-ssm"
                    data-cy={`hcm-report-trainingScheduleName${index}`}
                    onClick={this.handleOpenDetail.bind(this, schedule, false)}
                  >
                    {schedule.title}
                  </div>
                  <div
                    data-cy={`hcm-report-trainingScheduleAuthorName${index}`}
                    className={classNames(
                      'd-flex-3 d-flex-ssm-4 dsl-b14 text-400 text-left custom-br-ssm pl-1 pl-md-0',
                      column == 2 && 'd-none d-md-block'
                    )}
                  >
                    {user.name}
                  </div>
                  <div
                    data-cy={`hcm-report-trainingScheduleStartedDate${index}`}
                    className={classNames(
                      'd-flex-2 dsl-b14 text-400 text-right pt-4 pt-md-0',
                      column == 2 && 'd-none d-md-block'
                    )}
                  >
                    {started}
                  </div>
                  <div
                    data-cy={`hcm-report-trainingScheduleEndDate${index}`}
                    className={classNames(
                      'd-flex-2 dsl-b14 text-400 text-right d-none d-md-block custom-br-ssm',
                      column == 2 && 'd-block'
                    )}
                  >
                    {endDate}
                  </div>
                  <div
                    data-cy={`hcm-report-trainingScheduleAssigned${index}`}
                    className={classNames(
                      'd-flex-2 dsl-b14 text-400 text-right d-none d-md-block pt-4 pt-md-0 custom-br-ssm',
                      column == 2 && 'd-block'
                    )}
                  >
                    {schedule.stats.assigned}
                  </div>
                  <div
                    data-cy={`hcm-report-trainingScheduleThreeDot${index}`}
                    className={classNames(
                      'd-flex-1 justify-content-end d-none d-md-flex pt-4 pt-md-0',
                      column == 2 && 'd-block'
                    )}
                  >
                    <EditDropdown options={dotsMenu} onChange={this.handleChange.bind(this, schedule)} />
                  </div>
                </div>
              )
            })
          )}
          <Pagination
            current={current_page}
            total={last_page}
            onChange={this.handlePagination}
            onPer={this.handlePer}
          />
        </div>
      </ErrorBoundary>
    )
  }
}

CompanyTrainingSchedule.propTypes = {
  userId: PropTypes.number,
  isAdmin: PropTypes.bool,
  isManager: PropTypes.bool,
  company: PropTypes.shape({
    id: PropTypes.number,
  }),
  trainingSchedules: PropTypes.shape({
    current_page: PropTypes.number,
    last_page: PropTypes.number,
    per_page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.array,
  }),
  employees: PropTypes.array,
  getTrainingSchedule: PropTypes.func,
  fetchTemplates: PropTypes.func,
}

CompanyTrainingSchedule.defaultProps = {
  userId: 0,
  isAdmin: false,
  isManager: false,
  company: {
    id: 0,
  },
  trainingSchedules: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    data: [],
    total: 1,
  },
  employees: [],
  getTrainingSchedule: () => {},
  fetchTemplates: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  userId: state.app.id,
  isAdmin: equals(state.app.app_role_id, 2),
  isManager: state.app.app_role_id < UserRoles.USER,
  company: state.app.company_info,
  employees: state.app.employees,
  trainingSchedules: state.develop.trainingSchedules,
})

const mapDispatchToProps = dispatch => ({
  getTrainingSchedule: e => dispatch(DevActions.traininglistRequest(e)),
  fetchTemplates: e => dispatch(DevActions.librarycardtemplatesRequest(e)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTrainingSchedule)
