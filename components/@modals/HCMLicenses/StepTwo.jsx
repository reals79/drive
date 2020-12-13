import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { clone, concat, filter, find, keys, propEq } from 'ramda'
import { Button, Icon, Input, Toggle } from '@components'
import CompanyActions from '~/actions/company'
import './HCMLicenses.scss'

const DEPARTMENTS = [
  { id: 0, name: 'Accounting / Administration' },
  { id: 1, name: 'BDC' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'Parts' },
  { id: 4, name: 'Sales Department' },
  { id: 5, name: 'Service' },
]

const StepTwo = ({ onNext, onPrevious }) => {
  const md = useSelector(state => state.app.modalData)
  const businesies = useSelector(state => state.company.business)
  const data = md?.before?.data
  const business = find(propEq('id', data.id), businesies)
  const hcms = business?.hcms || {}
  const initialTeams = {}
  const initialRoles = {}

  hcms.departments.forEach(item => {
    initialTeams[item.id] = filter(e => e.department_id === item.id, hcms.teams)
    initialRoles[item.id] = filter(e => e.department_id === item.id, hcms.job_roles)
  })

  const [step, setStep] = useState(1)
  const [departments, setDepartments] = useState(hcms.departments)
  const [teams, setTeams] = useState(initialTeams)
  const [roles, setRoles] = useState(initialRoles)
  const [creatable, setCreatable] = useState(true)

  useEffect(() => {
    setDepartments(hcms.departments)
    hcms.departments.forEach(item => {
      initialTeams[item.id] = filter(e => e.department_id === item.id, hcms.teams)
      initialRoles[item.id] = filter(e => e.department_id === item.id, hcms.job_roles)
    })
    setTeams(initialTeams)
    setRoles(initialRoles)
  }, [hcms])

  const handleAddDepartment = () => {
    const temp = clone(departments)
    temp.push({ company_id: hcms.id, name: '', data: { exit_id: 0, placement_id: 0, satisfaction_id: 0 } })
    setDepartments(temp)
  }
  const handleDepartments = (e, idx) => {
    const temp = clone(departments)
    temp[idx].name = e
    setDepartments(temp)
  }
  const handleAddTeam = id => {
    const temp = clone(teams)
    temp[id].push({ company_id: hcms.id, department_id: id, name: '', data: { users: [], managers: [] } })
    setTeams(temp)
  }
  const handleTeams = (e, id, idx) => {
    const temp = clone(teams)
    temp[id][idx].name = e
    setTeams(temp)
  }
  const handleAddRole = id => {
    const temp = clone(roles)
    temp[id].push({ department_id: id, titles: {}, data: {}, name: '' })
    setRoles(temp)
  }
  const handleRoles = (e, id, idx) => {
    const temp = clone(roles)
    temp[id][idx].name = e
    setRoles(temp)
  }

  const dispatch = useDispatch()
  const handleSave = () => {
    if (step === 1) {
      const payload = { departments }
      dispatch(CompanyActions.postaddeditdepartmentsRequest(hcms.id, payload))
      const _payload = { id: data?.id }
      dispatch(CompanyActions.getbusinessRequest(_payload))
    } else if (step === 2) {
      let _teams = []
      keys(teams).forEach(key => {
        _teams = concat(teams[key], _teams)
      })
      const payload = { teams: _teams }
      dispatch(CompanyActions.postaddeditteamsRequest(hcms.id, payload))
      const _payload = { id: data?.id }
      dispatch(CompanyActions.getbusinessRequest(_payload))
    } else if (step === 3) {
    }
    setStep(step + 1)
  }

  const handleNext = () => {
    let _roles = []
    keys(roles).forEach(key => {
      _roles = concat(roles[key], _roles)
    })
    const payload = { job_roles: _roles }
    dispatch(CompanyActions.postsavejobrolesRequest(hcms.id, payload))
    onNext()
  }

  return (
    <>
      <p className="dsl-b18 bold mt-5">1. Define Departments</p>
      <p className="dsl-d12 border-bottom py-3">
        List all the departments within your company. This can be changed later.
      </p>
      <div className="d-flex align-items-center mt-5 mb-3">
        <span className="dsl-b18 text-400">Departments</span>
        <Icon name="fa fa-plus-circle cursor-pointer ml-3" color="#969faa" size={16} onClick={handleAddDepartment} />
      </div>
      {departments.map((item, index) => (
        <Input
          className="department mb-3"
          key={`de${index}`}
          title={`Departments ${index + 1}`}
          placeholder=""
          value={item.name}
          onChange={e => handleDepartments(e, index)}
        />
      ))}
      {step > 1 && (
        <>
          <p className="dsl-b18 bold mt-5">2. Create Teams</p>
          <p className="dsl-d12 border-bottom py-3">
            Are your departments organized into smaller teams? For example: some Sales, Departments have Team A reports
            to Sales Manager A.
          </p>
          <Toggle
            className="border-bottom pb-4"
            checked={creatable}
            title="Team with departments?"
            leftLabel="Yes"
            rightLabel="No"
            onChange={e => setCreatable(e)}
          />
          {departments.map((dep, id) => (
            <div key={`team${id}`}>
              <div className="d-flex align-items-center mt-5 mb-3">
                <span className="dsl-b18 text-400">{dep.name}</span>
                <Icon
                  name="fa fa-plus-circle cursor-pointer ml-3"
                  color="#969faa"
                  size={16}
                  onClick={() => handleAddTeam(dep.id)}
                />
              </div>
              {teams[dep.id]?.map((item, index) => (
                <Input
                  className="mb-3 ml-4"
                  key={`team${id}-${index}`}
                  title={`Team ${index + 1}`}
                  value={item.name}
                  onChange={e => handleTeams(e, dep.id, index)}
                />
              ))}
            </div>
          ))}
        </>
      )}
      {step > 2 && (
        <>
          <p className="dsl-b18 bold mt-5">3. Add Roles to Departments</p>
          <p className="dsl-d12 border-bottom py-3">
            Please tell us what Job Roles exit in each department, we're provided some suggestions below. Add as many as
            you can now. You can always.
          </p>
          {departments.map((dep, id) => (
            <div key={`role${id}`}>
              <div className="d-flex align-items-center mt-5 mb-3">
                <span className="dsl-b18 text-400">{dep.name}</span>
                <Icon
                  name="fa fa-plus-circle cursor-pointer ml-3"
                  color="#969faa"
                  size={16}
                  onClick={() => handleAddRole(dep.id)}
                />
              </div>
              {roles[dep.id].map((item, index) => (
                <Input
                  className="mb-3 ml-4"
                  key={`role${id}-${index}`}
                  title={`Role ${index + 1}`}
                  value={item.name}
                  onChange={e => handleRoles(e, dep.id, index)}
                />
              ))}
            </div>
          ))}
        </>
      )}
      {step < 3 && (
        <div className="d-h-end">
          <Button className="ml-3" name="SAVE" onClick={handleSave} />
        </div>
      )}
      {step === 3 && (
        <div className="body-footer">
          <Button type="medium" name="PREVIOUS" onClick={onPrevious} />
          <Button className="ml-3" name="NEXT" onClick={handleNext} />
        </div>
      )}
    </>
  )
}

StepTwo.propTypes = {}

StepTwo.defaultProps = {}

export default memo(StepTwo)
