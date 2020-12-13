import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import classNames from 'classnames'
import { Icon, HoverDropdown as HDropdown, EditDropdown } from '@components'
import { CertificationReportMenu } from '~/services/config'
import './Certifications.scss'

const CertReport = ({ role, data, onClick, column }) => {
  return (
    <div className="certifications-report-list">
      <div className="d-flex border-bottom py-3">
        <div className="d-flex-7 dsl-m12 text-400 d-flex-ssm-5">Certifications</div>
        <div
          className={classNames(
            'd-flex-1 d-flex-ssm-3 dsl-m12 ml-2 ml-md-1 text-400 text-right',
            column == 2 && 'd-none d-md-block'
          )}
        >
          Open
        </div>
        <div
          className={classNames('d-flex-8 dsl-m12 ml-1 px-3 text-400 d-flex-ssm-5', column == 2 && 'd-none d-md-block')}
        >
          Employees
        </div>
        <div
          className={classNames(
            'd-flex-2 d-flex-ssm-3 dsl-m12 ml-md-1 text-400 d-none d-md-block',
            column == 2 && 'd-block'
          )}
        >
          Completed
        </div>
        <div
          className={classNames(
            'd-flex-8 d-flex-ssm-5 dsl-m12 px-md-3 text-400 d-none d-md-block',
            column == 2 && 'd-block'
          )}
        >
          Employees
        </div>
        <div className="d-flex-1 d-flex-ssm-2 d-none d-md-block" />
      </div>
      {isEmpty(data) ? (
        <div className="d-center pt-4">
          <span className="dsl-m16">No certifications Assigned</span>
        </div>
      ) : (
        data?.map(program => {
          const openEmployees = program?.stats.open_employees?.map(e => {
            const { id, profile, program } = e
            return {
              id,
              value: `${profile.first_name} ${profile.last_name}`,
              program,
            }
          })
          const completedEmployees = program?.stats.completed_employees?.map(e => {
            const { id, profile, program } = e
            return {
              id,
              value: `${profile.first_name} ${profile.last_name}`,
              program,
            }
          })
          let editOptions = CertificationReportMenu[role].filter(
            option => option !== 'Edit Certification' && option !== 'Save Actuals'
          )
          return (
            <div className="d-flex align-items-center border-bottom py-0 py-md-4" key={program.id}>
              <div
                className="d-flex align-items-center d-flex-7 cursor-pointer custom-br-ssm d-flex-ssm-5"
                onClick={() => onClick('view certification', program, null, 'certifications')}
              >
                <Icon name="fal fa-file-certificate" size={22} />
                <span className="dsl-b14 ml-3 text-400 text-break">{program?.title}</span>
              </div>
              <div
                className={classNames(
                  'd-flex-1 d-flex-ssm-3 dsl-b14 text-right text-400 custom-br-ssm pt-4 pt-md-0',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                {program?.stats?.open}
              </div>
              <div
                className={classNames(
                  'd-flex-8 dsl-b14 px-3 text-400 d-flex-ssm-5',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                <HDropdown
                  placeholder="No employee"
                  data={openEmployees}
                  onClick={data => onClick('view certification', data, null, 'employees')}
                  width="100%"
                />
              </div>
              <div
                className={classNames(
                  'd-flex-2 d-flex-ssm-3 dsl-b14 text-right text-400 custom-br-ssm pt-4 pt-md-0 d-none d-md-block',
                  column == 2 && 'd-block'
                )}
              >
                {program?.stats?.completed}
              </div>
              <div
                className={classNames(
                  'd-flex-8 d-flex-ssm-5 dsl-b14 px-md-3 text-400 d-none d-md-block',
                  column == 2 && 'd-block custom-br-ssm pt-3 pt-md-0'
                )}
              >
                <HDropdown
                  placeholder="No employee"
                  data={completedEmployees}
                  onClick={data => onClick('view certification', data, null, 'employees')}
                  width="100%"
                />
              </div>
              <div
                className={classNames('d-flex-1 d-flex-ssm-2 d-none d-md-block', column == 2 && 'd-block edit-dm-col')}
              >
                <EditDropdown options={editOptions} onChange={e => onClick(e, program, null, 'certifications')} />
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

CertReport.propTypes = {
  admin: PropTypes.bool,
  data: PropTypes.array,
  onClick: PropTypes.func,
}

CertReport.defaultProps = {
  admin: false,
  data: [],
  onClick: () => {},
}

export default CertReport
