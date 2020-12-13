import React, { memo } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { Search, Toggle } from '@components'
import './RecordHeader.scss'

function RecordHeader(props) {
  const {
    departments,
    teams,
    roles,
    viewMode,
    supervisors,
    employees,
    onChange,
    onChangeView,
  } = props

  return (
    <div className="record-header">
      <div className="d-flex justify-content-between">
        <p className="dsl-b22 text-500">Employees</p>
        <Search onChange={onChange} />
      </div>
      <div className="record-header__section">
        <div className="status">
          <Toggle
            leftLabel="Usr View"
            rightLabel="Mgr View"
            disabled={false}
            checked={viewMode}
            onChange={onChangeView}
          />
        </div>
        <div className="view">
          <Tabs className="pb-3" defaultActiveKey="active" id="records">
            <Tab eventKey="recruits" title="Recruits" />
            <Tab eventKey="active" title="Active">
              <div className="active-tab">
                <div className="board">
                  <p className="dsl-m12">Employees</p>
                  <p className="dsl-b14 mb-0">{employees}</p>
                </div>
                <div className="board">
                  <p className="dsl-m12">Departments</p>
                  <p className="dsl-b14 mb-0">{departments}</p>
                </div>
                <div className="board">
                  <p className="dsl-m12">Teams</p>
                  <p className="dsl-b14 mb-0">{teams}</p>
                </div>
                <div className="board">
                  <p className="dsl-m12">Roles</p>
                  <p className="dsl-b14 mb-0">{roles}</p>
                </div>
                <div className="board">
                  <p className="dsl-m12">Supervisors</p>
                  <p className="dsl-b14 mb-0">{supervisors}</p>
                </div>
              </div>
            </Tab>
            <Tab eventKey="prior" title="Prior" />
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default memo(RecordHeader)
