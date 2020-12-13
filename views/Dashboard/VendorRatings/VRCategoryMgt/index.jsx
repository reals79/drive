import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { Icon } from '@components'
import All from './All'
import Published from './Published'
import Archieved from './Archieved'
import './VRCategoryMgt.scss'

const VRCategoryMgt = () => {
  const [key, setKey] = useState('all')

  return (
    <>
      <div className="d-flex mb-4">
        <span className="dsl-b14 text-400">Super Admin</span>
        <Icon name="far fa-chevron-right ml-2" size={12} color="#969faa" />
        <span className="dsl-m14 ml-2">Categories</span>
      </div>
      <div className="super-admin-vrcategorymgt card">
        <p className="dsl-b22 bold">Category Management</p>
        <Tabs className="mb-4" defaultActiveKey="all" activeKey={key} onSelect={e => setKey(e)}>
          <Tab eventKey="all" title="All">
            <All />
          </Tab>
          <Tab eventKey="published" title="Published">
            <Published />
          </Tab>
          <Tab eventKey="archieved" title="Archieved">
            <Archieved />
          </Tab>
        </Tabs>
      </div>
    </>
  )
}

export default VRCategoryMgt
