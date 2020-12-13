import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { LibraryProgramsList as ProgramsList } from '@components'
import './LibraryToDoScoreCard.scss'

function List(props) {
  const { data, role } = props
  return (
    <>
      {data.map((item, index) => (
        <ProgramsList.ClosedList
          key={`sc${index}`}
          role={role}
          name={item.title}
          description={item.data.description}
          modules={item.data.assigned}
          quotas={item.data.quotas}
          type="scorecards"
          published={item.published}
          onToggle={() => props.onToggle(item.id)}
          onChange={e => props.onSelect(e, item)}
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
}

List.defaultProps = {
  role: 1,
  data: [],
  onToggle: () => {},
  onModal: () => {},
}

export default memo(List)
