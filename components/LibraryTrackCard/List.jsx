import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import Track from './Track'

function List(props) {
  const { data, userRole, onSelect, onToggle } = props
  return (
    <>
      {data.map((item, index) => (
        <Track
          key={`${item.id}-${index}`}
          userRole={userRole}
          name={item.name || item.title}
          description={item.data.description || item.description}
          thumbnail={item.data.thumbnail || item.thumbnail}
          courses={length(item.data.cards)}
          modules={item.data.module_count}
          assigned={item.data.assigned}
          published={item.published}
          onSelect={e => onSelect(e, item)}
          onToggle={() => onToggle(item.id, 'view')}
        />
      ))}
    </>
  )
}

List.propTypes = {
  userRole: PropTypes.number,
  data: PropTypes.array,
  onModal: PropTypes.func,
  onToggle: PropTypes.func,
}

List.defaultProps = {
  userRole: 1,
  data: [],
  onModal: () => {},
  onToggle: () => {},
}

export default memo(List)
