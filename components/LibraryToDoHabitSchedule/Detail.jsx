import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil, equals, length } from 'ramda'
import { Filter, Accordion, Dropdown, EditDropdown } from '@components'
import { LibraryToDoHabitScheduleDetailMenu } from '~/services/config'
import HabitListItem from './HabitListItem'
import './LibraryToDoHabitSchedule.scss'

function Detail(props) {
  const {
    editable,
    authors,
    departments,
    competencies,
    categories,
    history,
    data,
    userRole,
    onSelect,
  } = props

  if (isNil(data)) return null

  const departmentIds = data.data.department || []
  const competencyIds = data.data.competency || []
  const categoryIds = data.data.category || []

  const daily = [],
    weekly = [],
    monthly = []
  data.children.map(item => {
    const { schedule_interval } = item.data
    if (equals(schedule_interval, 'day')) daily.push(item)
    if (equals(schedule_interval, 'week')) weekly.push(item)
    if (equals(schedule_interval, 'month') || isNil(schedule_interval)) monthly.push(item)
  })

  return (
    <>
      <Filter
        aligns={['left', 'right']}
        backTitle="all habit schedules"
        onBack={() => history.goBack()}
      />
      <div className="lib-todo-habit-schedule">
        <div className="habit-schedule-detail">
          <div className="d-flex justify-content-between py-2">
            <p className="dsl-b22 bold">{data.name}</p>
            <EditDropdown
              options={LibraryToDoHabitScheduleDetailMenu[userRole]}
              onChange={onSelect}
            />
          </div>
          <div className="">
            <p className="dsl-m12 mb-2">Description</p>
            <p className="dsl-b16 p-2">{data.data.description || data.description}</p>
          </div>
          <Accordion className="settings-habit-schedule" expanded={false}>
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Author"
                  direction="vertical"
                  width="fit-content"
                  disabled={!editable}
                  getValue={e => e.name}
                  defaultIds={[data.author_id]}
                  data={authors}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Departments"
                  direction="vertical"
                  width="fit-content"
                  disabled={!editable}
                  getValue={e => e.name}
                  defaultIds={departmentIds}
                  data={departments}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Competencies"
                  direction="vertical"
                  width="fit-content"
                  disabled={!editable}
                  getValue={e => e.name}
                  defaultIds={competencyIds}
                  data={competencies}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Categories"
                  direction="vertical"
                  width="fit-content"
                  disabled={!editable}
                  getValue={e => e.name}
                  defaultIds={categoryIds}
                  data={categories}
                />
              </Col>
            </Row>
          </Accordion>
        </div>
        <div className="detail-list mt-3">
          <p className="dsl-b22 bold pt-3">Habits Included</p>
          <p className="dsl-b18 text-500">Daily Habits</p>
          <div className={`mb-4 ${length(daily) > 0 ? 'border-bottom' : ''}`}>
            {daily.map(habit => (
              <HabitListItem
                key={habit.id}
                name={habit.name}
                description={habit.data.description}
                assigned={habit.data.assigned || 0}
              />
            ))}
          </div>
          <p className="dsl-b18 text-500">Weekly Habits</p>
          <div className={`mb-4 ${length(weekly) > 0 ? 'border-bottom' : ''}`}>
            {weekly.map(habit => (
              <HabitListItem
                key={habit.id}
                name={habit.name}
                description={habit.data.description}
                assigned={habit.data.assigned || 0}
              />
            ))}
          </div>
          <p className="dsl-b18 text-500">Monthly Habits</p>
          <div className={`mb-4 ${length(monthly) > 0 ? 'border-bottom' : ''}`}>
            {monthly.map(habit => (
              <HabitListItem
                key={habit.id}
                name={habit.name}
                description={habit.data.description}
                assigned={habit.data.assigned || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

Detail.propTypes = {
  editable: PropTypes.bool,
  tags: PropTypes.array,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.any,
    author_id: PropTypes.number,
  }),
}

Detail.defaultProps = {
  editable: false,
  tags: [],
  data: {
    id: 0,
    name: '',
    data: {},
    author_id: 0,
  },
}

export default memo(Detail)
