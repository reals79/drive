import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
import { isEmpty, values } from 'ramda'
import { Icon, Input, Button, Filter, Accordion, Dropdown } from '@components'
import { RecurringType } from '~/services/config'
import './AddHabit.scss'

class AddHabit extends Component {
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
    if (selected[key] == !tags) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = () => {
    const { title, description, selected } = this.state
    const payload = {
      template: {
        card_type_id: 8,
        name: title,
        author_id: selected.author[0],
        access_type: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: 1,
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
    this.props.onCreate(payload)
  }

  render() {
    const { title, description, selected } = this.state
    const { authors, departments, competencies, categories } = this.props
    const disabled = isEmpty(title) || isEmpty(selected.author)
    return (
      <div className="add-task-modal">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle mr-2" color="white" size={16} />
          <span className="dsl-w16">Add Habit</span>
        </div>
        <div className="modal-body">
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
        </div>
        <div className="modal-footer  mx-0 pb-4">
          <Button disabled={disabled} name="ADD Habit" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

AddHabit.propTypes = {
  authors: PropTypes.array.isRequired,
  departments: PropTypes.array.isRequired,
  competencies: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  history: PropTypes.any.isRequired,
  onCreate: PropTypes.func.isRequired,
}

AddHabit.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: [],
  onCreate: () => {},
}

export default AddHabit
