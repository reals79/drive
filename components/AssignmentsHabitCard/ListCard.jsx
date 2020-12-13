import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { equals, isNil, filter, includes } from 'ramda'
import { Button, CheckBox, CheckIcon, EditDropdown } from '@components'
import { UserRoles, AdminDotsType, UserDotsType } from '~/services/config'
import './AssignmentsHabitCard.scss'

const ListCard = ({
  userRole,
  data,
  title,
  userId,
  bulkSelect,
  bulkList,
  onSelect,
  onBulkSelect,
  onSelectAllBulks,
  hideSelectAll = false,
  dataCy,
}) => {
  let dotsMenu = userRole > UserRoles.MANAGER ? UserDotsType : AdminDotsType
  dotsMenu = filter(x => !equals(x, 'Preview View'), dotsMenu)
  return (
    <div className="assignment-habit-card" data-cy={dataCy}>
      <div className="dsl-b18 bold mb-1">{title} Habits</div>
      <div className="card-item pt-2 py-3">
        <div className="d-flex-11">
          <p className="dsl-m12 text-400 m-0">Habits</p>
        </div>
        <div className="d-flex-2">
          <p className="dsl-m12 text-400 m-0">Assigned</p>
        </div>
        <div className="d-flex-2 d-none d-md-block">
          <p className="dsl-m12 text-400 m-0">Completed</p>
        </div>
        <div className="d-flex-1 d-none d-md-block" />
        {hideSelectAll && bulkSelect && (
          <div className="bulk-unassign">
            <Button type="link" className="select-all" onClick={onSelectAllBulks}>
              SELECT ALL
            </Button>
          </div>
        )}
      </div>
      {data.map(habit => {
        const selected = includes(habit.id, bulkList)
        return (
          <div className={`card-item ${selected ? 'bulked' : ''}`} key={habit.id}>
            <div className="d-flex-1">
              <CheckIcon size={26} checked={!isNil(habit.completed_at)} />
            </div>
            <div className="d-flex-10">
              <p className="dsl-b14 text-400 m-0">{habit.name || habit.data.name}</p>
              <p className="dsl-m12 text-400 m-0">{title}</p>
            </div>
            <div className="d-flex-2">
              <p className="dsl-b14 text-400">
                {isNil(habit.program_id) ? (equals(habit.assignedBy, userId) ? 'Self' : 'Manager') : `Program`}
              </p>
            </div>
            <div className="d-flex-2 d-none d-md-block">
              <p className="dsl-b14 text-400 ml-4">{habit.completed ? habit.completed : 0}%</p>
            </div>
            <div className="d-flex-1 d-none d-md-block">
              <EditDropdown options={dotsMenu} disabled={bulkSelect} onChange={e => onSelect(e, habit)} />
            </div>
            {bulkSelect && (
              <div className="bulk-unassign">
                {isNil(habit.program_id) && (
                  <CheckBox
                    size="tiny"
                    id={habit.id}
                    checked={selected}
                    reversed={bulkSelect && selected}
                    onChange={e => onBulkSelect(habit, e.target.checked)}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

ListCard.propTypes = {
  userRole: PropTypes.number,
  userId: PropTypes.number,
  data: PropTypes.any,
  onSelect: PropTypes.func,
}

ListCard.defaultProps = {
  userRole: 1,
  userId: 0,
  data: {},
  onSelect: () => {},
}

export default memo(ListCard)
