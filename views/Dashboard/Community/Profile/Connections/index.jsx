import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { findIndex } from 'ramda'
import { Button, EditDropdown } from '@components'
import CommunityActions from '~/actions/community'
import Recommended from './Recommended'
import People from './People'
import Companies from './Companies'
import ReceivedRequestes from './ReceivedRequestes'
import SentRequests from './SentRequests'
import './Connections.scss'

const Connections = ({ user, connections, authenticated, onLogin }) => {
  const dispatch = useDispatch()
  const [active, setActive] = useState('people')

  const loginUser = useSelector(state => state.app.user?.community_user)
  const activeConnections = loginUser?.connections?.active_user_connections || []
  const connected =
    findIndex(x => x.connector?.user_id === user?.id, activeConnections) > -1 || loginUser?.id === user?.id

  const handleDropdown = e => {}

  useEffect(() => {
    handleGetConnections()
  }, [])

  const handleGetConnections = () => {
    if (authenticated) {
      const payload = { userId: user.id }
      dispatch(CommunityActions.getcommunityconnectionsRequest(payload))
    }
  }

  const handleTab = e => {
    setActive(e)
  }

  return (
    <div className="individual-profile-connections">
      <div className="connections-wrapper mb-3">
        {authenticated ? (
          <>
            {connected ? (
              <>
                <div className="connections-header pb-2">
                  <p className="dsl-b22 bold my-2">Recommended Connections</p>
                </div>
                <Recommended user={user} connections={connections?.recommended} />
              </>
            ) : (
              <>
                <div className="connections-header pb-2">
                  <p className="dsl-b22 bold my-2">Mutual Connections</p>
                </div>
                <People connections={connections?.active_user_connections} />
              </>
            )}
          </>
        ) : (
          <div className="d-flex login-content text-center">
            <p className="dsl-b14 mb-0">
              {`Please, Login to see ${user?.first_name}'s connections and gain the ability to connect and get in touch with them.`}
            </p>
            <Button name="Login" className="mt-2" type="medium" onClick={() => onLogin()} />
          </div>
        )}
      </div>

      {authenticated && connected && (
        <div className="connections-wrapper">
          <div className="connections-header pb-2">
            <p className="dsl-b22 bold my-2">My Connections</p>
            <EditDropdown options={['Edit']} onChange={handleDropdown} />
          </div>
          <Tabs className="connections-content" defaultActiveKey="people" activeKey={active} onSelect={handleTab}>
            <Tab eventKey="people" title="People">
              <People connections={connections?.active_user_connections} />
            </Tab>
            <Tab eventKey="companies" title="Companies">
              <Companies companies={connections?.active_company_connections} user={user} />
            </Tab>
            <Tab eventKey="received" title="Received Requests">
              <ReceivedRequestes user={user} requests={connections?.pending_connections_received} />
            </Tab>
            <Tab eventKey="sent" title="Sent Requests">
              <SentRequests user={user} requests={connections?.pending_connections_sent} />
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  )
}

Connections.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  connections: PropTypes.shape({
    active_connections: PropTypes.array,
    followers: PropTypes.array,
    following_companies: PropTypes.array,
    following_users: PropTypes.array,
    pending_connections: PropTypes.array,
  }),
}

Connections.defaultProps = {
  user: {
    id: 0,
    name: '',
  },
  connections: {
    active_connections: [],
    followers: [],
    following_companies: [],
    following_users: [],
    pending_connections: [],
  },
}

export default Connections
