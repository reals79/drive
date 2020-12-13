import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { EditDropdown, Thumbnail } from '@components'
import { LibraryTrainingMenu } from '~/services/config'
import { removeAssign } from '~/services/util'
import './LibraryCourseCard.scss'

const Course = ({
  userRole,
  name,
  modules,
  assigned,
  thumbnail,
  description,
  published,
  onDetail,
  onSelect,
}) => {
  const options = removeAssign(LibraryTrainingMenu[userRole], published)
  return (
    <div className="library-course-card">
      <div className="lib-content">
        <div className="d-flex d-flex-1 cursor-pointer" onClick={onDetail}>
          <Thumbnail src={thumbnail} />
          <div className="course-content">
            <div className="d-flex-1 mr-4 cursor-pointer">
              <p className="dsl-b16 text-400 pb-0 mb-1">{name}</p>
              <p className="dsl-m14 truncate-one mb-0 text-400">{description}</p>
            </div>
            <div className="d-flex text-right courses-wrap">
              <div className="mr-4 modules">
                <p className="dsl-m12 mb-1 no-wrap text-400">
                  Modules<span className="d-md-none">:</span>
                </p>
                <p className="dsl-b16 mb-0 no-wrap text-400">{modules}</p>
              </div>
              <div className="mr-4 assigned">
                <p className="dsl-m12 mb-1 no-wrap text-400">
                  Assigned<span className="d-md-none">:</span>
                </p>
                <p className="dsl-b16 mb-0 no-wrap text-400">{assigned}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="edit">
          <EditDropdown options={options} onChange={onSelect} />
        </div>
      </div>
    </div>
  )
}

export default memo(Course)
