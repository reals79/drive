import React, { useState } from 'react'
import { values } from 'ramda'
import { extendMoment } from 'moment-range'
import originalMoment from 'moment'
import classNames from 'classnames'
import { Avatar, EditDropdown, Pagination, Rating } from '@components'
import { CompanyPerformanceMenu } from '~/services/config'
import { avatarBackgroundColor, inPage } from '~/services/util'

const moment = extendMoment(originalMoment)

const calcInput = (item, startDate, endDate, type = 'status') => {
  if (item?.scorecard) {
    const scorecard = item.scorecard
    const quotas = scorecard.quotas
    if (!quotas.length) return type === 'status' ? 'No Scorecard' : 'NA'
    let sum = 0
    quotas.forEach(_quota => {
      const actuals = _quota.actuals.filter(actual => moment(actual.actual_at).isBetween(startDate, endDate, 'day'))
      if (actuals.length > 0) sum += 1
    })

    if (type === 'status') {
      return item?.performance?.status == 2 ? 'Completed' : 'Incomplete'
    } else {
      const percent = ((100 * sum) / quotas.length).toFixed(2).toString()
      return item?.performance?.status == 2 ? '100%' : `${Number(percent)}%`
    }
  } else {
    if (item?.performance?.status == 2) return type === 'status' ? 'Completed' : '100%'
    else return type === 'status' ? 'No Scorecard' : 'NA'
  }
}

const OrgEmployeeList = ({
  column,
  userRole,
  employees,
  startDate,
  endDate,
  onRowClick,
  onReport,
  onSelectMenu,
  onScorecardDetail,
}) => {
  const [current, setCurrent] = useState(1)
  const [per, setPer] = useState(10)

  const handlePer = e => {
    if (e > 10) setCurrent(1)
    setPer(e)
  }

  return (
    <div className="card employee-block">
      <div className="list-title mt-2 pb-2">
        <div className="d-flex-3 mr-3 mr-md-0">
          <span className="dsl-m12">Employee</span>
        </div>
        <div className="d-flex-3 ml-2">
          <span className="dsl-m12">Scorecard</span>
        </div>
        <div className="d-flex-1 m-2 pl-3 pl-md-0 text-right">
          <span className="dsl-m12">Actuals</span>
        </div>
        <div className="d-flex-3 pl-3 pl-md-5 text-left">
          <span className="dsl-m12">Status</span>
        </div>
        <div className="d-flex-3 ml-5 ml-md-0 text-left">
          <span className="dsl-m12">Score</span>
        </div>
        <div className="d-flex-1" />
      </div>
      {employees?.map((item, index) => {
        let editOptions = []
        let scorecard = null
        const data = {
          scorecards: item?.scorecard ? [item?.scorecard] : [],
          user: item,
        }
        if (!data.scorecards.length) {
          editOptions = CompanyPerformanceMenu[userRole].filter(
            option => option !== 'Save Actuals' && option !== 'Start Review' && option !== 'Unassign Scorecard'
          )
        } else {
          editOptions = CompanyPerformanceMenu[userRole].filter(option => option !== 'Assign Scorecard')
          scorecard = item.scorecard
        }
        if (item?.performance?.status == 2) {
          editOptions = editOptions.filter(option => option !== 'Save Actuals' && option !== 'Start Review')
        }
        if (data?.scorecards.length == 0) {
          editOptions = editOptions.filter(option => option !== 'Save Actuals' && option !== 'Preview Scorecard')
        }

        if (inPage(index, current, per)) {
          return (
            <div key={item.id} className="list-item" onClick={onRowClick(item, 'start review')}>
              <div className="d-flex-3 d-flex align-items-center custom-br-ssm employee-title">
                <div className="d-flex align-items-center">
                  <Avatar
                    size="tiny"
                    type="initial"
                    url={item?.profile?.avatar}
                    name={`${item?.profile?.first_name || ''} ${item?.profile?.last_name || ''}`}
                    backgroundColor={avatarBackgroundColor(item?.id)}
                  />
                  <span className="dsl-b14 ml-3 cursor-pointer text-break" onClick={onReport(data)}>
                    {`${item?.profile?.first_name || ''} ${item?.profile?.last_name || ''}`}
                  </span>
                </div>

                <div className="right-edit">
                  <EditDropdown options={editOptions} onChange={onSelectMenu(data)} />
                </div>
              </div>
              <div
                className="d-flex-3 truncate-one ml-2 cursor-pointer emp-listing d-flex"
                onClick={onScorecardDetail(scorecard)}
              >
                <label className="dsl-b12 mb-0">Scorecard</label>
                <span className={classNames('dsl-b14 truncate', !scorecard && 'score-detail')}>
                  {item?.performance?.status == 2
                    ? values(item?.performance.data.scorecards)[0].title
                    : item?.scorecard
                    ? item?.scorecard?.title
                    : 'No Scorecard Assigned'}
                </span>
              </div>
              <div className="d-flex-1 ml-2 px-3 px-md-0 pt-2 pt-md-0 text-right emp-listing d-flex">
                <label className="dsl-b12 mb-0">Actuals</label>
                <span className="dsl-b14">{calcInput(item, startDate, endDate, 'actuals')}</span>
              </div>
              <div className="d-flex-3 px-3 px-md-0 pt-2 pt-md-0 pl-md-5 text-left emp-listing d-flex">
                <label className="dsl-b12 mb-0">Status</label>
                <span className="dsl-b14">{calcInput(item, startDate, endDate, 'status')}</span>
              </div>
              <div className="d-flex-3 pl-1 pl-md-0 text-left emp-listing d-flex">
                <label className="dsl-b12 mb-0">Score</label>
                {item?.performance?.status === 2 ? (
                  <>
                    {item?.performance?.data?.completed_average_star_rating === 'N/A' ? (
                      <span className="dsl-b14">Na (Per Manager)</span>
                    ) : (
                      <Rating score={item?.performance?.data?.completed_average_star_rating} />
                    )}
                  </>
                ) : !item?.scorecard ? (
                  <span className="dsl-b14">No Scorecard</span>
                ) : (
                  <span className="dsl-b14">Incomplete</span>
                )}
              </div>
              <div className="d-flex-1 emp-listing d-flex emp-editdrop">
                <EditDropdown options={editOptions} onChange={onSelectMenu(data)} />
              </div>
            </div>
          )
        }
      })}
      {employees.length > 10 && (
        <Pagination
          current={current}
          total={Math.ceil(employees?.length / per)}
          per={per}
          pers={[10, 25, 50, 'all']}
          onChange={e => setCurrent(e)}
          onPer={handlePer}
        />
      )}
    </div>
  )
}

export default OrgEmployeeList
