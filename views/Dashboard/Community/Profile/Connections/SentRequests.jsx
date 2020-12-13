import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import CommunityActions from '~/actions/community'
import { ConnectionCard as UserCard } from '@components'
import './Connections.scss'

const SentRequests = ({ user, requests }) => {
  const dispatch = useDispatch()

  const handleDismiss = connection => () => {
    const payload = {
      data: {
        payload: { connection_id: connection.id },
        action: 'delete',
      },
      after: {
        type: 'GETCOMMUNITYCONNECTIONS_REQUEST',
        payload: { userId: user.id },
      },
    }
    dispatch(CommunityActions.postconnectionupdateRequest(payload))
  }

  const handleOpenDetail = connect => () => {
    const { user_id } = connect.connector
    const payload = {
      userId: user_id,
      type: 'others',
      route: `/community/profile/about?user_id=${user_id}`,
    }
    dispatch(CommunityActions.getcommunityuserRequest(payload))
  }

  return (
    <Row className="connections-received-request mx-1">
      {requests.map(connection => (
        <Col key={connection.id} className="p-2" xs={12} sm={6} md={3}>
          <UserCard
            data={{ ...connection.connector?.user, ...connection.connector }}
            tab="sent"
            onClick={handleDismiss(connection)}
            onOpen={handleOpenDetail(connection)}
          />
        </Col>
      ))}
    </Row>
  )
}

SentRequests.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  requests: PropTypes.array,
}

SentRequests.defaultProps = {
  user: {
    id: 0,
  },
  requests: [],
}

export default SentRequests
