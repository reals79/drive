import React, { memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import moment from 'moment'
import { equals, isNil, split } from 'ramda'
import { CheckIcon, Icon, Thumbnail } from '@components'
import './TrainingItem.scss'

const TrainingItem = ({ task, completed = false, onClick, userId }) => {
  const { data, program_id, assigned_by, due_at, updated_at } = task
  const { thumb_url, name } = data

  const dueDate = isNil(due_at)
    ? moment(split(' ', updated_at)[0])
        .add(Number(data.estimated_completion), 'days')
        .format('MMM D, YY')
    : moment(due_at).format('MMM D, YY')

  return (
    <div className="training-item cursor-pointer">
      <Row className="custom-row mb-5 ml-1 mr-1">
        <Col className={`d-flex tab-device pr-0 pl-0 pt-3`} sm={12} md={12} onClick={onClick}>
          <CheckIcon className="custom-checkbox" size={26} checked={completed} />
          <div className="d-flex d-flex-1 justify-content-between">
            <div className="course-title ml-2">
              <p className="dsl-m12 text-400 mb-0 align-items-center mb-1">
                {isNil(program_id)
                  ? equals(assigned_by, userId)
                    ? 'Self Assigned'
                    : 'Manager Assigned'
                  : `Program Assigned : `}
              </p>
              <p className="dsl-m14 text-400 line-height-22 mb-2">{name}</p>
            </div>
            <div className="due-date w-50">
              <p className="dsl-m12 text-400 mb-0 text-right mb-1">Due Date</p>
              <p className="dsl-m16 text-400 text-right mb-1">
                <span>{moment(dueDate).format('MMM D, YY')}</span>
              </p>
            </div>
          </div>
        </Col>
        <div className="w-100">
          <Thumbnail src={thumb_url} size="responsive" className="cursor-pointer" />
        </div>
      </Row>
    </div>
  )
}

export default memo(TrainingItem)
