import React, { memo } from 'react'
import { Avatar, Button } from '@components'
import { avatarBackgroundColor } from '~/services/util'
import './CompanyQuota.scss'

const EmployeeQuotaList = ({ data, history, onReport, onShowModal }) => {
  return (
    <>
      <p className="dsl-b16 bold my-2 text-left">Employee assigned</p>
      <div className="d-flex">
        <div className="d-flex-4">
          <p className="dsl-m10 text-400 text-left">Employee name</p>
        </div>
        <div className="d-flex-1 text-right">
          <p className="dsl-m10 text-400">Actuals</p>
        </div>
      </div>
      {data.map((item, index) => {
        const { id, profile, actual_average } = item
        const { first_name, last_name, avatar } = profile
        return (
          index < 10 && (
            <div className="d-flex py-1" key={index} onClick={() => onReport(id)}>
              <div className="d-flex d-flex-4">
                <Avatar
                  className="d-flex-1"
                  url={avatar}
                  size="tiny"
                  type="initial"
                  name={`${first_name} ${last_name}`}
                  backgroundColor={avatarBackgroundColor(id)}
                  onToggle={() => history.push(`/library/record-employee-info/${id}`)}
                />
                <div className="d-flex-3 dsl-b14 ml-2 text-left text-400 align-self-center">
                  {`${first_name} ${last_name}`}
                </div>
              </div>
              <div className="d-flex-1 text-right dsl-b12 text-400 align-self-center">
                <span className="dsl-b12 text-400"> {actual_average}</span>
              </div>
            </div>
          )
        )
      })}
      <div className="d-h-end">
        <Button className="employees-button" name="SHOW MORE" onClick={onShowModal} />
      </div>
    </>
  )
}

export default memo(EmployeeQuotaList)
