import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Module from './Module'
import './LibraryModuleCard.scss'

function List(props) {
  const { userRole, data, onToggle, onModal, onSelect } = props

  return (
    <>
      {data.map((item, index) => (
        <Module
          key={`${item.id}-${index}`}
          userRole={userRole}
          name={item.name}
          description={item.data.description}
          type={item.card_type_id}
          thumbnail={item.data.thumb_url}
          assigned={item.data.assigned}
          published={item.published}
          onDetail={() => onToggle(item.id, 'view')}
          onPreview={() => onSelect('preview view', item)}
          onSelect={e => onSelect(e, item)}
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
