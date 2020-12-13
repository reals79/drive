import React, { Component } from 'react'
import { keys, values } from 'ramda'
import { extendMoment } from 'moment-range'
import originalMoment from 'moment'
import classNames from 'classnames'
import { Avatar, EditDropdown, Pagination, Rating } from '@components'
import { CompanyPerformanceMenu } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'

const moment = extendMoment(originalMoment)

const calcInput = (item, startDate, endDate, type = 'status') => {
  if (item.scorecards && item.scorecards.length > 0) {
    const scorecard = item.scorecards[0]
    const quotas = scorecard.quotas
    if (!quotas.length) return type === 'status' ? 'No Scorecard' : 'NA'
    let sum = 0
    quotas.forEach(_quota => {
      const actuals = _quota.actuals.filter(
        actual => actual.actual && moment(actual.actual_at).isBetween(startDate, endDate, 'day')
      )
      if (actuals.length > 0) sum++
    })

    if (type === 'status') {
      return item.performance?.status == 2 ? 'Completed' : 'Incomplete'
    } else {
      const percent = ((100 * sum) / quotas.length).toFixed(2).toString()
      return item.performance?.status == 2 ? '100%' : `${Number(percent)}%`
    }
  } else {
    if (item.performance?.status == 2) return type === 'status' ? 'Completed' : '100%'
    else return type === 'status' ? 'No Scorecard' : 'NA'
  }
}

