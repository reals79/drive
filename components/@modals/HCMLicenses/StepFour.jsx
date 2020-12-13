import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { find, propEq } from 'ramda'
import { Avatar, Button, Dropdown, EditDropdown, Input } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import { avatarBackgroundColor } from '~/services/util'
import './HCMLicenses.scss'

const StepFour = ({ onNext, onPrevious }) => {
  const _md = useSelector(state => state.app.modalData)
  const _data = _md?.before?.data

  const companies = useSelector(state => state.app.companies)
  const company = find(propEq('id', _data?.hcms?.id), companies)

  const teams = company?.teams || []
  const jobRoles = company?.job_roles || []
  const departments = company?.departments || []
  const users = company?.users || []

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [team, setTeam] = useState('')
  const [jobRole, setJobRole] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(AppActions.postmulticompanydataRequest())
  }, [])

  const handleSave = () => {
    if (!company?.id) return
    const payload = {
      new_user: [
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          department_id: department,
          job_role_id: jobRole.id,
          job_title_id: jobRole.titles[0].id,
          team_id: team,
          app_role_id: 4,
        },
      ],
    }
    dispatch(AppActions.postcompanyusersRequest(payload, company.id))
    setFirstName('')
    setLastName('')
    setEmail('')
    setDepartment('')
    setTeam('')
    setJobRole('')
  }

  const handleNext = () => {
    const _payload = { id: _data?.id }
    dispatch(CompanyActions.getbusinessRequest(_payload))
    onNext()
  }

  return (
    <>
      <p className="dsl-b18 bold mt-5 mb-0">Employees</p>
      <div className="d-flex align-items-center py-2 border-bottom">
        <div className="d-flex-3">
          <span className="dsl-m12">Name</span>
        </div>
        <div className="d-flex-4 mr-4">
          <span className="dsl-m12">Email</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Department</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-m12">Team</span>
        </div>
        <div className="d-flex-1">
          <span className="dsl-m12">Job role</span>
        </div>
        <div className="d-flex-1" />
      </div>
      {users?.map(item => {
        const name = `${item?.profile?.first_name} ${item?.profile?.last_name}`
        const department = find(propEq('id', item?.department_id), departments)
        const team = find(propEq('id', item?.team_id), teams)
        const jobRole = find(propEq('id', item?.job_role_id), jobRoles)

        return (
          <div className="d-flex align-items-center py-3 border-bottom" key={`user${item?.id}`}>
            <div className="d-flex d-flex-3 align-items-center truncate-one">
              <Avatar name={name} backgroundColor={avatarBackgroundColor(item?.id)} />
              <span className="dsl-m12 ml-3 mr-2">{name}</span>
            </div>
            <div className="d-flex-4 truncate-one mr-4">
              <span className="dsl-m12">{item?.email}</span>
            </div>
            <div className="d-flex-2 truncate-one">
              <span className="dsl-m12">{department?.name}</span>
            </div>
            <div className="d-flex-2 truncate-one">
              <span className="dsl-m12">{team?.name}</span>
            </div>
            <div className="d-flex-1 truncate-one">
              <span className="dsl-m12">{jobRole?.name}</span>
            </div>
            <div className="d-flex-1">
              <EditDropdown options={['Edit', 'Delete']} />
            </div>
          </div>
        )
      })}
      <p className="dsl-b18 bold mt-5">Add Employee</p>
      <div className="d-flex align-items-center addrow mb-2">
        <div className="d-flex-3 mr-3">
          <Input
            className="mb-3"
            title="First name"
            placeholder="Type here..."
            value={firstName}
            onChange={e => setFirstName(e)}
          />
        </div>
        <div className="d-flex-3 ml-3">
          <Dropdown
            className="mb-4"
            title="Department"
            placeholder="Select"
            width="fit-content"
            defaultIds={[department]}
            data={departments}
            getValue={e => e.name}
            onChange={e => setDepartment(e[0])}
          />
        </div>
      </div>
      <div className="d-flex align-items-center addrow mb-2">
        <div className="d-flex-3 mr-3">
          <Input
            className="mb-3"
            title="Last name"
            placeholder="Type here..."
            value={lastName}
            onChange={e => setLastName(e)}
          />
        </div>
        <div className="d-flex-3 ml-3">
          <Dropdown
            className="mb-4"
            title="Team"
            placeholder="Select"
            width="fit-content"
            defaultIds={[team]}
            data={teams}
            getValue={e => e.name}
            onChange={e => setTeam(e[0])}
          />
        </div>
      </div>
      <div className="d-flex align-items-center addrow">
        <div className="d-flex-3 mr-3">
          <Input className="mb-3" title="Email" placeholder="Type here..." value={email} onChange={e => setEmail(e)} />
        </div>
        <div className="d-flex-3 ml-3">
          <Dropdown
            className="mb-4"
            title="Job role"
            placeholder="Select"
            width="fit-content"
            returnBy="data"
            defaultIds={[jobRole?.id]}
            data={jobRoles}
            getValue={e => e.name}
            onChange={e => setJobRole(e[0])}
          />
        </div>
      </div>
      <div className="d-h-end pb-3 border-bottom">
        <Button className="ml-3" type="medium" name="SAVE" onClick={handleSave} />
      </div>
      <div className="body-footer mt-4">
        <Button type="medium" name="PREVIOUS" onClick={onPrevious} />
        <Button className="ml-3" name="NEXT" onClick={handleNext} />
      </div>
    </>
  )
}

StepFour.propTypes = {}

StepFour.defaultProps = {}

export default memo(StepFour)
