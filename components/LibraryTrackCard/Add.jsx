import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { clone, concat, equals, filter, is, isEmpty, length } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Icon, Input, Thumbnail, Toggle } from '@components'
import Course from './Course'
import './LibraryTrackCard.scss'

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      thumbnail: '',
      objectives: ['', ''],
      selected: {
        author: [],
        department: [],
        competency: [],
        category: [],
      },
      chronologicalLock: false,
      timeLock: false,
      courses: [],
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAttachCourse = this.handleAttachCourse.bind(this)
    this.handleObjectiveAdd = this.handleObjectiveAdd.bind(this)
    this.handleObjeciveChange = this.handleObjectiveChange.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.handleObjectiveDelete = this.handleObjectiveDelete.bind(this)
  }

  handleAttachCourse() {
    let { courses } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: {}, after: {} },
      callBack: {
        onAttach: e => {
          courses = concat(courses, e.templates)
          this.setState({ courses })
        },
      },
    })
  }

  handleDrop(e) {
    this.setState({ thumbnail: e })
  }

  handleSelectTags(key, tags) {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit(published) {
    const { name, description, thumbnail, objectives, chronologicalLock, timeLock, selected, courses } = this.state
    const _objectives = filter(e => !isEmpty(e), objectives)

    const _courses = courses.map(item => ({
      alert_manager: null,
      blocked_by: item.blocked_by,
      card_type: 'course',
      card_template_id: item.id,
      complete_track: null,
    }))

    if (isEmpty(selected.author) || name === '') return

    const payload = {
      track: {
        user_id: null,
        title: name,
        status: 0,
        data: {
          cards: _courses,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          objectives: _objectives,
        },
        result: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        author_id: selected.author[0],
        type: 1,
        completed_at: null,
        designation: 1,
        program_id: null,
        archived: 0,
        description,
        start_at: null,
        end_at: null,
        chronological_lock: chronologicalLock,
        time_lock: timeLock,
        program_level: 1,
        published,
        thumbnail: is(String, thumbnail) ? thumbnail : '',
      },
    }

    this.props.onUpdate(payload, thumbnail, null, null, null)
  }

  handleSwitch(item, e) {
    if (equals(item, 'chronological')) {
      this.setState({ chronologicalLock: e })
    } else {
      this.setState({ timeLock: e })
    }
  }

  handleObjectiveChange(index, e) {
    const objectives = clone(this.state.objectives)
    objectives[index] = e
    this.setState({ objectives })
  }

  handleObjectiveAdd() {
    const objectives = clone(this.state.objectives)
    objectives.push('')
    this.setState({ objectives })
  }

  handleObjectiveDelete(index) {
    const objectives = clone(this.state.objectives)
    objectives.splice(index, 1)
    this.setState({ objectives })
  }

  render() {
    const { role, authors, departments, competencies, categories, history, onChildMenu } = this.props
    const { name, description, thumbnail, objectives, chronologicalLock, timeLock, courses, selected } = this.state
    const disabled = isEmpty(selected.author) || name === ''

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all tracks"
          onBack={() => history.goBack()}
          dataCy="library-training-trackFilterSection"
        />
        <div className="library-track-card border-5" data-cy="library-training-addTrack">
          <div className="detail-content">
            <div className="d-flex justify-content-between mb-3">
              <span className="dsl-b22 bold">Add Track</span>
            </div>
            <Input
              className="track-input mb-3"
              dataCy="library-training-track-title"
              title="Title"
              value={name}
              placeholder="Type here..."
              direction="vertical"
              onChange={e => this.setState({ name: e })}
            />
            <div className="d-flex">
              <Thumbnail
                type="upload"
                src={thumbnail}
                size="medium"
                onDrop={this.handleDrop}
                dataCy="library-training-track-thumbnail"
              />
              <div className="pl-4 d-flex-1">
                <Input
                  className="track-text"
                  dataCy="library-training-track-description"
                  title="Module description"
                  placeholder="Type here..."
                  direction="vertical"
                  as="textarea"
                  value={description}
                  onChange={e => this.setState({ description: e })}
                />
              </div>
            </div>

            <p className="dsl-d12 mt-4">Learning objectives:</p>
            {objectives.map((item, index) => (
              <div className="d-flex">
                <Input
                  className="module-input mb-2 d-flex-1"
                  dataCy={`library-training-track-learningObjectiveContent${index}`}
                  key={`objectives${index}`}
                  value={item}
                  placeholder="Type here..."
                  direction="vertical"
                  onChange={this.handleObjectiveChange.bind(this, index)}
                />
                <Button
                  className="ml-auto"
                  dataCy={`library-training-track-learningObjectiveTrashBtn${index}`}
                  type="link"
                  onClick={this.handleObjectiveDelete.bind(this, index)}
                >
                  <Icon name="far fa-trash-alt" size={14} color="#376caf" />
                </Button>
              </div>
            ))}
            <Button
              className="ml-auto"
              dataCy="library-training-track-learningObjectiveAddBtn"
              type="link"
              onClick={this.handleObjectiveAdd}
            >
              <Icon name="far fa-plus" size={14} color="#376caf" />
              <span className="dsl-p14 text-400 ml-1">ADD OBJECTIVE</span>
            </Button>

            <Accordion className="settings" expanded>
              <Row className="mt-3">
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Author"
                    dataCy="library-training-track-author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="library-training-track-department"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    dataCy="library-training-track-competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    dataCy="library-training-track-categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'category')}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6} md={6}>
                  <p className="dsl-m12">Associated metrics</p>
                  <p className="dsl-b16 ml-2">Facebook</p>
                </Col>
                <Col sm={6} md={6}>
                  <p className="dsl-m12">Est days to complete</p>
                  <p className="dsl-b16 ml-2">45</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6} md={6}>
                  <Toggle
                    checked={chronologicalLock}
                    title="Chronology Lock"
                    dataCy="library-training-track-chronologicalLock"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSwitch.bind(this, 'chronological')}
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Toggle
                    checked={timeLock}
                    dataCy="library-training-track-timeLock"
                    title="Time Lock"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSwitch.bind(this, 'time')}
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
        </div>

        <div className="library-track-card mt-2 border-5">
          <div className="modules-content">
            <p className="dsl-b22 bold">Courses Included</p>
            <Button
              className="ml-auto"
              type="link"
              onClick={this.handleAttachCourse}
              dataCy="library-training-track-addCourseBtn"
            >
              <Icon name="far fa-plus" size={14} color="#376caf" />
              <span className="dsl-p14 text-400 ml-1">ADD COURSE</span>
            </Button>
            {length(courses) > 0 ? (
              <>
                {courses.map(item => (
                  <Course key={item.id} course={item} role={role} onMenu={onChildMenu} />
                ))}
              </>
            ) : (
              <p className="dsl-m12">No courses added yet</p>
            )}
            <div className="d-flex justify-content-end align-items-center">
              <Button
                className="mr-3"
                name="Save Draft"
                dataCy="library-training-track-saveDraft"
                onClick={this.handleSubmit.bind(this, 0)}
              />
              <Button
                name="Save & Publish"
                disabled={disabled}
                dataCy="library-training-track-savePublish"
                onClick={this.handleSubmit.bind(this, 1)}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Add.propTypes = {
  role: PropTypes.number,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  history: PropTypes.any,
  onModal: PropTypes.func,
  onUpdate: PropTypes.func,
  onChildMenu: PropTypes.func,
}

Add.defaultProps = {
  role: 1,
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: {},
  onModal: () => {},
  onUpdate: () => {},
  onChildMenu: () => {},
}

export default Add
