import React, { useState } from 'react'
import { values } from 'ramda'
import { extendMoment } from 'moment-range'
import originalMoment from 'moment'
import classNames from 'classnames'
import { Avatar, EditDropdown, Icon, Pagination, Rating } from '@components'
import { CompanyPerformanceReportMenu } from '~/services/config'
import { avatarBackgroundColor, inPage } from '~/services/util'

const moment = extendMoment(originalMoment)

const OrgEmployeeList = ({ column, userRole, employees, onReport, onSelectMenu }) => {
  const [current, setCurrent] = useState(1)
  const [per, setPer] = useState(10)

  const handlePer = e => {
    if (e > 10) setCurrent(1)
    setPer(e)
  }

  return (
    <>
      <div className="list-title mt-2 pb-2 pl-0">
        <div className="d-flex-4">
          <span className="dsl-m12">Employee</span>
        </div>
        <div className={classNames('d-flex-4', column == 2 && 'd-none d-md-block')}>
          <span className="dsl-m12">Scorecard</span>
        </div>
        <div className="d-flex-1 d-none d-md-block" />
        <div className={classNames('d-flex-3 ml-1 ml-md-0', column == 2 && 'd-none d-md-block')}>
          <span className="dsl-m12">Score</span>
        </div>
        <div className={classNames('d-flex-2 d-flex-ssm-3 mr-2 mr-md-0 d-none d-md-block', column == 2 && 'd-block')}>
          <span className="dsl-m12">Tasks & Training</span>
        </div>
        <div className={classNames('d-flex-2 d-flex-ssm-3 d-none d-md-block text-right', column == 2 && 'd-block')}>
          <span className="dsl-m12 ">Completed</span>
        </div>
        <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block')} />
      </div>
      {employees?.map((item, index) => {
        let editOptions = []
        let scorecard = null
        const data = {
          scorecards: item?.scorecard ? [item?.scorecard] : [],
          user: item,
          performance: item?.performance,
          company: { id: item?.company_id },
        }
        if (!data.scorecards.length) {
          editOptions = CompanyPerformanceReportMenu[userRole].filter(
            option =>
              option !== 'Save Actuals' &&
              option !== 'Start Review' &&
              option !== 'Unassign Scorecard' &&
              option !== 'Save Actuals' &&
              option !== 'Preview Scorecard'
          )
        } else {
          editOptions = CompanyPerformanceReportMenu[userRole].filter(option => option !== 'Assign Scorecard')
          scorecard = item.scorecard
        }
        if (item?.performance?.status === 2) {
          editOptions = editOptions.filter(option => option !== 'Save Actuals' && option !== 'Start Review')
        }

        if (inPage(index, current, per)) {
          return (
            <div key={item.id} className="list-item">
              <div className="d-flex-4 d-flex align-items-center text-400 custom-br-ssm mr-2 mr-md-0">
                <Avatar
                  size="tiny"
                  type="initial"
                  url={item?.profile?.avatar}
                  name={`${item?.profile?.first_name} ${item?.profile?.last_name}`}
                  backgroundColor={avatarBackgroundColor(item?.id)}
                />
                <div className="dsl-b14 ml-3 cursor-pointer text-400" onClick={() => onReport(data)}>
                  {item?.profile?.first_name}&nbsp;{item?.profile?.last_name}
                </div>
              </div>
              <div
                className={classNames(
                  'd-flex-4 truncate cursor-pointer text-400 custom-br-ssm mr-1 mr-md-0 pt-4 pt-md-0',
                  column == 2 && 'd-none d-md-block'
                )}
                onClick={() => onReport(data)}
              >
                <span className="dsl-b14 text-400">
                  {item?.performance?.status == 2
                    ? values(item?.performance.data.scorecards)[0].title
                    : item?.scorecard
                    ? item?.scorecard?.title
                    : 'No Scorecard Assigned'}
                </span>
              </div>
              <div className="d-flex-1 d-none d-md-block" />
              <div className={classNames('d-flex-3 text-400 ml-1 ml-md-0', column == 2 && 'd-none d-md-block')}>
                {item?.performance?.status === 2 ? (
                  <>
                    {item?.performance?.data?.completed_average_star_rating === 'N/A' ? (
                      <span className="dsl-b14">Na (Per Manager)</span>
                    ) : (
                      <Rating score={item?.performance?.data?.completed_average_star_rating} />
                    )}
                  </>
                ) : (
                  <span className="dsl-b14">Incomplete</span>
                )}
              </div>
              <div
                className={classNames(
                  'd-flex-2 d-flex-ssm-3 custom-br-ssm mr-2 mr-md-0 pt-4 pt-md-0 d-none d-md-block',
                  column == 2 && 'd-block'
                )}
              >
                {item?.performance?.status === 2 && data?.scorecards.length > 0 ? (
                  <>
                    <Icon name="fal fa-graduation-cap" color="#343f4b" size={14} />
                    <span className="dsl-b14 ml-1">{item?.performance?.trainings?.length},</span>
                    <Icon name="fal fa-check-circle ml-2" color="#343f4b" size={14} />
                    <span className="dsl-b14 ml-1">{item?.performance?.tasks?.length}</span>
                  </>
                ) : (
                  <span className="dsl-b14">N/A</span>
                )}
              </div>
              <div
                className={classNames(
                  'd-flex-2 d-flex-ssm-3 d-none d-md-block pt-4 pt-md-0 text-right',
                  column == 2 && 'd-block custom-br-ssm'
                )}
              >
                {item?.performance?.status == 2 ? (
                  <span className="dsl-b14">{moment(item?.performance.completed_at).format('MMM DD, YY')}</span>
                ) : (
                  <span className="dsl-b14">Incomplete</span>
                )}
              </div>
              <div
                className={classNames('d-flex-1 text-right d-none d-md-block text-400 pt-1', column == 2 && 'd-block')}
              >
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
    </>
  )
}

export default OrgEmployeeList
