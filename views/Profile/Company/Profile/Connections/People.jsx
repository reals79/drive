import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as UserCard } from '@components'
import './Connections.scss'

const People = ({ connections }) => {
  return (
    <Row className="connections-people mx-1">
      {connections.map(user => (
        <Col key={user.id} className="p-2" xs={12} sm={6} md={3}>
          <UserCard data={user} tab="people" />
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
