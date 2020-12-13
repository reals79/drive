import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { equals, isEmpty, values } from 'ramda'
import { Input, Button, Filter, Accordion, Dropdown } from '@components'
import { RecurringType } from '~/services/config'
import './LibraryToDoHabit.scss'

class Add extends Component {
  state = {
    title: '',
    description: '',
    selected: { author: [], department: [], competency: [], category: [], frequency: [] },
  }

  handleSelectFrequency = e => {
    const schedule = e[0]
    const { selected } = this.state
    selected.frequency = schedule.name
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
    const { title, description, selected } = this.state
    if (isEmpty(title) || isEmpty(selected.author)) return
    const data = {
      template: {
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
          schedule_interval: selected.frequency,
          schedule_options: { days: [moment().format('ddd')] },
          schedule_start: new Date().toISOString(),
          schedule_start_timestamp: moment().unix(),
        },
      },
    }
    const payload = { type: 'habits', data }
    this.props.onCreate(payload)
  }

  render() {
    const { title, description, selected } = this.state
    const { authors, departments, competencies, categories } = this.props

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all habits"
          onBack={() => this.props.history.goBack()}
          dataCy="todoAddHabitFilter"
        />
        <div className="lib-todo-habit" data-cy="todoAddHabitForm">
          <div className="habit-detail">
            <div className="d-flex py-2">
              <p className="dsl-b18 bold mb-0">Add Habit</p>
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
              value={description}
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
              getValue={e => e.label}
              returnBy="data"
              onChange={this.handleSelectFrequency}
            />
            <Accordion className="settings-habit mt-2">
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
            <div className="mt-4 d-flex justify-content-end">
              <Button
                name="Save Draft"
                className="btn-save mr-3"
                dataCy="saveDraftBtn"
                onClick={this.handleSubmit(0)}
              />
              <Button
                name="Save & Publish"
                dataCy="savePublishBtn"
                className="btn-save"
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
}

Add.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: [],
  onCreate: () => {},
}

export default Add
