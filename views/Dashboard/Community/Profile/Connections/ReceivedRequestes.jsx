import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard, Pagination } from '@components'
import CommunityActions from '~/actions/community'
import './Connections.scss'

const ReceivedRequests = ({ user, requests }) => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const total = requests?.length > 0 ? Math.ceil(requests?.length / 20) : 0
  const limit = (page - 1) * 20

  const handleConnect = connection => () => {
    const payload = {
      data: {
        payload: { connection_id: connection.id },
        action: 'active',
      },
      after: { type: 'GETCOMMUNITYCONNECTIONS_REQUEST', payload: { userId: user.id } },
    }
    dispatch(CommunityActions.postconnectionupdateRequest(payload))
  }

  const handleReject = connection => () => {
    const payload = {
      data: {
        payload: { connection_id: connection.id },
        action: 'rejected',
      },
      after: { type: 'GETCOMMUNITYCONNECTIONS_REQUEST', payload: { userId: user.id } },
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
    <>
      <Row className="connections-received-request mx-1">
        {requests.map((connection, index) => {
          if (index > 19 + limit || index < limit) return null
          return (
            <Col key={connection.id} className="p-2" xs={12} sm={6} md={3}>
              <ConnectionCard
                data={{ ...connection.connector?.user, ...connection.connector }}
                tab="received"
                onClick={handleConnect(connection)}
                onReject={handleReject(connection)}
                onOpen={handleOpenDetail(connection)}
              />
            </Col>
          )
        })}
      </Row>
      <Pagination total={total} current={page} pers={[]} onChange={e => setPage(e)} />
    </>
  )
}

ReceivedRequests.propTypes = {
  user: PropTypes.shape({ id: PropTypes.number }),
  requests: PropTypes.array,
}

ReceivedRequests.defaultProps = {
  user: { id: 0 },
  requests: [],
}

export default ReceivedRequests
