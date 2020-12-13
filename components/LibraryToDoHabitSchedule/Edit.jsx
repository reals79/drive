import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { clone, equals, findIndex, isNil, length, propEq, remove } from 'ramda'
import { Input, Button, Filter, Accordion, Dropdown, EditDropdown } from '@components'
import { LibraryToDoHabitScheduleDetailMenu } from '~/services/config'
import HabitListItem from './HabitListItem'

class Edit extends Component {
  state = {
    id: this.props.data.id,
    title: this.props.data.name,
    description: this.props.data.data.description,
    selected: {
      author: [this.props.data.author_id],
      department: this.props.data.data.department || [],
      competency: this.props.data.data.competency || [],
      category: this.props.data.data.category || [],
    },
    habits: this.props.data.children,
    disabled: true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps
    const habits = data.children || []
    const { title, description, selected } = prevState
    const disabled =
      data.name == title &&
      data.data.description == description &&
      equals(selected.author, [data.author_id]) &&
      equals(selected.department, data.data.department || []) &&
      equals(selected.competency, data.data.competency || []) &&
      equals(selected.category, data.data.category || []) &&
      equals(prevState.habits, habits)
    if (!equals(habits, prevState.habits)) {
      return { habits: prevState.habits, disabled }
    } else return { disabled }
  }

  handleAddHabits = () => {
    const { habits } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: { show: ['habits'], modules: [], selected: habits }, after: habits },
      callBack: { onAttach: habits => this.setState({ habits: habits.templates }) },
    })
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSelectMenu = habit => event => {
    const { habits } = this.state
    const index = findIndex(propEq('id', habit.id), habits)
    if (index > -1) {
      let newHabits = clone(habits)
      if (equals(event, 'remove')) {
        newHabits = remove(index, 1, newHabits)
      }
      this.setState({ habits: newHabits })
    }
  }

  handleSubmit = published => () => {
    const { id, title, description, habits, selected } = this.state
    const _habits = habits.map(e => ({
      blocked_by: null,
      card_template_id: e.id,
      card_type_id: 17,
      complete_course: 0,
      delay_days: 0,
    }))
    const data = {
      template: {
        id,
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
    this.props.onUpdate(payload)
  }

  render() {
    const { title, description, selected, habits, disabled } = this.state
    const { authors, departments, competencies, categories, userRole, onSelect, history } = this.props

    const daily = [],
      weekly = [],
      monthly = []
    habits.map(item => {
      const { schedule_interval } = item.data
      if (equals(schedule_interval, 'day')) {
        daily.push(item)
      }
      if (equals(schedule_interval, 'week')) {
        weekly.push(item)
      }
      if (equals(schedule_interval, 'month') || isNil(schedule_interval)) {
        monthly.push(item)
      }
    })

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all habit schedules"
          onBack={() => history.goBack()}
          dataCy="EditHabitScheduleFilter"
        />
        <div className="lib-todo-habit-schedule" data-cy="editHabitScheduleForm">
          <div className="habit-schedule-detail">
            <div className="d-flex justify-content-between py-2">
              <p className="dsl-b18 bold mb-0">Edit Habit Schedule</p>
              <EditDropdown options={LibraryToDoHabitScheduleDetailMenu[userRole]} onChange={onSelect} />
            </div>
            <Input
              className="input-field"
              title="Title"
              dataCy="title"
              type="text"
              direction="vertical"
              value={title}
              placeholder="Type here..."
              onChange={title => this.setState({ title })}
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
              onChange={description => this.setState({ description })}
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
                    defaultIds={selected.author}
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
                    defaultIds={selected.department}
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
                    defaultIds={selected.competency}
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
                    defaultIds={selected.category}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
          <div className="detail-list mt-3" data-cy="editHabitIncluded">
            <p className="dsl-b22 bold pt-3">Habits Included</p>
            {length(habits) > 0 ? (
              <>
                <p className="dsl-b18 text-500">Daily Habits</p>
                <div
                  data-cy="editHabitScheduleDailyHabit"
                  className={`mb-4 ${length(daily) > 0 ? 'border-bottom' : ''}`}
                >
                  {daily.map((habit, index) => (
                    <HabitListItem
                      dataCy={`editDailyHabitListItem${index}`}
                      key={habit.id}
                      name={habit.name}
                      description={habit.data.description}
                      assigned={habit.data.assigned || 0}
                      editable
                      onSelect={this.handleSelectMenu(habit)}
                    />
                  ))}
                </div>
                <p className="dsl-b18 text-500">Weekly Habits</p>
                <div
                  data-cy="editHabitScheduleWeeklyHabit"
                  className={`mb-4 ${length(weekly) > 0 ? 'border-bottom' : ''}`}
                >
                  {weekly.map((habit, index) => (
                    <HabitListItem
                      key={habit.id}
                      name={habit.name}
                      description={habit.data.description}
                      assigned={habit.data.assigned || 0}
                      editable
                      onSelect={this.handleSelectMenu(habit)}
                      dataCy={`editWeeklyHabitListItem${index}`}
                    />
                  ))}
                </div>
                <p className="dsl-b18 text-500">Monthly Habits</p>
                <div
                  data-cy="editHabitScheduleMonthlyHabit"
                  className={`mb-4 ${length(monthly) > 0 ? 'border-bottom' : ''}`}
                >
                  {monthly.map((habit, index) => (
                    <HabitListItem
                      key={habit.id}
                      name={habit.name}
                      description={habit.data.description}
                      assigned={habit.data.assigned || 0}
                      editable
                      onSelect={this.handleSelectMenu(habit)}
                      dataCy={`editMonthlyHabitListItem${index}`}
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
                className="btn-save mr-3"
                dataCy="habitSaveDraft"
                disabled={disabled}
                onClick={this.handleSubmit(0)}
              />
              <Button
                name="Save & Publish"
                dataCy="habitSavePublish"
                className="btn-save"
                disabled={disabled}
                onClick={this.handleSubmit(1)}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Edit.propTypes = {
  editable: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.any,
    author_id: PropTypes.number,
  }),
  tags: PropTypes.array,
  onUpdate: PropTypes.func,
  onModal: PropTypes.func,
}

Edit.defaultProps = {
  editable: false,
  tags: [],
  data: {
    id: 0,
    name: '',
    data: {},
    author_id: 0,
  },
  onUpdate: () => {},
  onModal: () => {},
}

export default Edit
