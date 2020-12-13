import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { isNil, isEmpty } from 'ramda'
import { LibraryProgramsList as ProgramsList } from '@components'
import { RecurringType } from '~/services/config'
import './LibraryToDoHabit.scss'

function List(props) {
  const { data, role, dataCy } = props
  return (
    <>
      {data.map((item, index) => {
        const { schedule_interval } = item.data
        const schedule =
          isNil(schedule_interval) || isEmpty(schedule_interval)
            ? 'month'
            : schedule_interval.name || schedule_interval

        return (
          <ProgramsList.ClosedList
            key={`${item.id}-${index}`}
            dataCy={dataCy + index}
            role={role}
            name={item.name}
            description={RecurringType[schedule].label}
            type="habits"
            modules={item.data.assigned}
            published={item.published}
            onToggle={() => props.onToggle(item.id)}
            onChange={e => props.onSelect(e, item)}
          />
        )
      })}
    </>
  )
}

List.propTypes = {
  role: PropTypes.number,
  data: PropTypes.array,
  onModal: PropTypes.func,
  onSelect: PropTypes.func,
  onToggle: PropTypes.func,
}

List.defaultProps = {
  role: 1,
  data: [],
  onModal: () => {},
  onSelect: () => {},
  onToggle: () => {},
}

export default memo(List)