class EmployeeList extends Component {
  render() {
    const {
      data,
      userRole,
      column,
      startDate,
      endDate,
      onRowClick,
      onReport,
      onSelectMenu,
      onScorecardDetail,
      onPagination,
      onPer,
    } = this.props

    return (
      <div className="card employee-block">
        <div className="list-title mt-2 pb-2">
          <div className="d-flex-3 mr-3 mr-md-0">
            <span className="dsl-m12" dataCy="employeeCol">
              Employee
            </span>
          </div>
          <div className="d-flex-3 ml-2">
            <span className="dsl-m12" dataCy="scorecardCol">
              Scorecard
            </span>
          </div>
          <div className="d-flex-1 d-flex-ssm-2 m-2 pl-3 pl-md-0 text-right">
            <span className="dsl-m12" dataCy="statusCol">
              Actuals
            </span>
          </div>
          <div className="d-flex-3 d-flex-ssm-4 pl-3 pl-md-5 text-left">
            <span className="dsl-m12" dataCy="statusCol">
              Status
            </span>
          </div>
          <div className="d-flex-3 ml-5 ml-md-0 text-left">
            <span className="dsl-m12" dataCy="scoreCol">
              Score
            </span>
          </div>
          <div className="d-flex-2 text-right">
            <span className="dsl-m12 pl-1 pl-md-0" dataCy="taskTrainingCol">
              Date
            </span>
          </div>
          <div className="d-flex-1 d-flex-ssm-2" dataCy="threeDotCol" />
        </div>
        {data.users.map((item, index) => {
          let editOptions = []
          let scorecard = null
          if (!item.scorecards.length) {
            editOptions = CompanyPerformanceMenu[userRole].filter(
              option => option !== 'Save Actuals' && option !== 'Start Review' && option !== 'Unassign Scorecard'
            )
          } else {
            editOptions = CompanyPerformanceMenu[userRole].filter(option => option !== 'Assign Scorecard')
            scorecard = item.scorecards[0]
          }
          const { performance } = item
          if (performance?.status == 2) {
            editOptions = editOptions.filter(option => option !== 'Save Actuals' && option !== 'Start Review')
          }
          if (item.scorecards.length == 0) {
            editOptions = editOptions.filter(option => option !== 'Save Actuals' && option !== 'Preview Scorecard')
          }

          return (
            <div
              key={index}
              className="list-item"
              dataCy="performanceListItem"
              onClick={onRowClick(item, 'start review')}
            >
              <div className="d-flex-3 d-flex align-items-center custom-br-ssm employee-title" dataCy="avatar">
                <div className="d-flex align-items-center">
                  <Avatar
                    size="tiny"
                    type="initial"
                    url={item?.user?.profile?.avatar}
                    name={`${item?.user?.profile?.first_name || ''} ${item?.user?.profile?.last_name || ''}`}
                    backgroundColor={avatarBackgroundColor(item?.user?.id)}
                  />
                  <span
                    dataCy="employeeName"
                    className="d-none d-lg-block dsl-b14 ml-3 cursor-pointer text-break"
                    onClick={onReport(item)}
                  >
                    {`${item?.user?.profile?.first_name || ''} ${item?.user?.profile?.last_name || ''}`}
                  </span>
                  <span
                    dataCy="employeeName"
                    className="d-lg-none d-md-block d-sm-block dsl-b14 ml-3 cursor-pointer text-break"
                    onClick={onReport(item)}
                  >
                    {item?.user?.profile?.last_name !== null
                      ? `${item?.user?.profile?.first_name || ''} ${item?.user?.profile?.last_name.substring(0, 1) ||
                          ''}`
                      : ''}
                  </span>
                </div>
                <div dataCy="threeDotMenuItem" className="right-edit">
                  <EditDropdown options={editOptions} onChange={onSelectMenu(item)} />
                </div>
              </div>
              <div
                dataCy="scorecardTitle"
                className="d-flex-3 truncate-one ml-2 cursor-pointer emp-listing"
                onClick={onScorecardDetail(scorecard)}
              >
                <label className="dsl-b12 mb-0">Scorecard</label>
                <span className={classNames('dsl-b14 truncate', !scorecard && 'score-detail')}>
                  {performance?.status == 2
                    ? values(performance.data.scorecards)[0].title
                    : item?.scorecards.length > 0
                    ? item?.scorecards[0]?.title
                    : 'No Scorecard Assigned'}
                </span>
              </div>
              <div className="d-flex-1 d-flex-ssm-2 m-2 px-3 px-md-0 pt-2 pt-md-0 text-right emp-listing">
                <label className="dsl-b12 mb-0">Actuals</label>
                <span className="dsl-b14">{calcInput(item, startDate, endDate, 'actuals')}</span>
              </div>
              <div
                dataCy="statusStat"
                className="d-flex-3 d-flex-ssm-4 px-3 px-md-0 pt-2 pt-md-0 pl-md-5 text-left emp-listing"
              >
                <label className="dsl-b12 mb-0">Status</label>
                <span className="dsl-b14">{calcInput(item, startDate, endDate, 'status')}</span>
              </div>
              <div dataCy="scoreStat" className="d-flex-3 pl-1 pl-md-0 text-left emp-listing">
                <label className="dsl-b12 mb-0">Score</label>
                {performance?.status === 2 ? (
                  <>
                    {performance?.data?.completed_average_star_rating === 'N/A' ? (
                      <span className="dsl-b14">Na (Per Manager)</span>
                    ) : (
                      <Rating score={performance?.data?.completed_average_star_rating} />
                    )}
                  </>
                ) : (
                  <span className="dsl-b14">Incomplete</span>
                )}
              </div>
              <div className="d-flex-2 text-left pt-4 pt-md-0 pr-0 pl-1 pl-md-0 text-right emp-listing">
                <label className="dsl-b12 mb-0">Date</label>
                <span className="dsl-b14">
                  {performance?.completed_at ? moment(performance.completed_at).format('MMM DD, YY') : 'NA'}
                </span>
              </div>
              <div dataCy="threeDotMenuItem" className="d-flex-1 d-flex-ssm-2 emp-listing emp-editdrop">
                <EditDropdown options={editOptions} onChange={onSelectMenu(item)} />
              </div>
            </div>
          )
        })}
        <Pagination
          dataCy="performanceReviewPagination"
          current={data.page}
          total={data.last_page}
          per={data.per_page}
          onChange={onPagination}
          onPer={onPer}
        />
      </div>
    )
  }
}

export default EmployeeList
