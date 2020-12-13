import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Quota from './ListCard'
import './LibraryToDoQuota.scss'

function List(props) {
  const { data, role } = props

  return (
    <div className="lib-todo-quota" data-cy="quota-list">
      {data.map(quota => (
        <Quota
          role={role}
          key={quota.id}
          name={quota.name}
          data={quota.data}
          published={quota.published}
          onToggle={() => props.onToggle(quota.id)}
          onChange={e => props.onSelect(e, quota)}
        />
      ))}
    </div>
  )
}

List.propTypes = {
  role: PropTypes.number,
  data: PropTypes.array,
  onToggle: PropTypes.func,
  onModal: PropTypes.func,
}

List.defaultProps = {
  role: 1,
  data: [],
  onToggle: () => {},
  onModal: () => {},
}

export default memo(List)
