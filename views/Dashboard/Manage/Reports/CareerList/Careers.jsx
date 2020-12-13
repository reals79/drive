import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import classNames from 'classnames'
import { EditDropdown, Icon, HoverDropdown as HDropdown } from '@components'
import { ManageReportMenu } from '~/services/config'
import './CareerList.scss'

function Careers(props) {
  const { data, role, onMenu, column } = props
  return (
    <div className="careers-report-list">
      <div className="d-flex border-bottom py-3" data-cy="careersHeading">
        <div className="d-flex-7 dsl-m12 text-400" data-cy="careers">
          Careers
        </div>
        <div
          data-cy="open"
          className={classNames('d-flex-1 text-sm-right dsl-m12 text-400', column == 2 && 'd-none d-md-block')}
        >
          Open
        </div>
        <div
          data-cy="openEmployee"
          className={classNames(
            'd-flex-8 d-flex-ssm-3 dsl-m12 ml-sm-3 px-3 text-400',
            column == 2 && 'd-none d-md-block'
          )}
        >
          Employees
        </div>
        <div
          data-cy="completed"
          className={classNames('d-flex-2 text-sm-right dsl-m12 text-400 d-none d-md-block', column == 2 && 'd-block')}
        >
          Completed
        </div>
        <div
          data-cy="completedEmployees"
          className={classNames(
            'd-flex-8 d-flex-sm-3 dsl-m12 px-3 text-400 d-none d-md-block',
            column == 2 && 'd-block'
          )}
        >
          Employees
        </div>
        <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block')} />
      </div>
      {isEmpty(data) ? (
        <div className="d-center pt-4">
          <span className="dsl-m16">No Careers Assigned</span>
        </div>
      ) : (
        data.map((program, index) => {
          const openEmployees = program.stats.open_employees
            ? program.stats.open_employees.map(e => {
                const { id, profile, program } = e
                return {
                  id,
                  program,
                  value: `${profile.first_name} ${profile.last_name}`,
                }
              })
            : []
          const completedEmployees = program.stats.completed_employees
            ? program.stats.completed_employees.map(e => {
                const { id, profile } = e
                return {
                  id,
                  program,
                  value: `${profile.first_name} ${profile.last_name}`,
                }
              })
            : []
          return (
            <div
              className="d-flex align-items-center border-bottom py-0 py-md-4"
              key={`pr${index}`}
              data-cy="careerRows"
            >
              <div className="d-flex align-items-center d-flex-7 cursor-pointer border-right-sm">
                <Icon name="fal fa-file-certificate" size={22} />
                <span className="dsl-b14 ml-3 text-400" data-cy="careersTitle">
                  {program.title}
                </span>
              </div>
              <div
                data-cy="careerOpen"
                className={classNames(
                  'd-flex-1 dsl-b14 text-right text-400 custom-br-ssm',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                {program.stats.open}
              </div>
              <div
                data-cy="assignEmployee"
                className={classNames(
                  'd-flex-8 d-flex-ssm-3 dsl-b14 px-3 text-400',
                  column == 2 && 'd-none d-md-block'
                )}
              >
                <HDropdown
                  placeholder="No employee"
                  data={openEmployees}
                  width="100%"
                  onClick={e => onMenu('view', e)}
                />
              </div>
              <div
                data-cy="completed"
                className={classNames(
                  'd-flex-2 d-flex-sm-1 dsl-b14 text-right text-400 d-none d-md-block custom-br-ssm',
                  column == 2 && 'd-block'
                )}
              >
                {program.stats.completed}
              </div>
              <div
                data-cy="completedEmployee"
                className={classNames(
                  'd-flex-8 d-flex-sm-3 dsl-b14 px-3 text-400 d-none d-md-block',
                  column == 2 && 'd-block'
                )}
              >
                <HDropdown
                  placeholder="No employee"
                  data={completedEmployees}
                  width="100%"
                  onClick={e => onMenu('view', e)}
                />
              </div>
              <div className={classNames('d-flex-1 d-none d-md-block', column == 2 && 'd-block')}>
                {/* disable it for now
                <EditDropdown options={ManageReportMenu[role]} onChange={e => onMenu(e, program)} /> */}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

Careers.propTypes = {
  data: PropTypes.array,
  onMenu: PropTypes.func,
}

Careers.defaultProps = {
  data: [],
  onMenu: () => {},
}

export default Careers
