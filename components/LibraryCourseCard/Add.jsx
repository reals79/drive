import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { clone, equals, is, isEmpty, isNil, findIndex, propEq, move, remove } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Icon, Input, Thumbnail, Toggle } from '@components'
import { length } from '~/services/util'
import Module from './Module'
import './LibraryCourseCard.scss'

const ADDMODULES = [
  { id: 0, value: 'Add Existing', name: 'old' },
  { id: 1, value: 'Create New', name: 'new' },
]

class Add extends Component {
  state = {
    name: null,
    description: null,
    thumbnail: null,
    submitted: false,
    children: [],
    objectives: ['', ''],
    selected: {
      author: [],
      department: [],
      competency: [],
      category: [],
    },
    chronologicalLock: false,
    timeLock: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { modalData } = nextProps
    if (modalData.after) {
      const { modules } = modalData.after
      if (modules) {
        const { children } = prevState
        if (!equals(modules, children)) {
          return { children: modules }
        }
      }
    }
    return null
  }

  handleObjectiveChange = index => e => {
    const objectives = clone(this.state.objectives)
    objectives[index] = e
    this.setState({ objectives })
  }

  handleObjectiveAdd = () => {
    const objectives = clone(this.state.objectives)
    objectives.push('')
    this.setState({ objectives })
  }

