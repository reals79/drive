import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { find, propEq } from 'ramda'
import moment from 'moment'
import { Avatar, CheckBox, DatePicker, Dropdown, EditDropdown, Thumbnail } from '@components'
import { avatarBackgroundColor } from '~/services/util'

const dotsMenu = ['Remove']

const CourseItem = ({
  className,
  editable,
  course,
  scheduleUsers,
  employees,
  minDate,
  maxDate,
  onChangeDate,
  onChangeUsers,
  onRemove,
}) => {
  const { status, description, users } = course
  const isCompleted = status === 3
  const thumbnail = course.thumbnail || course.data ? course.data.thumb_url : ''
  const dueDate = !course.due_date ? course.end_at : course.due_date
  const title = course.name || course.title
  const completed = editable ? '' : (course.stats.completed / course.stats.assigned).toFixed(2) * 100
  let selectedUser = scheduleUsers ? scheduleUsers : users
  selectedUser = selectedUser.length == 0 ? null : selectedUser

  return (
    <div className={`d-flex border-bottom py-3 ${className}`}>
      <div className="d-flex-12 d-flex align-items-center">
        <CheckBox className="pr-3" checked={isCompleted} size="regular" />
        <Thumbnail className="pr-3" src={thumbnail} size="tiny" />
        <div className="pr-3">
          <p className={`dsl-m14 text-400 mb-1 truncate-one ${isCompleted ? 'text-line-through' : ''}`}>{title}</p>
          <p className={`dsl-m12 mb-0 truncate-two ${isCompleted ? 'text-line-through' : ''}`}>{description}</p>
        </div>
      </div>
      <div className={`d-flex-3 justify-content-end align-items-end ${editable ? 'd-flex' : 'align-self-center'} `}>
        {editable ? (
          <Dropdown
            multi
            width="fit-content"
            disabled={!editable}
            defaultIds={selectedUser}
            data={employees}
            getValue={e => e.name}
            onChange={onChangeUsers}
          />
        ) : (
          <div className="employees-detail">
            <p className="dsl-m14 mb-0 text-400 text-right">{selectedUser?.length}</p>
            <div className="employees-detail-modal">
              {selectedUser?.length !== 0 && (
                <>
                  <div className="d-flex">
                    <div className="d-flex-4">
                      <p className="dsl-m10 text-400 text-left">Employee</p>
                    </div>
                  </div>
                  {selectedUser?.map(id => {
                    const user = find(propEq('id', id), employees)
                    if (user) {
                      return (
                        <div className="d-flex py-1" key={id}>
                          <div className="d-flex d-flex-4">
                            <Avatar
                              className="d-flex-1"
                              url={user.profile.avatar}
                              size="extraTiny"
                              type="initial"
                              name={user.name}
                              backgroundColor={avatarBackgroundColor(id)}
                            />
                            <div className="d-flex-3 dsl-b12 ml-2 text-left text-400 align-self-center">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {!editable && <div className="d-flex-2 dsl-m14 text-400 text-right align-self-center">{completed}%</div>}
      {editable ? (
        <div className="d-flex-3 d-flex align-self-center justify-content-center">
          <DatePicker
            placeholder="Select"
            closeAfterSelect
            title={!dueDate ? 'Select' : moment(dueDate).format('MMM D')}
            value={!dueDate ? moment() : moment(dueDate)}
            calendar="day"
            append="caret"
            minDate={new Date(minDate)}
            maxDate={new Date(maxDate)}
            onSelect={e => onChangeDate(moment(e).format('YYYY-MM-DD'))}
          />
        </div>
      ) : (
        <div className="d-flex-3 d-flex align-self-center justify-content-center dsl-m14 text-400">
          {!dueDate ? moment() : moment(dueDate).format('MMM D')}
        </div>
      )}
      {editable && (
        <div className="d-flex-1 d-flex align-items-center justify-content-end">
          <EditDropdown options={dotsMenu} onChange={onRemove} />
        </div>
      )}
    </div>
  )
}

CourseItem.propTypes = {
  course: PropTypes.any,
  editable: PropTypes.bool,
  className: PropTypes.string,
  employees: PropTypes.array,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  onChangeDate: PropTypes.func,
  onChangeUsers: PropTypes.func,
  onRemove: PropTypes.func,
}

CourseItem.defaultProps = {
  course: {},
  editable: false,
  className: '',
  employees: [],
  minDate: null,
  maxDate: null,
  onChangeDate: () => {},
  onChangeUsers: () => {},
  onRemove: () => {},
}

export default memo(CourseItem)
