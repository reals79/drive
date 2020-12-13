import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import { LibraryProgramsList as ProgramsList } from '@components'
import './LibraryToDoHabitSchedule.scss'

function List(props) {
  const { data, role, dataCy } = props

  return (
    <>
      {data.map((item, index) => (
        <ProgramsList.ClosedList
          key={`${item.id}-${index}`}
          dataCy={dataCy + index}
          role={role}
          name={item.name}
          description={`Habits: ${length(item.children)}`}
          type="habitslist"
          modules={item.data.assigned}
          onToggle={() => props.onToggle(item.id)}
          onChange={e => props.onSelect(e, item)}
        />
      ))}
    </>
  )
}

List.propTypes = {
  data: PropTypes.array,
  onToggle: PropTypes.func,
}

List.defaultProps = {
  data: [],
  onSelect: () => {},
  onToggle: () => {},
}

export default memo(List)
