import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { length } from '~/services/util'
import Course from './Course'

function List(props) {
  const { userRole, data, onModal, onToggle, onSelect } = props

  return (
    <>
      {data.map((course, index) => (
        <Course
          key={`${course.id}-${index}`}
          id={course.id}
          userRole={userRole}
          name={course.name}
          description={course.data.description}
          thumbnail={course.data.thumb_url}
          modules={length(course.children)}
          assigned={course.data.assigned}
          published={course.published}
          onModal={e => onModal(e)}
          onDetail={() => onToggle(course.id, 'view')}
          onSelect={e => onSelect(e, course)}
        />
      ))}
    </>
  )
}

List.propTypes = {
  userRole: PropTypes.number,
  data: PropTypes.array,
  onToggle: PropTypes.func,
}

List.defaultProps = {
  userRole: 1,
  data: [],
  onToggle: () => {},
}

export default memo(List)