  handleObjectiveDelete = index => () => {
    const objectives = clone(this.state.objectives)
    objectives.splice(index, 1)
    this.setState({ objectives })
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit = published => () => {
    const { name, description, thumbnail, objectives, selected, chronologicalLock, timeLock, children } = this.state

    if (isEmpty(name) || isNil(description) || isNil(children) || isEmpty(children) || isEmpty(selected.author)) return

    this.setState({ submitted: true }, () => {
      const modules = children.map(item => ({
        blocked_by: item.blocked_by,
        card_template_id: item.id,
        card_type_id: item.card_type_id,
        delay_days: item.data.delay_days,
      }))
      const payload = {
        template: {
          card_type_id: 1,
          name,
          author_id: selected.author[0],
          access_type: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published,
          data: {
            description,
            category: selected.category,
            competency: selected.competency,
            department: selected.department,
            objectives,
            thumb_url: is(String, thumbnail) ? thumbnail : '',
            attachment_hash: '',
            attachments: [],
            estimated_completion: '',
            action_approval: 'self',
            require_attachments: '',
            assessment_id: null,
            presentation_url: '',
            link: '',
            study_content: '',
            video_url: '',
            embed_url: '',
            modules,
            chronological_lock: chronologicalLock,
            time_lock: timeLock,
          },
        },
      }
      this.props.onUpdate(payload, thumbnail, null, null, null)
    })
  }

  handleSwitch = item => e => {
    if (item === 'chronological') {
      this.setState({ chronologicalLock: e })
    } else {
      this.setState({ timeLock: e })
    }
  }

  handleToggleModal = e => {
    const { onModal } = this.props
    const { children } = this.state
    if (e[0].name === 'old') {
      onModal({
        type: 'Attach Library',
        data: {
          before: { modules: [], show: ['modules'], selected: children },
          after: null,
        },
        callBack: { onAttach: e => this.setState({ children: e.templates }) },
      })
    } else {
      onModal({
        type: 'Add New Module',
        data: { before: null, after: { modules: children } },
        callBack: null,
      })
    }
  }

  handleChildMenu = (event, item) => {
    const { children } = this.state
    const index = findIndex(propEq('id', item.id), children)
    if (index > -1) {
      let newChildren = clone(children)
      if (event === 'move up') {
        if (equals(index, 0)) return
        newChildren = move(index + 1, index - 1, newChildren)
      } else if (event === 'move down') {
        if (equals(index + 1, length(newChildren))) return
        newChildren = move(index, index + 1, newChildren)
      } else if (event === 'remove') {
        newChildren = remove(index, 1, newChildren)
      }
      this.setState({ children: newChildren })
    }
  }

  render() {
    const { role, authors, departments, competencies, categories, history, onChildMenu } = this.props
    const { name, description, children, thumbnail, objectives, selected, timeLock, chronologicalLock } = this.state
    const isDisabled =
      isEmpty(name) || isNil(description) || isNil(children) || isEmpty(children) || isEmpty(selected.author)

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all courses"
          dataCy="library-training-courseFilterSection"
          onBack={() => history.goBack()}
        />
        <div className="library-course-card border-5" data-cy="library-training-addCourse">
          <div className="detail-content">
            <div className="d-flex justify-content-between mb-3">
              <span className="dsl-b22 bold">Add Course</span>
            </div>
            <Input
              className="course-input mb-3"
              dataCy="library-training-course-title"
              title="Title"
              value={name}
              placeholder="Type here..."
              direction="vertical"
              onChange={e => this.setState({ name: e })}
            />

            <div className="d-flex">
              <Thumbnail
                type="upload"
                dataCy="library-training-course-thumbnail"
                size="medium"
                src={thumbnail}
                onDrop={e => this.setState({ thumbnail: e })}
              />
              <div className="pl-4 d-flex-1">
                <Input
                  className="course-text"
                  dataCy="library-training-course-description"
                  title="Course description"
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
              <div className="d-flex" key={`objective-${index}`}>
                <Input
                  className="module-input mb-2 d-flex-1"
                  dataCy={`library-training-course-learningObjectiveContent${index}`}
                  key={`objectives${index}`}
                  value={item}
                  placeholder="Type here..."
                  direction="vertical"
                  onChange={this.handleObjectiveChange(index)}
                />
                <Button
                  className="ml-auto"
                  dataCy={`library-training-course-learningObjectiveTrashBtn${index}`}
                  type="link"
                  onClick={this.handleObjectiveDelete(index)}
                >
                  <Icon name="far fa-trash-alt" size={14} color="#376caf" />
                </Button>
              </div>
            ))}

            <Button
              className="ml-auto"
              dataCy="library-training-course-learningObjectiveAddBtn"
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
                    dataCy="library-training-course-author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    dataCy="library-training-course-department"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    dataCy="library-training-course-competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    dataCy="library-training-course-categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6} md={6}>
                  <p className="dsl-m12">Est days to complete</p>
                  <p className="dsl-b16 ml-2">N/A</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6} md={6}>
                  <Toggle
                    checked={chronologicalLock}
                    dataCy="library-training-course-chronologicalLock"
                    title="Chronology Lock"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSwitch('chronological')}
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Toggle
                    checked={timeLock}
                    title="Time Lock"
                    dataCy="library-training-course-timeLock"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSwitch('time')}
                  />
                </Col>
              </Row>
            </Accordion>
          </div>
        </div>

        <div className="library-course-card mt-2 border-5">
          <div className="modules-content">
            <div className="d-flex">
              <p className="dsl-b22 bold">Modules Included</p>
              <Button className="ml-auto" type="link">
                <Icon name="far fa-plus" size={14} color="#376caf" />
                <Dropdown
                  align="right"
                  className="pl-1"
                  dataCy="library-training-course-moduleIncludedBtn"
                  width="fit-content"
                  caret="none"
                  returnBy="data"
                  placeholder="ADD MODULE"
                  selectable={false}
                  data={ADDMODULES}
                  onChange={this.handleToggleModal}
                />
              </Button>
            </div>
            {length(children) > 0 ? (
              children.map((item, index) => (
                <Module key={index} data={item} role={role} onMenu={this.handleChildMenu} />
              ))
            ) : (
              <p className="dsl-m12">No modules added yet</p>
            )}
            <div className="d-flex justify-content-end align-items-center">
              <Button
                className="mr-3"
                dataCy="library-training-course-saveDraft"
                name="Save Draft"
                onClick={this.handleSubmit(0)}
              />
              <Button
                name="Save & Publish"
                disabled={isDisabled}
                dataCy="library-training-course-savePublish"
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
  role: PropTypes.number,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  history: PropTypes.any,
  modalData: PropTypes.any,
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
  modalData: {},
  history: {},
  onModal: () => {},
  onUpdate: () => {},
  onChildMenu: () => {},
}

export default Add
