import React, { Component } from 'react'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import { filter, isEmpty, isNil } from 'ramda'
import { DatePicker, Icon, Pagination, ToggleColumnMenu } from '@components'
import { convertAvgDays, inPage, exportCsv } from '~/services/util'
import CompanyTaskReportPDF from './CompanyTaskReportPDF'
import IndividualTaskReportPDF from './IndividualTaskReportPDF'
import './TaskReport.scss'

const moment = extendMoment(originalMoment)

class TaskReport extends Component {
  state = {
    startDate: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
    current: 1,
    per: 25,
    column: 1,
  }

  handleDateChange = e => {
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.props.onTasks(startDate, endDate)
    this.setState({ startDate, endDate })
  }

  handlePagination = e => {
    this.setState({ current: e })
  }

  handlePer = per => {
    this.setState({ per })
  }

  handleVisible = column => {
    this.setState({ column })
  }

  handlePrintPDF = async type => {
    const { data, selected, individualTaskData } = this.props
    const { current, per, startDate, endDate } = this.state
    let printType = 'company'
    let dataForIndividualPrint = {}
    if (individualTaskData) {
      const { incompletedTasks, completedTasks, dailyHabits } = individualTaskData
      printType = 'individual'
      dataForIndividualPrint = {
        dailyHabits,
        completedTasks,
        incompletedTasks,
        data,
        current,
        per,
        startDate,
        endDate,
        selected,
      }
    }
    const dataForCompany = { data, current, per, startDate, endDate, selected }

    const binary =
      printType === 'company'
        ? await CompanyTaskReportPDF(dataForCompany)
        : await IndividualTaskReportPDF(dataForIndividualPrint)
    const binaryUrl = URL.createObjectURL(binary)

    window.open(binaryUrl, '__blank')
  }

