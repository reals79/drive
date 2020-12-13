import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { clone, concat, equals, filter, includes, is, isEmpty, isNil, length } from 'ramda'
import { Accordion, Button, Dropdown, EditDropdown, Filter, Icon, Input, Thumbnail, Toggle } from '@components'
import { LibraryCardEditMenu } from '~/services/config'
import Course from './Course'
import './LibraryTrackCard.scss'

class Edit extends Component {
  constructor(props) {
    super(props)
    const { data } = props
    this.state = {
      name: data.title || data.data.title,
      description: data.description || data.data.description,
      thumbnail: data.data.thumbnail || data.thumbnail,
      objectives: clone(data.data.objectives) || [],
      selected: {
        author: [data.author_id],
        department: data.data.department,
        competency: data.data.competency,
        category: data.data.category,
      },
      chronologicalLock: data.data.chronological_lock || false,
      timeLock: data.data.time_lock || false,
      courses: data.data._cards || [],
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAttachCourses = this.handleAttachCourses.bind(this)
    this.handleObjectiveAdd = this.handleObjectiveAdd.bind(this)
    this.handleObjectiveChange = this.handleObjectiveChange.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.handleObjectiveDelete = this.handleObjectiveDelete.bind(this)
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
    const { data } = this.props
    const { name, description, thumbnail, objectives, chronologicalLock, timeLock, selected, courses } = this.state
    const _objectives = filter(e => !isEmpty(e), objectives)

    const _courses =
      isNil(courses) || isEmpty(courses)
        ? []
        : courses.map(item => ({
            alert_manager: null,
            blocked_by: item.blocked_by,
            card_type: 'course',
            card_template_id: item.id,
            complete_track: null,
          }))

    const payload = {
      track: {
        id: data.id,
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
        created_at: data.created_at,
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

    const after = this.props.history.location.pathname.includes('view')
      ? {
          type: 'LIBRARYTRACKDETAIL_REQUEST',
          payload: { data: payload.track },
        }
      : {
          type: 'LIBRARYTEMPLATES_REQUEST',
          payload: { mode: 'tracks' },
        }

    this.props.onUpdate(payload, is(String, thumbnail) ? null : thumbnail, null, null, null, after)
  }

  handleSwitch(item, e) {
    if (equals(item, 'chronological')) {
      this.setState({ chronologicalLock: e })
    } else {
      this.setState({ timeLock: e })
    }
  }

  handleAttachCourses() {
    let { courses } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: { before: { show: ['courses'] }, after: {} },
      callBack: {
        onAttach: e => {
          courses = concat(courses, e.templates)
          this.setState({ courses })
        },
      },
    })
  }

  handleObjectiveChange(index, e) {
    const { objectives } = this.state
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
    const {
      data,
      authors,
      departments,
      competencies,
      categories,
      history,
      userRole,
      onCardMenu,
      onChildMenu,
    } = this.props
    const { name, description, thumbnail, objectives, chronologicalLock, timeLock, courses } = this.state

    return (
      <>
        <Filter
          dataCy="editTrackTopFilter"
          aligns={['left', 'right']}
          backTitle="all tracks"
          onBack={() => history.goBack()}
        />
        <div className="library-track-card border-5" data-cy="editTrackForm">
          <div className="detail-content">
            <div className="d-flex justify-content-between mb-3">
              <span className="dsl-b22 bold" data-cy="editTrackTitle">
                Edit Track
              </span>
              <EditDropdown
                options={LibraryCardEditMenu[userRole]}
                onChange={onCardMenu}
                dataCy="editTrackTopThreeDot"
              />
            </div>
            <Input
              className="track-input mb-3"
              title="Title"
              dataCy="title"
              value={name}
              placeholder="Type here..."
              direction="vertical"
              onChange={e => this.setState({ name: e })}
            />
            <div className="d-flex">
              <Thumbnail dataCy="thumbnail" type="upload" src={thumbnail} size="medium" onDrop={this.handleDrop} />
              <div className="pl-4 d-flex-1">
                <Input
                  className="track-text"
                  dataCy="description"
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
              <div className="d-flex" dataCy={`learningObjectiveInputSection${index}`}>
                <Input
                  className="track-input mb-2 d-flex-1"
                  key={`objectives${index}`}
                  dataCy={`learningObjectivesInput${index}`}
                  value={item}
                  placeholder="Type here..."
                  direction="vertical"
                  onChange={this.handleObjectiveChange.bind(this, index)}
                />
                <Button
                  className="ml-auto"
                  type="link"
                  dataCy={`trashBtn${index}`}
                  onClick={this.handleObjectiveDelete.bind(this, index)}
                >
                  <Icon name="far fa-trash-alt" size={14} color="#376caf" />
                </Button>
              </div>
            ))}
            <Button dataCy="addObjectiveBtn" className="ml-auto" type="link" onClick={this.handleObjectiveAdd}>
              <Icon name="far fa-plus" size={14} color="#376caf" />
              <span className="dsl-p14 text-400 ml-1">ADD OBJECTIVE</span>
            </Button>

            <Accordion className="settings">
              <Row className="mt-3">
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Author"
                    dataCy="author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    defaultIds={[data.author_id]}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="departments"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    defaultIds={data.data.department}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    dataCy="competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    defaultIds={data.data.competency}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    dataCy="categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    defaultIds={data.data.category}
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
                    dataCy="cronologicalLock"
                    title="Chronology Lock"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSwitch.bind(this, 'chronological')}
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Toggle
                    checked={timeLock}
                    dataCy="timeLock"
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

        <div className="library-track-card mt-2 border-5" data-cy="includedCourse">
          <div className="modules-content" dataCy="courseLists">
            <p className="dsl-b22 bold">Courses Included</p>
            <Button dataCy="addCourseBtn" className="ml-auto" type="link" onClick={this.handleAttachCourses}>
              <Icon name="far fa-plus" size={14} color="#376caf" />
              <span className="dsl-p14 text-400 ml-1">ADD COURSE</span>
            </Button>
            {length(courses) > 0 ? (
              courses.map((item, index) => (
                <Course dataCy={`courseItem${index}`} key={index} course={item} role={userRole} onMenu={onChildMenu} />
              ))
            ) : (
              <p className="dsl-m12" data-cy="noCourseAddedYet">
                No courses added yet
              </p>
            )}
            <div className="d-flex justify-content-end align-items-center">
              <Button
                className="mr-3"
                name="Save Draft"
                dataCy="saveDraftBtn"
                onClick={this.handleSubmit.bind(this, 0)}
              />
              <Button dataCy="savePublishBtn" name="Save & Publish" onClick={this.handleSubmit.bind(this, 1)} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.any,
  userRole: PropTypes.number,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  courses: PropTypes.array,
  onModal: PropTypes.func,
  onUpdate: PropTypes.func,
  onClose: PropTypes.func,
  onCardMenu: PropTypes.func,
}

Edit.defaultProps = {
  data: {},
  userRole: 1,
  departments: [],
  competencies: [],
  categories: [],
  courses: [],
  onModal: () => {},
  onUpdate: () => {},
  onClose: () => {},
  onCardMenu: () => {},
}

export default Edit
