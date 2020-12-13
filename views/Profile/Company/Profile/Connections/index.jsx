import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import { EditDropdown } from '@components'
import People from './People'
import Companies from './Companies'
import ReceivedRequests from './ReceivedRequests'
import SentRequests from './SentRequests'
import './Connections.scss'

const Connections = ({ business }) => {
  const company = business.vrs
  const connections = business.vrs?.connections
  if (!connections) return null

  const dispatch = useDispatch()

  const [active, setActive] = useState('people')

  const handleDropdown = e => {}

  const handleTab = e => {
    setActive(e)
  }

  return (
    <div className="company-profile-connections">
      <div className="connections-header pb-2">
        <p className="dsl-b22 bold my-2">{`${company.name} Connections`}</p>
        <EditDropdown options={['Edit']} onChange={handleDropdown} />
      </div>
      <Tabs className="connections-content" defaultActiveKey="people" activeKey={active} onSelect={handleTab}>
        <Tab eventKey="people" title="People">
          <People connections={connections.active_user_connections} />
        </Tab>
        <Tab eventKey="companies" title="Companies">
          <Companies connections={connections.active_company_connections} />
        </Tab>
        <Tab eventKey="received" title="Received Requests">
          <ReceivedRequests connections={connections.pending_connections_received} />
        </Tab>
        <Tab eventKey="sent" title="Sent Requests">
          <SentRequests connections={connections.pending_connections_sent} />
        </Tab>
      </Tabs>
    </div>
  )
}

Connections.propTypes = {
  business: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    vrs: PropTypes.shape({
      id: PropTypes.number,
      connections: PropTypes.shape({
        active_company_connections: PropTypes.array,
        active_user_connections: PropTypes.array,
        follower_companies: PropTypes.array,
        follower_users: PropTypes.array,
        following_companies: PropTypes.array,
        following_users: PropTypes.array,
        pending_connections_received: PropTypes.array,
        pending_connections_sent: PropTypes.array,
      }),
    }),
  }),
}

Connections.defaultProps = {
  business: {
    id: 0,
    name: '',
    vrs: {
      id: 0,
      connections: {
        active_company_connections: [],
        active_user_connections: [],
        follower_companies: [],
        follower_users: [],
        following_companies: [],
        following_users: [],
        pending_connections_received: [],
        pending_connections_sent: [],
      },
    },
  },
}

export default Connections
