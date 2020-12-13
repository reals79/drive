import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { find, propEq } from 'ramda'
import classNames from 'classnames'
import moment from 'moment'
import { Avatar, EditDropdown, Icon, Pagination } from '@components'
import { inPage } from '~/services/util'
import '../HumanCapital.scss'

const Detail = ({ data, employees, isUser }) => {
  const [current, setCurrent] = useState(1)
  const [per, setPer] = useState(10)

  const handlePage = e => {
    setCurrent(e)
  }

  const handlePer = e => {
    if (e > 50) setCurrent(1)
    setPer(e)
  }

  return (
    <div className="human-capital">
      {employees?.map((item, index) => {
        const department = find(propEq('id', item.department_id), data.departments)
        const role = find(propEq('id', item.job_role_id), data.job_roles)
        if (inPage(index, current, per)) {
          return (
            <div className={classNames('card mt-3', data.length === index + 1 && 'mb-0')} key={`e${index}`}>
              {index === 0 && (
                <div className="d-flex align-items-center">
                  <span className="dsl-b14 text-400 ml-auto">Showing</span>
                  <EditDropdown
                    className="showing"
                    caret="down"
                    defaultIndexes={[1]}
                    options={['All', 'Active', 'Recruits']}
                  />
                </div>
              )}
              <div className="d-flex">
                <div className="mr-5">
                  <Avatar size="regular" name={item.name} />
                  <p className="dsl-m11 text-center my-2">Since</p>
                  <p className="dsl-b14 text-center mb-0">{moment(item.created_at).format('MMM DD, YY')}</p>
                </div>
                <div className="d-flex-1">
                  <div className="d-flex justify-content-between">
                    <span className="dsl-b16 bold">{`${item.profile.first_name} ${item.profile.last_name}`}</span>
                    <EditDropdown options={['Edit', 'View Profile']} />
                  </div>
                  <div className="d-flex">
                    <div className="d-flex-1">
                      <div className="d-flex align-items-center mt-3">
                        <span className="dsl-m12 width-100">Company</span>
                        <span className="dsl-b16">{data.name}</span>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <span className="dsl-m12 width-100">Job role</span>
                        <span className="dsl-b16">{role?.name}</span>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <span className="dsl-m12 width-100">Department</span>
                        <span className="dsl-b16">{department?.name}</span>
                      </div>
                    </div>
                    <div className="d-flex-1 ml-3">
                      <div className="d-flex align-items-center mt-3">
                        <span className="dsl-m12 width-100">Phone</span>
                        <span className="dsl-b16">{item.profile.phone}</span>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <span className="dsl-m12 width-100">Cell</span>
                        <span className="dsl-b16">{item.profile.phone}</span>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <span className="dsl-m12 width-100">Email</span>
                        <span className="dsl-b16">{item.email}</span>
                      </div>
                    </div>
                    {isUser && (
                      <div className="d-flex-1 ml-3">
                        <div className="d-flex align-items-center">
                          <Icon name="fal fa-check-circle" color="green" size={16} />
                          <span className="dsl-b16 ml-2">Training</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <Icon name="fal fa-exclamation-circle" color="red" size={16} />
                          <span className="dsl-b16 ml-2">Scorecard</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <Icon name="fal fa-exclamation-circle" color="green" size={16} />
                          <span className="dsl-b16 ml-2">Career</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <Icon name="fal fa-exclamation-circle" color="green" size={16} />
                          <span className="dsl-b16 ml-2">Habits</span>
                        </div>
                        <div className="d-flex align-items-center mt-2">
                          <Icon name="fal fa-exclamation-circle" color="green" size={16} />
                          <span className="dsl-b16 ml-2">Certifications</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })}
      <Pagination
        current={current}
        total={Math.ceil(employees?.length / per)}
        per={per}
        pers={[10, 25, 50, 'all']}
        onChange={handlePage}
        onPer={handlePer}
      />
    </div>
  )
}

Detail.propTypes = {
  data: PropTypes.any,
}

Detail.defaultProps = {
  data: [{ name: 'Bart Wilson' }, { name: 'Brandon Groff' }],
}

export default Detail
