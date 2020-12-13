import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Icon } from '@components'
import './LibraryProgramsList.scss'

const EmptyList = () => (
  <div className="library-programs-list px-0">
    <div className="programs-empty-list">
      <Row className="mx-0">
        <Col xs={10} className="px-0 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center w-100">
            <Icon name="fal fa-circle mr-3" size={25} color="#f0f0f0" />
            <div className="w-100">
              <div className="empty long" />
            </div>
          </div>
          <div className="px-0 d-flex align-items-center w-100">
            <div className="empty square min-height-50" />
            <div className="empty square min-height-50" />
          </div>
        </Col>
        <Col xs={2} className="px-0 d-flex align-items-center">
          <div className="empty square min-height-100" />
        </Col>
      </Row>
    </div>
  </div>
)

export default EmptyList
