import React, { memo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { equals } from 'ramda'
import { Search, LibraryStatus as Status } from '@components'
import './LibraryTodosStatus.scss'

const LibraryTodosStatus = ({ active, totals, onSearch, onTabs }) => (
  <div className="todos-status">
    <Row className="mb-3">
      <Col xs={9} className="dsl-b18 bold text-capitalize">
        To Dos
      </Col>
      <Col xs={3}>
        <Search className="justify-content-center" onChange={e => onSearch(e)} />
      </Col>
    </Row>
    <div className="tab-bar">
      <div
        className={`pr-4 cursor-pointer ${equals(active, 'habits') ? 'active' : ''}`}
        onClick={() => onTabs('habits')}
      >
        <span className="dsl-p12">Habits</span>
      </div>
      <span className="pr-4">|</span>
      <div
        className={`pr-4 cursor-pointer ${equals(active, 'habits-list') ? 'active' : ''}`}
        onClick={() => onTabs('habits-list')}
      >
        <span className="dsl-p12">Habits List</span>
      </div>
      <span className="pr-4">|</span>
      <div
        className={`pr-4 cursor-pointer ${equals(active, 'quotas') ? 'active' : ''}`}
        onClick={() => onTabs('quotas')}
      >
        <span className="dsl-p12">Quotas</span>
      </div>
      <span className="pr-4">|</span>
      <div
        className={`pr-4 cursor-pointer ${equals(active, 'scorecards') ? 'active' : ''}`}
        onClick={() => onTabs('scorecards')}
      >
        <span className="dsl-p12">Scorecards</span>
      </div>
    </div>
    <Status
      className="p-0"
      type={equals(active, 'habits-list') ? 'habit schedules' : active}
      counts={totals}
    />
  </div>
)

export default memo(LibraryTodosStatus)
