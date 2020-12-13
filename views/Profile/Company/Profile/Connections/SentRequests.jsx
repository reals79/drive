import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as CompanyCard } from '@components'
import './Connections.scss'

const SentRequest = ({ connections }) => {
  return (
    <Row className="connections-received-request mx-1">
      {connections.map(connect => (
        <Col key={connect.id} className="p-2" xs={12} sm={6} md={3}>
          <CompanyCard data={connect} tab="sent" type="company" />
        </Col>
      ))}
    </Row>
  )
}

SentRequest.propTypes = {
  connections: PropTypes.array,
}

SentRequest.defaultProps = {
  connections: [],
}

export default SentRequest
