import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import {
  clone,
  equals,
  filter,
  isEmpty,
  isNil,
  findIndex,
  remove,
  move,
  propEq,
  slice,
} from 'ramda'
import {
  Accordion,
  Button,
  Dropdown,
  EditDropdown,
  Filter,
  Icon,
  Input,
  Thumbnail,
  Toggle,
  Pagination,
} from '@components'
import { length } from '~/services/util'
import { LibraryCardEditMenu } from '~/services/config'
import Module from './Module'
import './LibraryCourseCard.scss'

const ADDMODULES = [
  { id: 0, value: 'Add Existing', name: 'old' },
  { id: 1, value: 'Create New', name: 'new' },
]

class Edit extends Component {
  constructor(props) {
    super(props)

    const { data } = props
    this.state = {
      name: data.name || data.data.name,
      description: data.description || data.data.description,
      thumbnail: null,
      children: data.children || [],
      objectives: clone(data.data.objectives) || [],
      selected: {
        author: [data.author_id],
        department: data.data.department,
        competency: data.data.competency,
        category: data.data.category,
      },
      chronologicalLock: data.data.chronological_lock || false,
      timeLock: data.data.time_lock || false,
      currentPage: 1,
      perPage: 25,
    }

    this.handleToggleModal = this.handleToggleModal.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleObjectiveChange = this.handleObjectiveChange.bind(this)
    this.handleObjectiveAdd = this.handleObjectiveAdd.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChildMenu = this.handleChildMenu.bind(this)
    this.handleObjectiveDelete = this.handleObjectiveDelete.bind(this)
    this.handlePage = this.handlePage.bind(this)
    this.handlePer = this.handlePer.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const data = nextProps.data
    const children = data.children || []
    if (!equals(children, prevState.children)) {
      return { children: prevState.children }
    }

    const objectives = clone(data.data.objectives) || []
    if (!equals(objectives, prevState.objectives)) {
      return { objectives: prevState.objectives }
    }
    return null
  }

  handleDrop(e) {
    this.setState({ thumbnail: e })
  }

