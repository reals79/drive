import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import classNames from 'classnames'
import { Avatar, HoverDropdown as HDropdown, EditDropdown } from '@components'
import { CertificationReportMenu } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'
import './Certifications.scss'

const EmployeesReport = ({ role, data, onClick, history, column }) => {
  return (
    <div className="employees-report-list" data-cy="employeesList">
      <div className="d-flex border-bottom py-3">
        <div className="d-flex-6 d-flex-ssm-6 dsl-m12 text-400" data-cy="employeeCol">
          Employee
        </div>
        <div
          data-cy="openCol"
          className={classNames(
            'd-flex-1 d-flex-ssm-3 dsl-m12 text-400 ml-3 ml-md-1 text-right',
            column == 2 && 'd-none d-md-block'
          )}
        >
          Open
        </div>
        <div
          data-cy="certificationCol"
          className={classNames('d-flex-8 dsl-m12 d-flex-ssm-5 px-3 text-400 ml-1', column == 2 && 'd-none d-md-block')}
        >
          Certifications
        </div>
        <div
          data-cy="completedCol"
          className={classNames(
            'd-flex-2 d-flex-ssm-4 dsl-m12 text-400 d-none d-md-block ml-3 ml-md-0',
            column == 2 && 'd-block pl-3 pl-md-0'
          )}
        >
          Completed
        </div>
        <div
          data-cy="completedCertificationCol"
          className={classNames(
            'd-flex-8 d-flex-ssm-5 dsl-m12 px-0 px-md-0 text-400 d-none d-md-block',
            column == 2 && 'd-block'
          )}
        >
          Certifications
        </div>
        <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block  d-flex-ssm-3')} />
      </div>
      {isEmpty(data) ? (
        <div className="d-center pt-4" data-cy="no-certification-assigned">
          <span className="dsl-m16">No certifications Assigned</span>
        </div>
      ) : (
        data?.map(user => {
          const name = `${user?.profile?.first_name}  ${user?.profile?.last_name}`
          const openCerts = user?.stats?.open_certifications?.map(e => {
            const { id, title } = e
            return {
              id,
              title,
              program: e,
            }
          })

          const completedCerts = user?.stats?.completed_certifications?.map(e => {
            const { id, title } = e
            return {
              id,
              title,
              program: e,
            }
          })
          const certs = user?.stats?.open_certifications[0]
          let editOptions = []
          if (openCerts?.length === 0 && completedCerts?.length === 0) {
            editOptions = CertificationReportMenu[role].filter(option => option === 'Assign Certification')
          } else {
            editOptions = CertificationReportMenu[role]
          }
          return (
            <div
              data-cy="employeeRowItem"
              className="d-flex align-items-center border-bottom py-0 py-md-4"
              key={user.id}
            >
              <div
                data-cy="avatar"
                className="d-flex d-flex-ssm-6 align-items-center d-flex-6 cursor-pointer custom-br-ssm"
                onClick={() => onClick('view certification', certs, null, 'employees')}
              >
                <Avatar
                  url={user.profile.avatar}
                  name={name}
                  type="initial"
                  backgroundColor={avatarBackgroundColor(user.id)}
                  onToggle={() => history.push(`/library/record-employee-info/${user.id}`)}
                />
                <span data-cy="employeeName" className="dsl-b14 ml-3 text-400 text-break">
                  {name}
                </span>
              </div>
              <div
                data-cy="employeerowOpenVal"
                className={classNames(
                  'd-flex-1 dsl-b14 text-right text-400 d-flex-ssm-3 custom-br-ssm pt-4 pt-md-0',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                {user?.stats?.open}
              </div>
              <div
                data-cy="certificationStat"
                className={classNames(
                  'd-flex-8 d-flex-ssm-5 dsl-b14 px-3 text-400',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                {isEmpty(openCerts) ? (
                  <span className="dsl-b14 ml-2 text-400">Nothing open</span>
                ) : (
                  <HDropdown
                    data={openCerts}
                    getValue={e => e.title}
                    onClick={data => onClick('view certification', data, null, 'employees')}
                    width="100%"
                  />
                )}
              </div>
              <div
                data-cy="completedStat"
                className={classNames(
                  'd-flex-2 d-flex-ssm-4 dsl-b14 text-right text-400 custom-br-ssm pt-4 pt-md-0 d-none d-md-block',
                  column == 2 && 'd-block'
                )}
              >
                {user?.stats?.completed}
              </div>
              <div
                data-cy="completedCertificationStat"
                className={classNames(
                  'd-flex-8 d-flex-ssm-5 dsl-b14 px-0 px-md-3 d-none d-md-block pt-3 pt-md-0',
                  column == 2 && 'd-block custom-br-ssm'
                )}
              >
                {isEmpty(completedCerts) ? (
                  <div className="dsl-b14 ml-2 pl-1 ml-sm-0 ml-md-1 text-400">Nothing completed</div>
                ) : (
                  <HDropdown
                    data={completedCerts}
                    getValue={e => e.title}
                    onClick={data => onClick('view certification', data, null, 'employees')}
                    width="100%"
                  />
                )}
              </div>
              <div
                data-cy="threeDotMenu"
                className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block d-flex-ssm-3 edit-dm-col')}
              >
                {editOptions.length !== 0 && (
                  <EditDropdown
                    options={editOptions}
                    onChange={e => onClick(e, user.stats.open_certifications, user, 'employees')}
                  />
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

EmployeesReport.propTypes = {
  admin: PropTypes.bool,
  data: PropTypes.array,
  onClick: PropTypes.func,
}

EmployeesReport.defaultProps = {
  admin: false,
  data: [],
  onClick: () => {},
}

export default EmployeesReport
