import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as CompanyCard } from '@components'
import './Connections.scss'

const ReceivedRequests = ({ connections }) => {
  return (
    <Row className="connections-received-request mx-1">
      {connections.map(connect => (
        <Col key={connect.id} className="p-2" xs={12} sm={6} md={3}>
          <CompanyCard data={connect} tab="received" type="company" />
        </Col>
      ))}
    </Row>
  )
}

ReceivedRequests.propTypes = {
  connections: PropTypes.array,
}

ReceivedRequests.defaultProps = {
  connections: [],
}

export default ReceivedRequests
