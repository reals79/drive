import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil, equals, length, isEmpty } from 'ramda'
import { Input, Button, Filter, Accordion, Dropdown } from '@components'
import HabitListItem from './HabitListItem'
import './LibraryToDoHabitSchedule.scss'

class Add extends Component {
  state = {
    title: '',
    description: '',
    selected: { author: [], department: [], competency: [], category: [] },
    habits: [],
  }

  handleAddHabits = () => {
    const { habits } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: { show: ['habits'], modules: [] }, after: habits },
      callBack: { onAttach: e => this.setState({ habits: habits.concat(e.templates) }) },
    })
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = published => () => {
    const { title, description, habits, selected } = this.state

    if (isEmpty(title) || isEmpty(selected.author) || isEmpty(habits)) return

    const _habits = habits.map(e => {
      return {
        blocked_by: null,
        card_template_id: e.id,
        card_type_id: 17,
        complete_course: 0,
        delay_days: 0,
      }
    })

    const data = {
      template: {
        card_type_id: 17,
        name: title,
        author_id: selected.author[0],
        access_type: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        children: habits,
        published,
        data: {
          description,
          modules: _habits,
          author: selected.author,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          type: 'recurring',
        },
      },
    }

    const payload = { type: 'habitslist', data }
    this.props.onCreate(payload)
  }

  render() {
    const { title, description, selected, habits } = this.state
    const { authors, departments, competencies, categories } = this.props

    const daily = [],
      weekly = [],
      monthly = []
    habits.map(item => {
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
          onBack={() => this.props.history.goBack()}
          dataCy="addHabitScheduleFilter"
        />
        <div className="lib-todo-habit-schedule" data-cy="addHabitScheduleForm">
          <div className="habit-schedule-detail">
            <div className="d-flex py-2">
              <p className="dsl-b18 bold mb-0">Add Habit Schedule</p>
            </div>
            <Input
              className="input-field"
              dataCy="title"
              title="Title"
              type="text"
              direction="vertical"
              value={title}
              placeholder="Type here..."
              onChange={e => this.setState({ title: e })}
            />
            <Input
              title="Description"
              dataCy="description"
              className="input-field input-textarea"
              type="text"
              value={description}
              as="textarea"
              rows="2"
              direction="vertical"
              value={description}
              placeholder="Type here..."
              onChange={e => this.setState({ description: e })}
            />
            <Accordion className="settings-habit-schedule">
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    dataCy="author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="departments"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    dataCy="competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    dataCy="categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
          <div className="detail-list mt-3" data-cy="addHabitIncluded">
            <p className="dsl-b22 bold pt-3">Habits Included</p>
            {length(habits) > 0 ? (
              <>
                <p className="dsl-b18 text-500">Daily Habits</p>
                <div
                  data-cy="addHabitScheduleDailyHabit"
                  className={`mb-4 ${length(daily) > 0 ? 'border-bottom' : ''}`}
                >
                  {daily.map((habit, index) => (
                    <HabitListItem
                      key={habit.id}
                      name={habit.name}
                      description={habit.data.description}
                      dataCy={`addDailyHabitListItem${index}`}
                    />
                  ))}
                </div>
                <p className="dsl-b18 text-500">Weekly Habits</p>
                <div
                  data-cy="addHabitScheduleWeeklyHabit"
                  className={`mb-4 ${length(weekly) > 0 ? 'border-bottom' : ''}`}
                >
                  {weekly.map((habit, index) => (
                    <HabitListItem
                      key={habit.id}
                      name={habit.name}
                      description={habit.data.description}
                      dataCy={`addWeeklyHabitListItem${index}`}
                    />
                  ))}
                </div>
                <p className="dsl-b18 text-500">Monthly Habits</p>
                <div
                  data-cy="addHabitScheduleMonthlyHabit"
                  className={`mb-4 ${length(monthly) > 0 ? 'border-bottom' : ''}`}
                >
                  {monthly.map((habit, index) => (
                    <HabitListItem
                      key={habit.id}
                      name={habit.name}
                      description={habit.data.description}
                      dataCy={`addMonthlyHabitListItem${index}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="dsl-m12 mb-0" data-cy="noHabitAddedYet">
                No habits added yet
              </p>
            )}
            <div className="justify-content-end d-flex px-3">
              <Button
                name="+ ADD HABIT"
                dataCy="addHabitBtn"
                className="px-0"
                type="link"
                onClick={this.handleAddHabits}
              />
            </div>
            <div className="mt-2 d-flex justify-content-end px-3">
              <Button
                name="Save Draft"
                dataCy="habitSaveDraft"
                className="btn-save mr-3"
                onClick={this.handleSubmit(0)}
              />
              <Button
                name="Save & Publish"
                className="btn-save"
                dataCy="addHabitSavePublish"
                onClick={this.handleSubmit(1)}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Add.propTypes = {
  authors: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  competencies: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  history: PropTypes.any.isRequired,
  onCreate: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
}

Add.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: [],
  onCreate: () => {},
  onModal: () => {},
}

export default Add
