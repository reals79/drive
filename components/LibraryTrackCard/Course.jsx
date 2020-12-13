import React, { memo } from 'react'
import { EditDropdown, Thumbnail } from '@components'
import { LibraryAttachMenu } from '~/services/config'
import './LibraryTrackCard.scss'

function Course(props) {
  const { course, role, onMenu } = props
  let available = 'Immediately available'
  if (course.data && course.data.delay_days > 0) {
    available = `${course.data.delay_days} day`
    available = equals(course.data.delay_days, 1) ? available : `${available}s`
  }
  const thumbnail = course.data ? course.data.thumb_url || course.thumbnail : null
  const description = course.data ? course.data.description : null

  return (
    <div className="courses-list" key={course.id} data-cy={props.dataCy}>
      <div className="d-flex d-flex-1 cursor-pointer" onClick={() => onMenu('detail view', course)}>
        <Thumbnail dataCy="thumbnail" src={thumbnail} size="small" />
        <div className="name mr-2">
          <div className="justify-content-between">
            <span className="dsl-b16 text-400 mb-1" data-cy="courseName">
              {course.name}
            </span>
          </div>
          <p className="dsl-m14 text-400 truncate-one mb-0" data-cy="courseDescription">
            {description}
          </p>
        </div>
        <div className="lock">
          <p className="dsl-m12 text-400 mb-1">Time lock</p>
          <p className="dsl-m14 text-400 mb-0" data-cy="timeLock">
            {available}
          </p>
        </div>
      </div>
      <div className="ellipsis">
        <EditDropdown
          options={LibraryAttachMenu[role]}
          onChange={e => onMenu(e, course)}
          dataCy="threeDotMenu"
        />
      </div>
    </div>
  )
}

export default memo(Course)
