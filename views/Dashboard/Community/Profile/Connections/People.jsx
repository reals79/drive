import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as UserCard } from '@components'
import CommunityActions from '~/actions/community'
import './Connections.scss'

const People = ({ connections }) => {
  const dispatch = useDispatch()

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
    <Row className="connections-people mx-1">
      {connections.map(connection => (
        <Col key={connection.id} className="p-2" xs={12} sm={6} md={3}>
          <UserCard
            data={{ ...connection.connector?.user, ...connection.connector }}
            tab="people"
            onOpen={handleOpenDetail(connection)}
          />
        </Col>
      ))}
      {connections.length === 0 && <p className="dsl-b16 p-3">No people</p>}
    </Row>
  )
}

People.propTypes = {
  connections: PropTypes.array,
}

People.defaultProps = {
  connections: [],
}

export default People
