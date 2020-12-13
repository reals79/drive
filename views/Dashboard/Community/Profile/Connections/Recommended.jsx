import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as UserCard } from '@components'
import CommunityActions from '~/actions/community'
import './Connections.scss'

const Recommended = ({ user, connections }) => {
  const dispatch = useDispatch()

  const recommendedUsers = connections ? connections.slice(0, 4) : []

  const handleConnect = connectUser => () => {
    const payload = {
      data: { user_id: user.id, connect_user_id: connectUser.id },
      after: { type: 'GETCOMMUNITYCONNECTIONS_REQUEST', payload: { userId: user.id } },
    }
    dispatch(CommunityActions.postcommunityconnectRequest(payload))
  }

  const handleOpenDetail = connectUser => () => {
    const payload = {
      userId: connectUser.id,
      type: 'others',
      route: `/community/profile/about?user_id=${connectUser.id}`,
    }
    dispatch(CommunityActions.getcommunityuserRequest(payload))
  }

  return (
    <Row className="connections-received-request mx-1">
      {recommendedUsers.map(connectUser => (
        <Col key={connectUser.id} className="p-2" xs={12} sm={6} md={3}>
          <UserCard
            data={connectUser}
            tab="recommended"
            onClick={handleConnect(connectUser)}
            onOpen={handleOpenDetail(connectUser)}
          />
        </Col>
      ))}
      {recommendedUsers.length === 0 && <p className="dsl-b16 p-3">No recommended users</p>}
    </Row>
  )
}

Recommended.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  connections: PropTypes.array,
}

Recommended.defaultProps = {
  user: {
    id: 0,
  },
  connections: [],
}

export default Recommended
