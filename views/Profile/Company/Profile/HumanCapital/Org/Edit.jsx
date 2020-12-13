import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { clone, concat, filter, keys } from 'ramda'
import { Button, Icon, Input, Toggle } from '@components'
import CompanyActions from '~/actions/company'
import '../HumanCapital.scss'

const Edit = ({ data, onDiscard }) => {
  const [departments, setDepartments] = useState(data?.departments)
  const [checked, setChecked] = useState(true)
  const [teams, setTeams] = useState({})
  const [roles, setRoles] = useState({})

  useEffect(() => {
    const tempT = {}
    const tempR = {}
    departments.forEach(dep => {
      const _teams = filter(e => e.department_id === dep.id, data.teams)
      tempT[dep.id] = _teams
      const _roles = filter(e => e.department_id === dep.id, data.job_roles)
      tempR[dep.id] = _roles
    })
    setTeams(tempT)
    setRoles(tempR)
  }, [])

  const handleAddDepartment = () => {
    const temp = clone(departments)
    temp.push({ name: '', company_id: data.id, data: { exit_id: 0, placement_id: 0, satisfaction_id: 0 } })
    setDepartments(temp)
  }
  const handleDepartment = (e, index) => {
    const temp = clone(departments)
    temp[index].name = e
    setDepartments(temp)
  }

  const handleAddTeam = id => {
    const temp = clone(teams)
    if (temp[id]) temp[id].push({ company_id: data.id, department_id: id, name: '', data: { users: [], managers: [] } })
    else temp[id] = [{ company_id: data.id, department_id: id, name: '', data: { users: [], managers: [] } }]
    setTeams(temp)
  }
  const handleTeam = (id, index, e) => {
    const temp = clone(teams)
    temp[id][index].name = e
    setTeams(temp)
  }

  const handleAddRole = id => {
    const temp = clone(roles)
    if (temp[id]) temp[id].push({ name: '', department_id: id, titles: [], data: {} })
    else temp[id] = [{ name: '', department_id: id, titles: [], data: {} }]
    setRoles(temp)
  }
  const handleRole = (id, index, e) => {
    const temp = clone(roles)
    temp[id][index].name = e
    setRoles(temp)
  }

  const dispatch = useDispatch()
  const handleSave = () => {
    const payloadD = { departments }
    const callback = { id: data.business_id }
    dispatch(CompanyActions.postaddeditdepartmentsRequest(data.id, payloadD, callback))

    let job_roles = []
    keys(roles).forEach(key => {
      job_roles = concat(job_roles, roles[key])
    })
    const payloadJ = { job_roles }
    dispatch(CompanyActions.postsavejobrolesRequest(data.id, payloadJ))

    let temp = []
    keys(teams).forEach(key => {
      temp = concat(temp, teams[key])
    })
    const payloadT = { teams: temp }
    dispatch(CompanyActions.postaddeditteamsRequest(data.id, payloadT))
    onDiscard()
  }

  return (
    <div className="human-capital">
      <div className="d-flex align-items-center mt-4 mb-4">
        <span className="dsl-b17 text-400">Departments</span>
        <Icon name="fa fa-plus-circle cursor-pointer ml-3" color="#969faa" size={16} onClick={handleAddDepartment} />
      </div>
      {departments.map((item, index) => (
        <Input
          className="edit-row mb-3 mr-5"
          key={`c${index}`}
          title={`Department ${index + 1}`}
          placeholder="Type here..."
          value={departments[index]?.name || ''}
          onChange={e => handleDepartment(e, index)}
        />
      ))}
      <p className="dsl-b20 bold mt-5 mb-5">Teams</p>
      <span className="dsl-b12 mb20">Team within departments?</span>
      <Toggle checked={checked} leftLabel="Yes" rightLabel="No" onChange={e => setChecked(e)} />
      {departments.map((dep, id) => (
        <div key={`dt${id}`}>
          <div className="d-flex align-items-center mt-5 mb-4">
            <span className="dsl-b17 text-400">{dep.name}</span>
            <Icon
              name="fa fa-plus-circle cursor-pointer ml-3"
              color="#969faa"
              size={16}
              onClick={() => handleAddTeam(dep.id)}
            />
          </div>
          {teams[dep.id]?.map((item, index) => (
            <Input
              className="edit-row mb-3 mr-5 pl-3"
              key={`t${id}${index}`}
              title={`Team ${index + 1}`}
              placeholder="Type here..."
              value={item.name}
              onChange={e => handleTeam(dep.id, index, e)}
            />
          ))}
        </div>
      ))}
      <p className="dsl-b20 bold">Roles in Departments</p>
      {departments.map((dep, id) => (
        <div key={`dr${id}`}>
          <div className="d-flex align-items-center mt-5 mb-4">
            <span className="dsl-b17 text-400">{dep.name}</span>
            <Icon
              name="fa fa-plus-circle cursor-pointer ml-3"
              color="#969faa"
              size={16}
              onClick={() => handleAddRole(dep.id)}
            />
          </div>
          {roles[dep.id]?.map((item, index) => (
            <Input
              className="edit-row mb-3 mr-5 pl-3"
              key={`r${id}${index}`}
              title={`Role ${index + 1}`}
              placeholder="Type here..."
              value={item.name}
              onChange={e => handleRole(dep.id, index, e)}
            />
          ))}
        </div>
      ))}
      <div className="d-flex justify-content-end pr-3">
        <Button className="mr-3" name="DISCARD" type="medium" onClick={() => onDiscard()} />
        <Button className="pl-3 pr-3" name="SAVE" onClick={handleSave} />
      </div>
    </div>
  )
}

Edit.propTypes = {
  data: PropTypes.array,
  checked: PropTypes.bool,
}

Edit.defaultProps = {
  data: [{ name: 'BDC' }, { name: 'Finance' }],
  checked: true,
}

export default Edit
