import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { find, join, propEq } from 'ramda'
import classNames from 'classnames'
import { Avatar, Button, Dropdown, EditDropdown, Pagination, Input } from '@components'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'
import { inPage } from '~/services/util'
import '../HumanCapital.scss'

const Edit = ({ data, employees, onDiscard }) => {
  const dispatch = useDispatch()
  const [current, setCurrent] = useState(1)
  const [per, setPer] = useState(10)
  const [fname, setFname] = useState([''])
  const [lname, setLname] = useState([''])
  const [email, setEmail] = useState([''])
  const [department, setDepartment] = useState({})
  const [team, setTeam] = useState({})
  const [role, setRole] = useState({})
  const options = ['Edit', 'Delete']

  const handlePage = e => {
    setCurrent(e)
  }

  const handlePer = e => {
    if (e > 50) setCurrent(1)
    setPer(e)
  }

  const handleDropdown = e => {}

  const handleUpload = () => {}

  const handleSubmit = () => {
    const payload = {
      new_user: [
        {
          first_name: fname,
          last_name: lname,
          email: email,
          department_id: department?.id,
          job_role_id: role?.id,
          team_id: team?.id,
          job_title_id: role?.titles[0]?.id,
          app_role_id: 4,
        },
      ],
    }
    dispatch(AppActions.postcompanyusersRequest(payload, data.id))
    setFname('')
    setLname('')
    setEmail('')
    setRole({})
    setDepartment({})
    setTeam({})
  }

  return (
    <div className="human-capital">
      <div className="d-flex mt-4 pb-2 border-bottom">
        <div className="d-flex-4">
          <span className="dsl-b12">Name</span>
        </div>
        <div className="d-flex-4">
          <span className="dsl-b12">Email</span>
        </div>
        <div className="d-flex-2">
          <span className="dsl-b12">Departmemt</span>
        </div>
        <div className="d-flex-3">
          <span className="dsl-b12">Team</span>
        </div>
        <div className="d-flex-3">
          <span className="dsl-b12">Job role</span>
        </div>
        <div className="w30" />
      </div>
      {employees?.map((item, index) => {
        const department = find(propEq('id', item.department_id), data.departments)
        const role = find(propEq('id', item.job_role_id), data.job_roles)
        const teams = item?.extra?.user_teams?.map(item => item.name)
        if (inPage(index, current, per)) {
          return (
            <div
              className={classNames('pt-4 pb-4 border-bottom', data.length === index + 1 && 'mb-0')}
              key={`e${index}`}
            >
              <div className="d-flex align-items-center font-weight-normal">
                <div className="d-flex d-flex-4 align-items-center pr-1 truncate-one">
                  <Avatar size="tiny" name={item.name} />
                  <span className="dsl-b14 text-400 ml-3">{`${item.profile.first_name} ${item.profile.last_name}`}</span>
                </div>
                <div className="d-flex-4 pr-1 truncate-one">
                  <span className="dsl-b14 text-400">{item.email}</span>
                </div>
                <div className="d-flex-2 pr-1 truncate-one">
                  <span className="dsl-b14 text-400">{department?.name}</span>
                </div>
                <div className="d-flex-3 pr-1 truncate-one">
                  <span className="dsl-b14 text-400">{join(', ', teams)}</span>
                </div>
                <div className="d-flex-3 pr-1 truncate-one">
                  <span className="dsl-b14 text-400">{role?.name}</span>
                </div>
                <div className="w30">
                  <EditDropdown options={options} onChange={handleDropdown} />
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
      <p className="dsl-b20 bold mt-5 mb-3">Add Employee</p>
      <div className="add-row d-flex mb-3 align-items-center">
        <div className="d-flex-1 mr-2">
          <Input title="First name" placeholder="Type here..." value={fname} onChange={e => setFname(e)} />
        </div>
        <div className="d-flex-1 ml-5">
          <Dropdown
            title="Department"
            data={data.departments}
            align="right"
            placeholder="Select"
            returnBy="data"
            getId={data => data['id']}
            getValue={data => data['name']}
            onChange={e => setDepartment(e[0])}
          />
        </div>
      </div>
      <div className="add-row d-flex mb-3 align-items-center">
        <div className="d-flex-1 mr-2">
          <Input title="Last name" placeholder="Type here..." value={lname} onChange={e => setLname(e)} />
        </div>
        <div className="d-flex-1 ml-5">
          <Dropdown
            title="Team"
            data={data.teams}
            align="right"
            placeholder="Select"
            returnBy="data"
            getId={data => data['id']}
            getValue={data => data['name']}
            onChange={e => setTeam(e[0])}
          />
        </div>
      </div>
      <div className="add-row d-flex mb-3 align-items-center">
        <div className="d-flex-1 mr-2">
          <Input title="Email" placeholder="Type here..." value={email} onChange={e => setEmail(e)} />
        </div>
        <div className="d-flex-1 ml-5">
          <Dropdown
            title="Job role"
            data={data.job_roles}
            align="right"
            placeholder="Select"
            returnBy="data"
            getId={data => data['id']}
            getValue={data => data['name']}
            onChange={e => setRole(e[0])}
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-2">
        <Button className="mr-3" name="+ UPLOAD CSV" type="link" onClick={handleUpload} />
        <Button className="mr-3" name="DISCARD" type="medium" onClick={() => onDiscard()} />
        <Button name="SUBMIT" type="medium" onClick={handleSubmit} />
      </div>
    </div>
  )
}

Edit.propTypes = {
  data: PropTypes.any,
}

Edit.defaultProps = {
  data: [],
}

export default Edit