  handleExcelReport = () => {
    this.props.onToggle({
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
    const { data } = this.props
    let companyTask = []
    data.individuals.map(item => {
      const excelData = {
        Requirements: item.name,
        'Task \nAssigned for month': `${item.report.tasks_assigned.count} \n100%`,
        'Task \nIncompl. for month': `${item.report.tasks_incomplete.count} \n${item.report.tasks_incomplete.percent}%`,
        'Task \nCompl. for month': `${item.report.tasks_completed.count} \n${item.report.tasks_completed.percent}%`,
        'Task \nCompl. on time': `${item.report.tasks_completed_on_time.count} \n${item.report.tasks_completed_on_time.percent}%`,
        'Task \nCompl. late': `${item.report.tasks_completed_late.count} \n${item.report.tasks_completed_late.percent}%`,
        'Task \nAve Compl. per day': item.report.avg_completions_per_day.toFixed(2),
        'Task \nAve time to compl.': convertAvgDays(item.report.avg_days.count),
        'Daily Habit': `${item.report.daily_completion.complete} \n${item.report.daily_completion.percent}%`,
        'Weekly Habit': `${item.report.weekly_completion.complete} \n${item.report.weekly_completion.percent}%`,
        'Monthly Habit': `${item.report.monthly_completion.complete} \n${item.report.monthly_completion.percent}%`,
      }
      companyTask.push(excelData)
    })
    const key = [
      'Requirements',
      'Task \nAssigned for month',
      'Task \nIncompl. for month',
      'Task \nCompl. for month',
      'Task \nCompl. on time',
      'Task \nCompl. late',
      'Task \nAve Compl. per day',
      'Task \nAve time to compl.',
      'Daily Habit',
      'Weekly Habit',
      'Monthly Habit',
    ]
    exportCsv(companyTask, key, 'Company Task Report', true)
  }

  render() {
    const { data, selected } = this.props
    const { current, per, startDate, endDate, column } = this.state
    const individuals = selected ? filter(e => e.id === selected, data.individuals) : data.individuals

    return (
      <div className="task-report card">
        <div className="d-flex justify-content-between mb-2 mb-md-4">
          <span className="dsl-b22 bold text-capitalize">{isNil(selected) ? 'Company' : 'Individual'} Task Report</span>
          <div className="d-flex align-items-center">
            <DatePicker
              calendar="range"
              append="caret"
              format="MMM D"
              as="span"
              align="right"
              mountEvent
              value={moment.range(startDate, endDate)}
              onSelect={this.handleDateChange}
            />
            <div className="ml-3">
              <Icon name="fal fa-print" size={16} color="#3a454f" onClick={this.handlePrintPDF} />
            </div>
            {isNil(selected) && (
              <div className="ml-3" data-cy="careerExcelIcon" onClick={this.handleExcelReport}>
                <Icon name="fal fa-file-excel" size={16} color="#343f4b" />
              </div>
            )}
          </div>
        </div>
        <ToggleColumnMenu
          column={column}
          onVisible={this.handleVisible}
          activeTab="company-report"
          className="d-md-none"
          total={3}
        />
        <div className="row">
          <div className="col-md-12 col-lg-8 pr-lg-0">
            <p className="d-flex-3 dsl-b16 tasks-start bold text-center ml-0 ml-md-5">Tasks Stats</p>
            <div className="d-flex list-item">
              <div className="d-flex-3 d-flex-sm-3">
                <p className="dsl-m12 text-400 ">Requirements</p>
              </div>
              <div className="d-flex d-flex-12 requirements-wrap">
                <div className={classNames('d-flex-1 text-right', (column == 2 || column == 3) && 'd-none d-md-block')}>
                  <p className="dsl-m12 mb-1 text-400">Assigned</p>
                  <p className="dsl-m12 text-400">for month</p>
                </div>
                <div className={classNames('d-flex-1 text-right', (column == 2 || column == 3) && 'd-none d-md-block')}>
                  <p className="dsl-m12 mb-1 text-400">Incomplete</p>
                  <p className="dsl-m12 text-400">for month</p>
                </div>
                <div className={classNames('d-flex-1 text-right', (column == 2 || column == 3) && 'd-none d-md-block')}>
                  <p className="dsl-m12 mb-1 text-400">Compl.</p>
                  <p className="dsl-m12 text-400">for month</p>
                </div>
                <div className={classNames('d-flex-1 text-right d-none d-md-block', column == 2 && 'd-block')}>
                  <p className="dsl-m12 mb-1 text-400">Compl.</p>
                  <p className="dsl-m12 text-400">on time</p>
                </div>
                <div className={classNames('d-flex-1 text-right d-none d-md-block', column == 2 && 'd-block')}>
                  <p className="dsl-m12 mb-1 text-400">Compl.</p>
                  <p className="dsl-m12 text-400">late</p>
                </div>
                <div
                  className={classNames(
                    'd-flex-1 text-right d-none d-md-block',
                    (column == 2 || column == 3) && 'd-block'
                  )}
                >
                  <p className="dsl-m12 mb-1 text-400">Ave Compl.</p>
                  <p className="dsl-m12 text-400">per day</p>
                </div>
                <div className={classNames('d-flex-1 text-right d-none d-md-block', column == 3 && 'd-block')}>
                  <p className="dsl-m12 mb-1 text-400">Ave Time</p>
                  <p className="dsl-m12 text-400">to compl.</p>
                </div>
                <div
                  className={classNames(
                    'edit-icon ml-1 pt-3 pl-4 pl-md-0 pt-md-0 d-none d-md-flex',
                    column == 3 && 'd-block',
                    'd-lg-none'
                  )}
                />
              </div>
            </div>
            {!selected && !isEmpty(data.totals) && (
              <div
                className={classNames(
                  'd-flex list-item pb-0 pt-0 pb-md-4 pt-md-4',
                  isNil(selected) ? '' : ' border-none'
                )}
              >
                <div className="d-flex-3 d-flex-sm-3 name custom-br-ssm">
                  <p className="dsl-b14 mb-0 text-400">Total</p>
                </div>
                <div className="d-flex d-flex-12 requirements-wrap">
                  <div
                    className={classNames(
                      'd-flex-1 text-right custom-br-ssm',
                      (column == 2 || column == 3) && 'd-none d-md-block'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{data.totals.tasks_assigned.count}</p>
                    <p className="dsl-m12 mb-0 text-400">100%</p>
                  </div>
                  <div
                    className={classNames(
                      'd-flex-1 text-right custom-br-ssm',
                      (column == 2 || column == 3) && 'd-none d-md-block'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{data.totals.tasks_incomplete.count}</p>
                    <p className="dsl-m12 mb-0 text-400">{data.totals.tasks_incomplete.percent}%</p>
                  </div>
                  <div
                    className={classNames(
                      'd-flex-1 text-right pt-3 pt-md-0',
                      (column == 2 || column == 3) && 'd-none d-md-block'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{data.totals.tasks_completed.count}</p>
                    <p className="dsl-m12 mb-0 text-400">{data.totals.tasks_completed.percent}%</p>
                  </div>
                  <div
                    className={classNames(
                      'd-flex-1 text-right custom-br-ssm d-none d-md-block',
                      column == 2 && 'd-block'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{data.totals.tasks_completed_on_time.count}</p>
                    <p className="dsl-m12 mb-0 text-400">{data.totals.tasks_completed_on_time.percent}%</p>
                  </div>
                  <div
                    className={classNames(
                      'd-flex-1 text-right custom-br-ssm d-none d-md-block',
                      column == 2 && 'd-block'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{data.totals.tasks_completed_late.count}</p>
                    <p className="dsl-m12 mb-0 text-400">{data.totals.tasks_completed_late.percent}%</p>
                  </div>
                  <div
                    className={classNames(
                      'd-flex-1 text-right d-none d-md-block',
                      (column == 2 || column == 3) && 'd-block pt-3 pt-md-0',
                      column == 3 && 'custom-br-ssm'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{data.totals.avg_completions_per_day?.toFixed(2) || 'NA'}</p>
                  </div>
                  <div
                    className={classNames(
                      'd-flex-1 text-right d-none d-md-block pt-3 pt-md-0',
                      column == 3 && 'd-block custom-br-ssm'
                    )}
                  >
                    <p className="dsl-b14 mb-1 text-400">{convertAvgDays(data.totals.avg_days?.count || 0)}</p>
                  </div>
                  <div
                    className={classNames(
                      'edit-icon ml-1 pt-3 pl-4 pl-md-0 pt-md-0 d-none d-md-flex',
                      column == 3 && 'd-block',
                      'd-lg-none'
                    )}
                  />
                </div>
              </div>
            )}
            {individuals.length > 0 ? (
              individuals.map(
                (item, index) =>
                  inPage(index, current, per) && (
                    <div
                      className={classNames(
                        'd-flex list-item pb-0 pt-0 pb-md-4 pt-md-4',
                        isNil(selected) ? '' : ' border-none'
                      )}
                      key={item.id}
                    >
                      <div
                        className="d-flex-3 d-flex-sm-3 name custom-br-ssm"
                        onClick={this.props.onClick.bind(this, item.id)}
                      >
                        <p className="dsl-b14 mb-0 text-400">{item.name}</p>
                      </div>
                      <div className="d-flex d-flex-12 requirements-wrap">
                        <div
                          className={classNames(
                            'd-flex-1 text-right custom-br-ssm',
                            (column == 2 || column == 3) && 'd-none d-md-block'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{item.report.tasks_assigned.count}</p>
                          <p className="dsl-m12 mb-0 text-400">100%</p>
                        </div>
                        <div
                          className={classNames(
                            'd-flex-1 text-right custom-br-ssm',
                            (column == 2 || column == 3) && 'd-none d-md-block'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{item.report.tasks_incomplete.count}</p>
                          <p className="dsl-m12 mb-0 text-400">{item.report.tasks_incomplete.percent}%</p>
                        </div>
                        <div
                          className={classNames(
                            'd-flex-1 text-right pt-3 pt-md-0',
                            (column == 2 || column == 3) && 'd-none d-md-block'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{item.report.tasks_completed.count}</p>
                          <p className="dsl-m12 mb-0 text-400">{item.report.tasks_completed.percent}%</p>
                        </div>
                        <div
                          className={classNames(
                            'd-flex-1 text-right custom-br-ssm d-none d-md-block',
                            column == 2 && 'd-block'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{item.report.tasks_completed_on_time.count}</p>
                          <p className="dsl-m12 mb-0 text-400">{item.report.tasks_completed_on_time.percent}%</p>
                        </div>
                        <div
                          className={classNames(
                            'd-flex-1 text-right custom-br-ssm d-none d-md-block',
                            column == 2 && 'd-block'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{item.report.tasks_completed_late.count}</p>
                          <p className="dsl-m12 mb-0 text-400">{item.report.tasks_completed_late.percent}%</p>
                        </div>
                        <div
                          className={classNames(
                            'd-flex-1 text-right d-none d-md-block',
                            (column == 2 || column == 3) && 'd-block pt-3 pt-md-0',
                            column == 3 && 'custom-br-ssm'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{item.report.avg_completions_per_day.toFixed(2)}</p>
                        </div>
                        <div
                          className={classNames(
                            'd-flex-1 text-right d-none d-md-block pt-3 pt-md-0',
                            column == 3 && 'd-block custom-br-ssm'
                          )}
                        >
                          <p className="dsl-b14 mb-1 text-400">{convertAvgDays(item.report.avg_days.count)}</p>
                        </div>
                        <div
                          className={classNames(
                            'edit-icon ml-1 pt-3 pl-4 pl-md-0 pt-md-0 d-none d-md-flex',
                            column == 3 && 'd-block',
                            'd-lg-none'
                          )}
                        >
                          <Icon name="fas fa-ellipsis-h text-500" color="#969faa" size={18} />
                        </div>
                      </div>
                    </div>
                  )
              )
            ) : (
              <p className="dsl-m12 text-center my-5">No records available</p>
            )}
          </div>
          <div className="col-md-12 col-lg-4 pl-lg-0 pb-1">
            <p className="d-flex-3 dsl-b16 bold text-center ml-5 tasks-start pb-4 pb-lg-2">Habits Completion</p>
            <div className="d-flex list-item pb-1 pb-lg-4">
              <div className="d-flex d-flex-3 d-flex-sm-2 habits-padding">
                <div className="d-flex-2 d-flex-ssm-1 d-lg-none">
                  <p className="dsl-m12 text-400 text-left">Requirements</p>
                </div>
                <span className="d-flex-1 dsl-m12 text-400">Daily</span>
                <span className="d-flex-1 dsl-m12 text-400">Weekly</span>
                <span className="d-flex-1 dsl-m12 text-400 text-right">Monthly</span>
                <div className="edit-icon ml-1  ml-1 pt-4 pt-md-0" />
              </div>
            </div>

            {!selected && !isEmpty(data.totals) && (
              <div
                className={classNames(
                  'd-flex list-item pb-0 pt-0 pb-md-4 pt-md-4',
                  isNil(selected) ? '' : ' border-none'
                )}
              >
                <div className="d-flex-2 d-flex-ssm-1 name d-lg-none custom-br-ssm">
                  <p className="dsl-b14 mb-0 text-400">Total</p>
                </div>
                <div className="d-flex-1 text-right custom-br-ssm">
                  <p className="dsl-b14 mb-1 text-400 ">{data.totals.daily_completion.complete}</p>
                  <p className="dsl-m12 mb-0 text-400 ">{data.totals.daily_completion.percent}%</p>
                </div>
                <div className="d-flex-1 text-right custom-br-ssm">
                  <p className="dsl-b14 mb-1 text-400 ">{data.totals.weekly_completion.complete}</p>
                  <p className="dsl-m12 mb-0 text-400">{data.totals.weekly_completion.percent}%</p>
                </div>
                <div className="d-flex-1 text-right pt-3 pt-md-0 custom-br-ssm">
                  <p className="dsl-b14 mb-1 text-400">{data.totals.monthly_completion.complete}</p>
                  <p className="dsl-m12 mb-0 text-400">{data.totals.monthly_completion.percent}%</p>
                </div>
                <div className="edit-icon d-flex ml-1 pt-4 pt-md-0" />
              </div>
            )}

            {individuals.length > 0 ? (
              individuals.map(
                (item, index) =>
                  inPage(index, current, per) && (
                    <div
                      className={classNames(
                        'd-flex list-item pb-0 pt-0 pb-md-4 pt-md-4',
                        isNil(selected) ? '' : ' border-none'
                      )}
                      key={item.id}
                    >
                      <div
                        className="d-flex-2 d-flex-ssm-1 name d-lg-none custom-br-ssm"
                        onClick={this.props.onClick.bind(this, item.id)}
                      >
                        <p className="dsl-b14 mb-0 text-400">{item.name}</p>
                      </div>
                      <div className="d-flex-1 text-right custom-br-ssm">
                        <p className="dsl-b14 mb-1 text-400 ">{item.report.daily_completion.complete}</p>
                        <p className="dsl-m12 mb-0 text-400 ">{item.report.daily_completion.percent}%</p>
                      </div>
                      <div className="d-flex-1 text-right custom-br-ssm">
                        <p className="dsl-b14 mb-1 text-400 ">{item.report.weekly_completion.complete}</p>
                        <p className="dsl-m12 mb-0 text-400">{item.report.weekly_completion.percent}%</p>
                      </div>
                      <div className="d-flex-1 text-right pt-3 pt-md-0 custom-br-ssm">
                        <p className="dsl-b14 mb-1 text-400">{item.report.monthly_completion.complete}</p>
                        <p className="dsl-m12 mb-0 text-400">{item.report.monthly_completion.percent}%</p>
                      </div>
                      <div className="edit-icon d-flex ml-1 pt-4 pt-md-0">
                        <Icon name="fas fa-ellipsis-h text-500" color="#969faa" size={18} />
                      </div>
                    </div>
                  )
              )
            ) : (
              <p className="dsl-m12 text-center my-5">No records available</p>
            )}
          </div>
        </div>
        {isNil(selected) && (
          <Pagination
            current={current}
            per={per}
            total={Math.ceil(individuals.length / per)}
            onChange={this.handlePagination}
            onPer={this.handlePer}
          />
        )}
      </div>
    )
  }
}

TaskReport.propTypes = {
  data: PropTypes.any,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  onTasks: PropTypes.func,
}

TaskReport.defaultProps = {
  data: [],
  selected: null,
  onClick: () => {},
  onTasks: () => {},
}

export default TaskReport
