import React from 'react'
import PropTypes from 'prop-types'
import { LibraryProgramsList as ProgramsList } from '@components'
import './LibraryProgramsCertification.scss'

function List(props) {
  const { data, role } = props

  return (
    <>
      {data.map((item, index) => (
        <ProgramsList.ClosedList
          key={`${item.id}-${index}`}
          role={role}
          name={item.title}
          description={item.data.description}
          thumbnail={item.data.thumb_url}
          modules={item.data.assigned}
          type="certifications"
          published={item.published}
          onToggle={() => props.onToggle(item.id)}
          onChange={e => props.onChange(e, item)}
        />
      ))}
    </>
  )
}

List.propTypes = {
  role: PropTypes.number,
  data: PropTypes.array,
  onToggle: PropTypes.func,
  onModal: PropTypes.func,
  onChange: PropTypes.func,
}

List.defaultProps = {
  role: 1,
  data: [],
  onToggle: () => {},
  onModal: () => {},
  onChange: (event, program) => {},
}

export default List
