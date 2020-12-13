import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { length, equals } from 'ramda'
import moment from 'moment'
import { CheckBox, Thumbnail, Icon, Dropdown } from '@components'
import { MenuItems } from '~/services/config'

const ScheduleDetailItem = ({ course, onClick }) => {
  const { name, data, stats, children, due_date } = course
  const { assigned, completed, past_due } = stats
  const modules = length(children)
  const isCompleted = equals(modules, completed + past_due)

  return (
    <Row className="mx-0 training-course-item" onClick={onClick}>
      <Col xs={7} className="course-detail align-items-center">
        <CheckBox className="pr-3" checked={isCompleted} size="regular" />
        <Thumbnail className="pr-3" src={data.thumb_url} size="tiny" />
        <div className="pr-3">
          <p
            className={`dsl-m14 text-400 mb-1 truncate-one ${
              isCompleted ? 'text-line-through' : ''
            }`}
          >
            {name}
          </p>
          <p className={`dsl-m12 mb-0 truncate-two ${isCompleted ? 'text-line-through' : ''}`}>
            {data.description}
          </p>
        </div>
      </Col>
      <Col xs={2}>
        <p className="dsl-m14 mb-0 text-center">{assigned}</p>
      </Col>
      <Col xs={2}>
        <p className="dsl-m14 mb-0 text-center">{moment(due_date).format('MMM DD')}</p>
      </Col>
      <Col xs={1}>
        <Dropdown
          data={MenuItems}
          defaultIds={[0]}
          align="right"
          caret="dots-without-title"
          onChange={() => {}}
        />
      </Col>
    </Row>
  )
}

ScheduleDetailItem.propTypes = {
  course: PropTypes.any,
  onClick: PropTypes.func,
}

ScheduleDetailItem.defaultProps = {
  course: {},
  onClick: () => {},
}

export default memo(ScheduleDetailItem)
