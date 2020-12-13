import React from 'react'
import PropTypes from 'prop-types'
import { equals, isNil, find, propEq, keys, length } from 'ramda'
import moment from 'moment'
import classNames from 'classnames'
import { Avatar, EditDropdown } from '@components'
import { ManageReportMenu } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'
import './CareerList.scss'

function Employees(props) {
  const { data, role, jobRoles, history, onMenu, column, dataCy } = props
  return (
    <div className="list" data-cy={dataCy}>
      <div className="list-header">
        <div className="d-flex-3 dsl-m12 text-400 " data-cy="employeeName">
          Employee
        </div>
        <div
          data-cy="careerName"
          className={classNames(
            'd-flex-3 ml-0 ml-md-2 dsl-m12 text-400',
            (column == 2 || column == 3) && 'd-none d-lg-block'
          )}
        >
          Career
        </div>
        <div
          data-cy="careerLevel"
          className={classNames(
            'd-flex-2 d-flex-sm-3 ml-0 ml-md-3 dsl-m12 text-400 d-flex-ssm-1',
            (column == 2 || column == 3) && 'd-none d-md-block'
          )}
        >
          Level
        </div>
        <div
          data-cy="careerStarted"
          className={classNames('d-flex-2 dsl-m12 text-right text-400 d-none d-md-block', column == 2 && 'd-block')}
        >
          Started
        </div>
        <div
          data-cy="careerEstCompl"
          className={classNames(
            'd-flex-2 dsl-m12 text-right text-400 d-none d-md-block',
            (column == 2 || column == 3) && 'd-block'
          )}
        >
          Est. Compl.
        </div>
        <div
          data-cy="careerCompleted"
          className={classNames(
            'd-flex-2 mr-2 dsl-m12 text-right text-400 d-none d-lg-block',
            column == 2 ? 'd-none d-md-block' : column == 3 && 'd-block'
          )}
        >
          Completed
        </div>
        <div
          data-cy="threeDotSection"
          className={classNames('d-flex-1 dsl-m12 d-none d-md-block', column == 3 && 'd-block')}
        />
      </div>

      {data.map((item, index) => {
        const { profile, stats } = item
        let currentCareer = stats.open_careers[0]
        if (equals(stats.open, 0) && !equals(stats.completed, 0)) {
          currentCareer = stats.completed_careers[0]
        }
        const title = isNil(currentCareer) ? 'No Program Assigned' : currentCareer.title
        const name = isNil(profile) ? '' : `${profile.first_name} ${profile.last_name}`
        const careerRole = isNil(currentCareer) ? null : find(propEq('id', currentCareer.job_role_id), jobRoles)
        const jobTitle = isNil(careerRole) ? '' : careerRole.name
        const level = isNil(currentCareer)
          ? 'N/A'
          : `(${currentCareer.level}/${
              isNil(currentCareer.data) || isNil(currentCareer.data.levels)
                ? 1
                : length(keys(currentCareer.data.levels))
            })`
        const started = isNil(currentCareer)
          ? 'N/A'
          : moment(currentCareer.started_at || currentCareer.created_at).format('MMM DD, YY')
        const end =
          isNil(currentCareer) || isNil(currentCareer.end_estimate)
            ? 'N/A'
            : moment(item.program.end_estimate).format('MMM DD, YY')
        let completed = 0
        if (!isNil(currentCareer)) {
          const currentStats = currentCareer.stats
          const { courses, quotas } = currentStats
          const totals = (isNil(quotas) ? 0 : quotas.total) + (isNil(courses) ? 0 : courses.total)
          const completes = (isNil(quotas) ? 0 : quotas.complete) + (isNil(courses) ? 0 : courses.complete)
          completed = equals(totals, 0) ? 100 : ((completes * 100) / totals).toFixed(2)
        }
        let editOptions = []
        if (isNil(currentCareer)) {
          editOptions = ManageReportMenu[role].filter(option => option === 'Assign Career')
        } else {
          editOptions = ManageReportMenu[role].filter(option => option !== 'Assign Career')
        }
        return (
          <div className="list-item cursor-pointer" data-cy={`employee-row${index}`} key={`crd${index}`}>
            <div className="d-center d-flex-12" onClick={() => onMenu('view career', currentCareer, item)}>
              <div className="d-flex d-flex-3 dsl-m12 align-items-center custom-right-border-sm">
                <Avatar
                  url={profile.avatar}
                  size="tiny"
                  type="initial"
                  name={name}
                  backgroundColor={avatarBackgroundColor(item.id)}
                  onToggle={() => history.push(`/library/record-employee-info/${item.id}`)}
                />
                <span className="dsl-b14 ml-3 mr-2 text-400">{name}</span>
              </div>
              <div
                className={classNames(
                  'd-flex-3 mr-3 ml-2 ml-lg-3 dsl-m12 custom-br-ssm',
                  (column == 2 || column == 3) && 'd-none d-lg-block'
                )}
              >
                <p className="dsl-b14 text-400 wrap-title">{title}</p>
              </div>
              <div
                className={classNames(
                  'd-flex-2 d-flex-sm-3 dsl-m12 ml-2',
                  (column == 2 || column == 3) && 'd-none d-md-block'
                )}
              >
                <span data-cy="levelData" className="dsl-b14 text-400">{`${jobTitle} ${level}`}</span>
              </div>
              <div
                className={classNames(
                  'd-flex-2 dsl-m12 text-right custom-br-ssm d-none d-md-block',
                  column == 2 && 'd-block'
                )}
              >
                <span className="dsl-b14 text-400">{started}</span>
              </div>
              <div
                className={classNames(
                  'd-flex-2 dsl-m12 text-right d-none d-md-block',
                  (column == 2 || column == 3) && 'd-block',
                  column == 3 && 'custom-br-ssm'
                )}
              >
                <span className="dsl-b14 text-400">{end}</span>
              </div>
              <div
                className={classNames(
                  'd-flex-2 dsl-m12 text-right d-none d-lg-block',
                  column == 2 ? 'd-md-block' : column == 3 && 'd-block custom-br-ssm'
                )}
              >
                <span className="dsl-b14 text-400">{completed}%</span>
              </div>
            </div>
            <div className={classNames('d-flex-1 dsl-m12 text-right d-none d-md-block', column == 3 && 'd-block')}>
              {editOptions.length !== 0 && (
                <EditDropdown
                  options={editOptions}
                  onChange={e => onMenu(e, currentCareer, item)}
                  dataCy={`employeeThreeDot${index}`}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

Employees.propTypes = {
  data: PropTypes.array,
  jobRoles: PropTypes.array,
  onMenu: PropTypes.func,
}

Employees.defaultProps = {
  data: [],
  jobRoles: [],
  onMenu: () => {},
}

export default Employees