  handleObjectiveChange(index, e) {
    let { objectives } = this.state
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

  handleSelectTags(key, tags) {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleSubmit(published) {
    const { data, history } = this.props
    const {
      name,
      description,
      thumbnail,
      objectives,
      selected,
      chronologicalLock,
      timeLock,
      children,
    } = this.state
    const _objectives = filter(e => !isEmpty(e), objectives)

    const modules = children.map((item, key) => ({
      blocked_by: equals(key, 0) ? null : children[key - 1].card_template_id,
      card_template_id: item.id,
      card_type_id: item.card_type_id,
      delay_days: item.data.delay_days,
    }))

    const payload = {
      template: {
        id: data.id,
        name,
        access_type: 1,
        author_id: selected.author[0],
        card_type_id: 1,
        created_at: data.created_at,
        updated_at: new Date().toISOString(),
        children,
        published,
        data: {
          ...data.data,
          description,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          objectives: _objectives,
          modules,
          chronological_lock: chronologicalLock,
          time_lock: timeLock,
        },
      },
    }
    const filters = history.location.state ? history.location.state.filter : ''
    const page = history.location.state ? history.location.state.page : 1
    const after = {
      type: 'LIBRARYTEMPLATES_REQUEST',
      payload: { current: page, filter: filters, mode: 'courses', per: 25 },
    }
    this.props.onUpdate(payload, thumbnail, null, null, null, after)
  }

  handleSwitch(item, e) {
    if (equals(item, 'chronological')) {
      this.setState({ chronologicalLock: e })
    } else {
      this.setState({ timeLock: e })
    }
  }

  handleChildMenu(event, item) {
    const { children } = this.state
    const index = findIndex(propEq('id', item.id), children)
    if (index > -1) {
      let newChildren = clone(children)
      if (equals(event, 'move up')) {
        if (equals(index, 0)) return
        newChildren = move(index + 1, index - 1, newChildren)
      } else if (equals(event, 'move down')) {
        if (equals(index + 1, length(newChildren))) return
        newChildren = move(index, index + 1, newChildren)
      } else if (equals(event, 'remove')) {
        newChildren = remove(index, 1, newChildren)
      } else {
        this.props.onChildMenu(event, item)
      }
      this.setState({ children: newChildren })
    }
  }

  handleToggleModal(e) {
    const { onModal } = this.props
    const { children } = this.state
    if (equals(e[0].name, 'old')) {
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

  handlePage(page) {
    this.setState({ currentPage: page })
  }

  handlePer(per) {
    this.setState({ perPage: per })
  }

  render() {
    const {
      data,
      userRole,
      authors,
      departments,
      competencies,
      categories,
      history,
      onCardMenu,
    } = this.props
    const {
      name,
      description,
      children,
      objectives,
      timeLock,
      chronologicalLock,
      currentPage,
      perPage,
    } = this.state
    const isDisabled = isEmpty(name) || isNil(description) || isNil(children) || isEmpty(children)
    const from = (currentPage - 1) * perPage
    const to = currentPage * perPage
    const totalPage = Math.ceil(children.length / perPage)
    const selected = slice(from, to, children)

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all courses"
          onBack={() => history.goBack()}
          dataCy="editCourseTopFilter"
        />
        <div className="library-course-card border-5" data-cy="editCourseForm">
          <div className="detail-content">
            <div className="d-flex justify-content-between mb-3">
              <span className="dsl-b22 bold" data-cy="editTitle">
                Edit Course
              </span>
              <EditDropdown
                options={LibraryCardEditMenu[userRole]}
                onChange={onCardMenu}
                dataCy="editCourseTopThreeDot"
              />
            </div>
            <Input
              className="course-input mb-3"
              title="Title"
              dataCy="title"
              value={name}
              placeholder="Type here..."
              direction="vertical"
              onChange={e => this.setState({ name: e })}
            />

            <div className="d-flex">
              <Thumbnail
                type="upload"
                dataCy="thumbnail"
                src={data.data.thumb_url}
                size="medium"
                onDrop={this.handleDrop}
              />
              <div className="pl-4 d-flex-1">
                <Input
                  className="course-text"
                  title="Course description"
                  dataCy="description"
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
              <div key={`objectives${index}`} data-cy={`objectives${index}`} className="d-flex">
                <Input
                  className="course-input mb-2 d-flex-1"
                  dataCy={`learningObjectiveInput${index}`}
                  value={objectives[index]}
                  placeholder="Type here..."
                  direction="vertical"
                  onChange={this.handleObjectiveChange.bind(this, index)}
                />
                <Button
                  className="ml-auto"
                  dataCy="trashBtn"
                  type="link"
                  onClick={this.handleObjectiveDelete.bind(this, index)}
                >
                  <Icon name="far fa-trash-alt" size={14} color="#376caf" />
                </Button>
              </div>
            ))}

            <Button
              dataCy="addObjectiveBtn"
              className="ml-auto"
              type="link"
              onClick={this.handleObjectiveAdd}
            >
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
                    getValue={e => e.name}
                    defaultIds={[data.author_id]}
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
                    getValue={e => e.name}
                    defaultIds={data.data.department}
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
                    getValue={e => e.name}
                    defaultIds={data.data.competency}
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
                    getValue={e => e.name}
                    defaultIds={data.data.category}
                    onChange={this.handleSelectTags.bind(this, 'category')}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6} md={6}>
                  <p className="dsl-m12">Est days to complete</p>
                  <p className="dsl-b16 ml-2">{data.data.estimated_completion}</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col sm={6} md={6}>
                  <Toggle
                    checked={chronologicalLock}
                    dataCy="chronologyLock"
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

        <div className="library-course-card mt-2 border-5">
          <div className="modules-content" data-cy="moduleContent">
            <div className="d-flex">
              <p className="dsl-b22 bold">Modules Included</p>
              <Button className="ml-auto" type="link">
                <Icon name="far fa-plus" size={14} color="#376caf" />
                <Dropdown
                  align="right"
                  dataCy="addModuleBtn"
                  className="pl-1"
                  width="fit-content"
                  caret="none"
                  returnBy="data"
                  placeholder="ADD MODULE"
                  selectable={false}
                  data={ADDMODULES}
                  onChange={this.handleToggleModal.bind(this)}
                />
              </Button>
            </div>
            {length(children) > 0 ? (
              <>
                {selected.map((item, index) => (
                  <Module
                    dataCy={`moduleList${index}`}
                    key={index}
                    data={item}
                    role={userRole}
                    onMenu={this.handleChildMenu.bind(this)}
                  />
                ))}
              </>
            ) : (
              <p className="dsl-m12" data-cy="noModuleAddedText">
                No modules added yet
              </p>
            )}
            <div className="d-flex justify-content-end align-items-center">
              <Button
                className="mr-3"
                name="Save Draft"
                dataCy="saveDraftBtn"
                disabled={isDisabled}
                onClick={this.handleSubmit.bind(this, 0)}
              />
              <Button
                name="Save & Publish"
                dataCy="savePublishBtn"
                disabled={isDisabled}
                onClick={this.handleSubmit.bind(this, 1)}
              />
            </div>
          </div>
        </div>
        <Pagination
          pers={[25, 50, 'all']}
          current={currentPage}
          per={perPage}
          total={totalPage}
          onChange={this.handlePage}
          onPer={this.handlePer}
          dataCy="editCoursePagination"
        />
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
  modalData: PropTypes.any,
  onModal: PropTypes.func,
  onUpdate: PropTypes.func,
  onCardMenu: PropTypes.func,
}

Edit.defaultProps = {
  data: {},
  userRole: 1,
  departments: [],
  competencies: [],
  categories: [],
  modalData: {},
  onModal: () => {},
  onUpdate: () => {},
  onCardMenu: () => {},
}

export default Edit
