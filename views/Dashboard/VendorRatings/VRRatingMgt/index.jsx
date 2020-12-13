import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { Button, EditDropdown, Icon } from '@components'
import Unmoderated from './Unmoderated'
import Approved from './Approved'
import Blocked from './Blocked'
import All from './All'
import './VRRatingMgt.scss'

const VRRatingMgt = () => {
  const [key, setKey] = useState('unmoderated')

  return (
    <>
      <div className="d-flex mb-2">
        <span className="dsl-b14 text-400">Super Admin</span>
        <Icon name="far fa-chevron-right ml-2" size={12} color="#969faa" />
        <span className="dsl-m14 ml-2">VR rating Mgt</span>
        <Button className="ml-auto" type="link" name="+Add Rating" onClick={() => {}} />
      </div>
      <div className="super-admin-vrratingmgt">
        <div className="d-flex justify-content-between card-header">
          <p className="dsl-b22 mb-0 bold">Content Moderation</p>
          <EditDropdown options={['Add Content']} onChange={() => {}} />
        </div>
        <Tabs className="card-content" defaultActiveKey="unmoderated" activeKey={key} onSelect={e => setKey(e)}>
          <Tab eventKey="unmoderated" title="Unmoderated">
            <Unmoderated />
          </Tab>
          <Tab eventKey="approved" title="Approved">
            <Approved />
          </Tab>
          <Tab eventKey="blocked" title="Blocked">
            <Blocked />
          </Tab>
          <Tab eventKey="all" title="All">
            <All />
          </Tab>
        </Tabs>
      </div>
    </>
  )
}

export default VRRatingMgt
