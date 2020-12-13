import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { EditDropdown, Toggle } from '@components'
import CompanyActions from '~/actions/company'
import Status from './Status'
import Employees from './Employees'
import Org from './Org'
import Library from './Library'
import './HumanCapital.scss'

const TABS = [
  { id: 0, label: 'Employees' },
  { id: 1, label: 'Org' },
  { id: 2, label: 'Library' },
]

const HumanCapital = ({ data }) => {
  const [active, setActive] = useState(TABS[0].id)
  const [isUser, setIsUser] = useState(true)
  const [mode, setMode] = useState('detail')
  const emps = useSelector(state => state.company.employees)
  const employees = data ? emps[data.id] : []

  const dispatch = useDispatch()
  useEffect(() => {
    if (data?.id) dispatch(CompanyActions.getcompanyemployeesRequest(data.id))
  }, [])

  const options = active === TABS[0].id ? (mode === 'detail' ? ['Add employee', 'Edit'] : ['Upload CSV']) : ['Edit']

  const handleDiscard = () => {
    setMode('detail')
  }
  const handleEdit = e => {
    setMode(e)
  }

  return (
    <div className="company-profile-humancapital">
      <div className="card">
        <div className="d-flex justify-content-between">
          <span className="dsl-b22 bold">Human Capital</span>
          {active !== TABS[2].id && <EditDropdown options={options} onChange={handleEdit} />}
        </div>
        <div
          className={classNames(
            'd-flex justify-content-between py-2 mt-2',
            active === TABS[0].id && mode === 'detail' && 'border-bottom'
          )}
        >
          <div className="d-flex">
            {TABS.map((item, index) => (
              <div key={`t${index}`}>
                <span
                  className={classNames('dsl-p14 cursor-pointer', active === item.id && 'bold')}
                  onClick={() => setActive(item.id)}
                >
                  {item.label}
                </span>
                {index !== TABS.length - 1 && <span className="dsl-d14 mx-2">|</span>}
              </div>
            ))}
          </div>
          {active === TABS[0].id && mode !== 'edit' && (
            <Toggle checked={isUser} leftLabel="Usr View" rightLabel="Mgr View" onChange={e => setIsUser(e)} />
          )}
        </div>
        {active === TABS[0].id && mode !== 'edit' && <Status data={data} />}
        {active === TABS[1].id && <Org data={data} employees={employees} mode={mode} onDiscard={handleDiscard} />}
        {active === TABS[2].id && <Library data={data} />}
        {active === TABS[0].id && mode === 'edit' && (
          <Employees data={data} employees={employees} isUser={isUser} mode={mode} onDiscard={handleDiscard} />
        )}
      </div>
      {active === TABS[0].id && mode === 'detail' && (
        <Employees data={data} employees={employees} isUser={isUser} mode={mode} />
      )}
    </div>
  )
}

HumanCapital.propTypes = {}

HumanCapital.defaultProps = {}

export default HumanCapital
