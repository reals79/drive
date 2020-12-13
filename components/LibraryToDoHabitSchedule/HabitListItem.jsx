import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { EditDropdown, Icon } from '@components'
import './LibraryToDoHabitSchedule.scss'

const dotsMenu = ['Remove']

const HabitListItem = ({ name, description, editable, assigned, onSelect, dataCy }) => (
  <div className="lib-todo-habit-schedule" data-cy={dataCy}>
    <div className="d-flex justify-content-between py-3 border-top">
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex align-items-center">
          <Icon name="fal fa-circle mr-3" size={25} color="#676767" />
          <div>
            <p className="dsl-b16 mb-1" data-cy="name">
              {name}
            </p>
            <p className="dsl-m12 mb-0" data-cy="description">
              {description}
            </p>
          </div>
        </div>
        <div className="text-right ml-3">
          <p className="dsl-m12 mb-1">Assigned</p>
          <p className="dsl-b14 mb-0" data-cy="assigned">
            {assigned}
          </p>
        </div>
      </div>
      {editable && (
        <div className="edit d-none d-lg-flex">
          <EditDropdown options={dotsMenu} onChange={onSelect} dataCy="habitListItemEditDropdown" />
        </div>
      )}
    </div>
  </div>
)

HabitListItem.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  editable: PropTypes.bool,
  assigned: PropTypes.number,
  onSelect: PropTypes.func,
}

HabitListItem.defaultProps = {
  name: '',
  description: '',
  editable: false,
  assigned: 0,
  onSelect: () => {},
}

export default memo(HabitListItem)
