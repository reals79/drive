import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { ConnectionCard as CompanyCard } from '@components'
import './Connections.scss'

const companies = [
  {
    id: 1,
    name: ' ',
    job: 'Human Capital Resources',
    online: false,
    followed: 1392,
  },
  {
    id: 2,
    name: 'EchelonFront',
    job: 'Human Capital Resources Team',
    online: false,
    followed: 821,
  },
]

const Companies = ({ connections }) => {
  return (
    <Row className="connections-companies mx-1">
      {connections.map(connect => (
        <Col key={connect.id} className="p-2" xs={12} sm={6} md={3}>
          <CompanyCard data={connect} tab="companies" type="company" />
        </Col>
      ))}
      {connections.length === 0 && <p className="dsl-b16 p-3">No companies</p>}
    </Row>
  )
}

Companies.propTypes = {
  connections: PropTypes.array,
}

Companies.defaultProps = {
  connections: [],
}

export default Companies
