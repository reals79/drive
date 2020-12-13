import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { equals, isNil, values } from 'ramda'
import { Input, Button, Filter, Accordion, Dropdown, EditDropdown } from '@components'
import { RecurringType, LibraryToDoHabitDetailMenu } from '~/services/config'
import './LibraryToDoHabit.scss'

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
      frequency: RecurringType[`${this.props.data.data.schedule_interval}`],
    },
    disabled: true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps
    const { title, description, selected } = prevState
    const disabled =
      data.name == title &&
      data.data.description == description &&
      equals(selected.author, [data.author_id]) &&
      equals(selected.department, data.data.department || []) &&
      equals(selected.competency, data.data.competency || []) &&
      equals(selected.category, data.data.category || []) &&
      selected.frequency == RecurringType[`${data.data.schedule_interval}`]
    return { disabled }
  }

  handleSelectFrequency = e => {
    const schedule = e[0]
    const { selected } = this.state
    selected.frequency = schedule
    this.setState({ selected })
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = published => () => {
    const { id, title, description, selected } = this.state
    const data = {
      template: {
        id,
        card_type_id: 8,
        name: title,
        author_id: selected.author[0],
        access_type: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published,
        data: {
          description,
          author: selected.author,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          type: 'recurring',
          schedule_end: 'never',
          schedule_increment: 1,
          schedule_interval: selected.frequency.name,
          schedule_options: { days: [moment().format('ddd')] },
          schedule_start: new Date().toISOString(),
          schedule_start_timestamp: moment().unix(),
        },
      },
    }
    const payload = { type: 'habits', data }
    this.props.onUpdate(payload)
  }

  render() {
    const { title, description, selected, disabled } = this.state
    const {
      authors,
      departments,
      competencies,
      categories,
      userRole,
      onSelect,
      history,
    } = this.props
    const frequencyId = isNil(selected.frequency) ? 0 : selected.frequency.id

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all habits"
          onBack={() => history.goBack()}
          dataCy="todoEditHabitFilter"
        />
        <div className="lib-todo-habit" data-cy="todoEditHabitForm">
          <div className="habit-detail">
            <div className="d-flex justify-content-between py-2">
              <p className="dsl-b18 bold mb-0">Edit Habit</p>
              <EditDropdown
                options={LibraryToDoHabitDetailMenu[userRole]}
                onChange={onSelect}
                dataCy="todoEditHabitTopThreeDot"
              />
            </div>
            <Input
              className="input-field"
              title="Title"
              dataCy="title"
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
              as="textarea"
              rows="2"
              direction="vertical"
              value={description}
              placeholder="Type here..."
              onChange={e => this.setState({ description: e })}
            />
            <Dropdown
              title="Frequency"
              dataCy="frequency"
              direction="vertical"
              width="fit-content"
              data={values(RecurringType)}
              defaultIds={[frequencyId]}
              getValue={e => e.label}
              returnBy="data"
              onChange={this.handleSelectFrequency}
            />

            <Accordion className="settings-habit mt-3" expanded={false}>
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    dataCy="author"
                    direction="vertical"
                    width="fit-content"
                    getValue={e => e.name}
                    defaultIds={selected.author}
                    data={authors}
                    onChange={this.handleSelectTags('author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="department"
                    direction="vertical"
                    width="fit-content"
                    getValue={e => e.name}
                    defaultIds={selected.department}
                    data={departments}
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
                    getValue={e => e.name}
                    defaultIds={selected.competency}
                    data={competencies}
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
                    getValue={e => e.name}
                    defaultIds={selected.category}
                    data={categories}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
            </Accordion>
            <div className="mt-4 d-flex justify-content-end">
              <Button
                name="Save Draft"
                className="btn-save mr-3"
                dataCy="saveDraftBtn"
                disabled={disabled}
                onClick={this.handleSubmit(0)}
              />
              <Button
                name="Save & Publish"
                dataCy="savePublishBtn"
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
  tags: PropTypes.array,
  onUpdate: PropTypes.func,
}

Edit.defaultProps = {
  tags: [],
  onUpdate: () => {},
}

export default Edit
