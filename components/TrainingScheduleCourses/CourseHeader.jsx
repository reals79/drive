import React from 'react'
import PropTypes from 'prop-types'

const CourseHeader = ({ length, className, editable }) => (
  <div className={`d-flex border-bottom py-3 ${className}`}>
    <div className="d-flex-12 dsl-m12">Courses ({length})</div>
    <div className={`d-flex-3 dsl-m12 ${editable ? 'text-center' : 'text-right'}`}>Assigned</div>
    {!editable && <div className="d-flex-2 dsl-m12 text-right">Completed</div>}
    <div className="d-flex-3 dsl-m12 text-center">Due Date</div>
    {editable && <div className="d-flex-1 dsl-m12" />}
  </div>
)

CourseHeader.propTypes = {
  length: PropTypes.number,
  className: PropTypes.string,
  editable: PropTypes.bool,
}

CourseHeader.defaultProps = {
  length: 0,
  className: '',
  editable: true,
}

export default CourseHeader
