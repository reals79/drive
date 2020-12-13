import React from 'react'
import { filter, values } from 'ramda'
import { extendMoment } from 'moment-range'
import originalMoment from 'moment'
import classNames from 'classnames'
import { Avatar, EditDropdown, Icon, Pagination, Rating } from '@components'
import { CompanyPerformanceReportMenu } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'

const moment = extendMoment(originalMoment)

const EmployeeList = ({ data, userRole, column, onReport, onSelectMenu, onPagination, onPer }) => {
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
          <span className="dsl-m12">Completed</span>
        </div>
        <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block')} />
      </div>
      {data.users.length > 0 ? (
        <>
          {data.users.map((item, index) => {
            const { performance, user, scorecards } = item
            let editOptions = []
            if (scorecards?.length === 0) {
              editOptions = filter(
                e =>
                  e !== 'Unassign Scorecard' &&
                  e !== 'Preview Scorecard' &&
                  e !== 'Start Review' &&
                  e !== 'Save Actuals',
                CompanyPerformanceReportMenu[userRole]
              )
            } else {
              editOptions = filter(e => e !== 'Assign Scorecard', CompanyPerformanceReportMenu[userRole])
            }
            if (performance?.status === 2) {
              editOptions = filter(e => e !== 'Save Actuals' && e !== 'Start Review', editOptions)
            }
            return (
              <div key={index} className="list-item pb-0 pb-md-4">
                <div className="d-flex-4 d-flex align-items-center text-400 custom-br-ssm mr-2 mr-md-0">
                  <Avatar
                    size="tiny"
                    type="initial"
                    url={user?.profile?.avatar}
                    name={`${user?.profile?.first_name} ${user?.profile?.last_name}`}
                    backgroundColor={avatarBackgroundColor(user?.id)}
                  />
                  <div className="dsl-b14 ml-3 cursor-pointer text-400" onClick={() => onReport(item)}>
                    {user?.profile?.first_name}&nbsp;{user?.profile?.last_name}
                  </div>
                </div>
                <div
                  className={classNames(
                    'd-flex-4 truncate cursor-pointer text-400 custom-br-ssm mr-1 mr-md-0 pt-4 pt-md-0',
                    column == 2 && 'd-none d-md-block'
                  )}
                  onClick={() => onReport(item)}
                >
                  <span className="dsl-b14 text-400">
                    {performance?.status == 2
                      ? values(performance?.data?.scorecards)[0]?.title
                      : scorecards?.length > 0
                      ? scorecards[0]?.title
                      : 'No Scorecard Assigned'}
                  </span>
                </div>
                <div className="d-flex-1 d-none d-md-block" />
                <div className={classNames('d-flex-3 text-400 ml-1 ml-md-0', column == 2 && 'd-none d-md-block')}>
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
                <div
                  className={classNames(
                    'd-flex-2 d-flex-ssm-3 custom-br-ssm mr-2 mr-md-0 pt-4 pt-md-0 d-none d-md-block',
                    column == 2 && 'd-block'
                  )}
                >
                  {performance?.status === 2 && scorecards?.length > 0 ? (
                    <>
                      <Icon name="fal fa-graduation-cap" color="#343f4b" size={14} />
                      <span className="dsl-b14 ml-1">{performance?.trainings?.length},</span>
                      <Icon name="fal fa-check-circle ml-2" color="#343f4b" size={14} />
                      <span className="dsl-b14 ml-1">{performance?.tasks?.length}</span>
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
                  {performance?.status == 2 ? (
                    <span className="dsl-b14">{moment(performance?.completed_at).format('MMM DD, YY')}</span>
                  ) : (
                    <span className="dsl-b14">Incomplete</span>
                  )}
                </div>
                <div
                  className={classNames(
                    'd-flex-1 text-right d-none d-md-block text-400 pt-1',
                    column == 2 && 'd-block'
                  )}
                >
                  <EditDropdown options={editOptions} onChange={onSelectMenu(item)} />
                </div>
              </div>
            )
          })}
          <Pagination
            current={data.page}
            total={data.last_page}
            per={data.per_page}
            onChange={onPagination}
            onPer={onPer}
          />
        </>
      ) : (
        <p className="dsl-m12 text-center my-5">No records available</p>
      )}
    </>
  )
}

export default EmployeeList
