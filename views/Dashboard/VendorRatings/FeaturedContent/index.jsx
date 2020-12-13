import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { Icon } from '@components'
import All from './All'
import Home from './Home'
import Accounting from './Accounting'
import Finance from './Finance'
import FixedOps from './FixedOps'
import More from './More'
import './FeaturedContent.scss'

const FeaturedContent = () => {
  const [key, setKey] = useState('all')

  return (
    <>
      <div className="d-flex mb-4">
        <span className="dsl-b14 text-400">Super Admin</span>
        <Icon name="far fa-chevron-right ml-2" size={12} color="#969faa" />
        <span className="dsl-m14 ml-2">Featured content</span>
      </div>
      <div className="super-admin-featuredcontent">
        <div className="card-header">
          <p className="dsl-b22 bold mb-0">Featured Content</p>
        </div>
        <Tabs className="card-content" defaultActiveKey="all" activeKey={key} onSelect={e => setKey(e)}>
          <Tab eventKey="all" title="All">
            <All />
          </Tab>
          <Tab eventKey="home" title="Home">
            <Home />
          </Tab>
          <Tab eventKey="accounting" title="Accounting">
            <Accounting />
          </Tab>
          <Tab eventKey="finance" title="Finance">
            <Finance />
          </Tab>
          <Tab eventKey="fixedops" title="Fixed Ops">
            <FixedOps />
          </Tab>
          <Tab eventKey="more" title="More">
            <More />
          </Tab>
        </Tabs>
      </div>
    </>
  )
}

export default FeaturedContent
