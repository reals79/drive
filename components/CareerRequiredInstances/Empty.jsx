import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Icon } from '@components'
import './CareerRequiredInstances.scss'

const EmptyList = () => (
  <div className="career-required-instances">
    <div className="placeholder">
      <Row className="mx-0">
        <Col xs={10} className="d-flex align-items-center justify-content-between px-0">
          <div className="d-flex align-items-center w-100">
            <Icon name="fal fa-circle mr-3" size={25} color="#f0f0f0" />
            <div className="w-100">
              <div className="empty long mb-1" />
              <div className="empty medium" />
            </div>
          </div>
          <div>
            <div className="empty circle" />
            <div className="empty small" />
          </div>
        </Col>
        <Col xs={2} className="d-flex align-items-center px-0">
          <div className="empty square" />
        </Col>
      </Row>
    </div>
  </div>
)

export default memo(EmptyList)
