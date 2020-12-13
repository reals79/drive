import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { find, propEq } from 'ramda'
import moment from 'moment'
import { Avatar, Button, DatePicker, Dropdown, Filter, Icon, Input } from '@components'
import CompanyActions from '~/actions/company'
import { UserType } from '~/services/config'
import './AddOwner.scss'

const Add = ({ onCancel }) => {
  const USERTYPE = UserType.filter(type => !(type.label === 'Super Admin'))
  const defaultComId = useSelector(state => state.app.company_info.id)
  const defaultCompanies = useSelector(state => state.app.companies)
  const [companyId, setCompanyId] = useState(defaultComId)
  const company = find(propEq('id', companyId), defaultCompanies)
  const DEPARTMENTS = company.departments
  const MANAGERS = company.managers
  const ROLES = company.job_roles
  const [appRole, setAppRole] = useState(UserType[3])
  const [thumbnail, setThumbnail] = useState('/images/default.png')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [cellPhone, setCellPhone] = useState('')
  const [officePhone, setOfficePhone] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [otherEmail, setOtherEmail] = useState('')
  const [hireDate, setHireDate] = useState(moment())
  const [department, setDepartment] = useState(null)
  const [team, setTeam] = useState(null)
  const [supervisor, setSupervisor] = useState(null)
  const [jobRole, setJobRole] = useState(null)
  const [payPlan, setPayPlan] = useState(null)
  const [directReports, setDirectReports] = useState(null)
  const [manager, setManager] = useState(null)
  const dispatch = useDispatch()
  const handleFilter = (type, data) => {
    if (data[0].id < 0) setCompanyId(defaultComId)
    else setCompanyId(data[0].id)
  }
  const handleModal = type => {
    if (type === 'career') {
      dispatch(
        AppActions.modalRequest({
          type: 'Assign Program',
          data: { before: { disabled: ['certifications'] }, after: {} },
          callBack: null,
        })
      )
    } else if (type === 'certifications') {
      dispatch(
        AppActions.modalRequest({
          type: 'Assign Program',
          data: { before: { disabled: ['careers'] }, after: {} },
          callBack: null,
        })
      )
    } else if (type === 'scorecard') {
      dispatch(
        AppActions.modalRequest({
          type: 'Assign ToDo',
          data: { before: { disabled: ['habits', 'habitslist', 'quotas'] }, after: {} },
          callBack: null,
        })
      )
    } else {
      dispatch(
        AppActions.modalRequest({
          type: 'Assign ToDo',
          data: { before: { disabled: ['habits', 'scorecards', 'quotas'] }, after: {} },
          callBack: null,
        })
      )
    }
  }
  const handleSubmit = () => {
    const payload = {
      new_user: [
        {
          first_name: firstName,
          last_name: lastName,
          phone: cellPhone,
          secondary_phone: officePhone,
          email: workEmail,
          email2: otherEmail,
          about_me: '',
          career_goal: '',
          manager_id: manager?.id,
          app_role_id: appRole?.id,
          job_role_id: jobRole?.id,
          job_title_id: jobRole?.titles[0]?.id,
          birthday: null,
          biography: null,
          timezone: null,
          hired_at: hireDate.format('YYYY-MM-DD'),
        },
      ],
    }
    dispatch(CompanyActions.postregisterbusinessuserRequest(companyId, payload))
  }

  return (
    <>
      <div className="modal-header">
        <Icon name="fal fa-info-circle" color="#ffffff" size={14} />
        <span className="dsl-w14 pl-2">Add New Owner</span>
      </div>
      <div className="modal-body">
        <Filter mountEvent filters={['company']} onChange={handleFilter} />
        <div className="card">
          <div className="permission">
            <div className="pb-4 border-bottom-light">
              <p className="dsl-b16 bold">Permissions</p>
              <Dropdown
                title="User Type"
                data={USERTYPE}
                width={250}
                align="right"
                placeholder="User"
                returnBy="data"
                defaultIds={[4]}
                getId={data => data['id']}
                getValue={data => data['label']}
                onChange={e => setAppRole(e[0])}
              />
            </div>
          </div>
          <div className="d-flex">
            <Avatar
              url={thumbnail}
              borderColor="white"
              borderWidth={4}
              upload
              size="extraLarge"
              type="logo"
              onDrop={e => setThumbnail(e)}
            />
            <div className="info">
              <div className="py-4 border-bottom-light">
                <p className="dsl-b16 bold">About</p>
                <Input
                  title="First name"
                  placeholder="Type here..."
                  value={firstName}
                  onChange={e => setFirstName(e)}
                />
                <Input title="Last name" placeholder="Type here..." value={lastName} onChange={e => setLastName(e)} />
                <Input
                  title="Cell phone"
                  placeholder="Type here..."
                  value={cellPhone}
                  onChange={e => setCellPhone(e)}
                />
                <Input
                  title="Office phone"
                  placeholder="Type here..."
                  value={officePhone}
                  onChange={e => setOfficePhone(e)}
                />
                <Input
                  title="Work email"
                  placeholder="Type here..."
                  value={workEmail}
                  onChange={e => setWorkEmail(e)}
                />
                <Input
                  title="Other email"
                  placeholder="Type here..."
                  value={otherEmail}
                  onChange={e => setOtherEmail(e)}
                />
              </div>
              <div className="py-4 border-bottom-light">
                <p className="dsl-b16 bold">Position</p>
                <div className="d-flex">
                  <div className="d-flex-1">
                    <DatePicker
                      title="Hire date"
                      value={hireDate}
                      calendar="day"
                      append="caret"
                      format="MMM D, YY"
                      as="input"
                      onSelect={e => setHireDate(e)}
                    />
                    <Dropdown
                      title="Department"
                      data={DEPARTMENTS}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => setDepartment(e)}
                    />
                    <Dropdown
                      title="Team"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => setTeam(e)}
                    />
                    <Dropdown
                      title="Supervisor"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => setSupervisor(e)}
                    />
                  </div>
                  <div className="d-flex-1">
                    <Dropdown
                      title="Job role"
                      data={ROLES}
                      width={250}
                      align="right"
                      placeholder="Select"
                      returnBy="data"
                      getId={data => data['id']}
                      getValue={data => data['name']}
                      onChange={e => setJobRole(e[0])}
                    />
                    <Dropdown
                      title="Pay plan"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => setPayPlan(e)}
                    />
                    <Dropdown
                      title="Direct reports"
                      data={[]}
                      width={250}
                      align="right"
                      placeholder="Select"
                      getValue={data => data['name']}
                      onChange={e => setDirectReports(e)}
                    />
                    <Dropdown
                      title="Manager"
                      data={MANAGERS}
                      width={250}
                      align="right"
                      placeholder="Select"
                      returnBy="data"
                      getId={data => data['id']}
                      getValue={data => `${data.profile.first_name} ${data.profile.last_name}`}
                      onChange={e => setManager(e[0])}
                    />
                  </div>
                </div>
              </div>
              <div className="py-4">
                <p className="dsl-b16 bold">Assignments</p>
                <div className="d-flex">
                  <div className="d-flex-1">
                    <div className="assign">
                      <span className="dsl-m12">Career program</span>
                      <Button type="low" name="Assign" onClick={() => handleModal('career')} />
                    </div>
                    <div className="assign">
                      <span className="dsl-m12">Certifications</span>
                      <Button type="low" name="Assign" onClick={() => handleModal('certifications')} />
                    </div>
                  </div>
                  <div className="d-flex-1">
                    <div className="assign">
                      <span className="dsl-m12">Scorecards</span>
                      <Button type="low" name="Assign" onClick={() => handleModal('scorecard')} />
                    </div>
                    <div className="assign">
                      <span className="dsl-m12">Habit schedule</span>
                      <Button type="low" name="Assign" onClick={() => handleModal('habitschedule')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Button className="ml-3" type="medium" name="CANCEL" onClick={onCancel} />
          <Button className="ml-3" name="ADD" onClick={handleSubmit} />
        </div>
      </div>
    </>
  )
}

Add.propTypes = {}

Add.defaultProps = {}

export default memo(Add)
