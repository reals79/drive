import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Icon } from '@components'
import './CareerPlan.scss'

const CareerPlan = props => (
  <div className="career-plan">
    <div className="header">
      <span className="dsl-b12">Performance Improvement Plans</span>
    </div>
    <div className="content">
      <Row>
        <Col xs={2} sm={2}>
          <Icon name="fa fa-exclamation-circle" color="#343f4b" size={18} />
        </Col>
        <Col xs={10} sm={10} className="no-left">
          None to report
        </Col>
      </Row>
    </div>
  </div>
)

CareerPlan.propTypes = {}

CareerPlan.defaultProps = {}

export default memo(CareerPlan)
