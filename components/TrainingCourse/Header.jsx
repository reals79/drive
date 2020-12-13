import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import './TrainingCourse.scss'

const TrainingCourseHeader = ({ len }) => (
  <Row className="mx-0 training-course-header">
    <Col xs={7} className="pl-0">
      <p className="dsl-b12">Courses ({len})</p>
    </Col>
    <Col xs={2} className="px-0">
      <p className="dsl-b12 text-center">Assigned</p>
    </Col>
    <Col xs={2} className="px-0">
      <p className="dsl-b12 text-center">Due Date</p>
    </Col>
    <Col xs={1} />
  </Row>
)

TrainingCourseHeader.propTypes = {
  len: PropTypes.number,
}

TrainingCourseHeader.defaultProps = {
  len: 0,
}

export default memo(TrainingCourseHeader)
