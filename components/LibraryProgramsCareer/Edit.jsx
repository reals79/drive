import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { clone, concat, dropLast, find, isEmpty, isNil, keys, length, omit, propEq, type, values } from 'ramda'
import {
  Accordion,
  Button,
  CareerRequiredInstances as Instances,
  Dropdown,
  EditDropdown,
  Input,
  Icon,
  Toggle,
} from '@components'
import { LibraryProgramDetailMenu } from '~/services/config'
import CustomArrow from './CustomArrow'
import './LibraryProgramsCareer.scss'

class Edit extends Component {
  state = {
    authors: this.props.tags.authors,
    departments: this.props.tags.departments,
    competencies: this.props.tags.competencies,
    categories: this.props.tags.categories,
    job: find(propEq('id', this.props.program.job_role_id), this.props.jobs) || {},
    program: this.props.program,
    isLevel: false,
    levelData: [],
    canPublish: true,
    level: keys(this.props.program.data.levels).length,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { program } = prevState
    const isLevel = !isNil(program.data.levels) && !isEmpty(program.data.levels)
    const levelData = isLevel ? values(program.data.levels) : []

    let newLevelData = clone(levelData)
    let canPublish = true
    let card = nextProps.history.location.state ? clone(nextProps.history.location.state.card) : {}
    newLevelData.forEach((item, index) => {
      const duplicate = item.quotas.some(item => item.id === card.id)
      if (nextProps.history.location.state && nextProps.history.location.state.level === index + 1 && !duplicate) {
        item.quotas.push(card)
      }
      item.quotas.forEach(quota => {
        if (0 === quota.quota_target || isNil(quota.quota_calculation)) {
          canPublish = false
        }
      })
    })
    return { isLevel, levelData: newLevelData, canPublish }
  }

  handleTitle = e => {
    const { program } = this.state
    this.setState({ program: { ...program, title: e } })
  }

  handleDescription = e => {
    const { program } = this.state
    this.setState({
      program: { ...program, data: { ...program.data, description: e } },
    })
  }

  handleSelectTags = key => tag => {
    const { program } = this.state
    switch (key) {
      case 'author':
        this.setState({ program: { ...program, author_id: tag[0] } })
        break
      case 'department':
        this.setState({ program: { ...program, data: { ...program.data, department_id: tag } } })
        break
      case 'competency':
        this.setState({ program: { ...program, data: { ...program.data, competency_id: tag } } })
        break
      case 'category':
        this.setState({ program: { ...program, data: { ...program.data, category_id: tag } } })
        break
      case 'role':
        this.setState({ program: { ...program, job_role_id: tag[0].id } })
        break
      default:
        break
    }
  }

  handleChangeLevel = (key, ind) => e => {
    const { isLevel, program } = this.state
    if (!isLevel) return
    let _levels = clone(program.data.levels)
    if (key == 'trainings') {
      _levels[ind][key] = { ..._levels[ind][key], items: e }
    } else {
      _levels[ind][key] = e
    }
    const _program = { ...program, data: { ...program.data, levels: _levels } }
    this.setState({ program: _program })
  }

  handleAddModule = (type, ind) => () => {
    const { program } = this.state
    let _levels = clone(program.data.levels)
    let after = []
    if (type === 'quotas') {
      after = _levels[ind][type]
    } else if (type === 'habits') {
      after = concat(concat(_levels[ind][type].day, _levels[ind][type].week), _levels[ind][type].month)
    } else if (type === 'tracks' || type === 'courses') {
      after = _levels[ind]['trainings'].items
    }

    this.props.onModal({
      type: 'Attach Library',
      data: { before: { modules: [], show: [type], selected: [] }, after },
      callBack: {
        onAttach: e => {
          if (type === 'quotas') {
            _levels[ind]['quotas'] = concat(_levels[ind]['quotas'], e.templates)
          } else if (type === 'habits') {
            let day = [],
              week = [],
              month = []
            e.templates.map(item => {
              if (item.data.schedule_interval === 'day') day.push(item)
              else if (item.data.schedule_interval === 'week') week.push(item)
              else month.push(item)
            })
            _levels[ind]['habits'].day = concat(_levels[ind]['habits'].day, day)
            _levels[ind]['habits'].week = concat(_levels[ind]['habits'].week, week)
            _levels[ind]['habits'].month = concat(_levels[ind]['habits'].month, month)
          } else if (type === 'tracks' || type === 'courses') {
            let templates = clone(e.templates)
            templates = templates.map(item => {
              item.type = dropLast(1, type)
              return item
            })
            _levels[ind]['trainings'].items = concat(_levels[ind]['trainings'].items, templates)
          }
          const _program = { ...program, data: { ...program.data, levels: _levels } }
          this.setState({ program: _program })
        },
      },
    })
  }

  handleSelectModule = ind => e => {
    const type = e[0].name
    const { program } = this.state
    let _levels = clone(program.data.levels)
    let after = _levels[ind]['trainings'].items

    this.props.onModal({
      type: 'Attach Library',
      data: { before: { modules: [], show: [type], selected: [] }, after },
      callBack: {
        onAttach: e => {
          let templates = clone(e.templates)
          templates = templates.map(item => {
            item.type = dropLast(1, type)
            return item
          })
          _levels[ind]['trainings'].items = concat(_levels[ind]['trainings'].items, templates)
          const _program = { ...program, data: { ...program.data, levels: _levels } }
          this.setState({ program: _program })
        },
      },
    })
  }

  handleLevelDelete = index => () => {
    let { program, level } = this.state
    let _levels = clone(program.data.levels)
    _levels = omit([index], _levels)
    _levels = values(_levels)
    level = _levels.length
    let levels = {}
    for (let i = 0; i < level; i++) {
      levels[i + 1] = { ..._levels[i] }
    }
    const _program = { ...program, data: { ...program.data, levels } }
    this.setState({ program: _program, level })
  }

  handleAddLevel = () => {
    let { program, level } = this.state
    let _levels = clone(program.data.levels)
    _levels[level + 1] = {
      title: '',
      chronology_lock: false,
      time_lock: false,
      habits: { day: [], week: [], month: [] },
      quotas: [],
      trainings: { items: [] },
    }
    const _program = { ...program, data: { ...program.data, levels: _levels } }
    level = values(_levels).length
    this.setState({ program: _program, level })
  }

  handleSubmit = published => () => {
    const { isLevel, program } = this.state
    const _levels = isLevel ? clone(program.data.levels) : null
    let levels = {}

    if (!isNil(_levels)) {
      keys(_levels).map(key => {
        const day = _levels[key].habits.day.map(item => item.id)
        const week = _levels[key].habits.week.map(item => item.id)
        const month = _levels[key].habits.month.map(item => item.id)
        const habits = { day, week, month }
        const quotas = _levels[key].quotas.map(item => {
          return {
            quota_template_id: item.id,
            quota_target: item.quota_target || 0,
            quota_calculation: item.quota_calculation || 0,
            span_months: item.span_months || 0,
            minimum_months: item.minimum_months || 0,
          }
        })
        const trainings = _levels[key].trainings.items.map(item => ({
          type: item.type,
          item_id: item.id,
        }))
        levels[key] = {
          ..._levels[key],
          habits,
          quotas,
          trainings: { ..._levels[key].trainings, items: trainings },
        }
      })
    }
    const _program = { ...program, published, data: { ...program.data, levels } }
    const payload = { type: 'careers', data: { program: _program } }
    this.props.onSave(payload)
  }

  render() {
    const { canPublish, levelData, authors, departments, competencies, categories, program, level } = this.state
    const { userRole, onSelect, jobs, quotaOptions } = this.props
    const trainingTypes = [
      { id: 0, value: 'Add Course', name: 'courses' },
      { id: 1, value: 'Add Track', name: 'tracks' },
    ]
    const levelOptions = [...Array(level)].map((e, index) => ({
      id: index + 1,
      value: `Level ${index + 1}`,
    }))

    return (
      <div className="lib-programs-career">
        <div className="settings-contents">
          <div className="d-flex justify-content-between pt-2 pb-4">
            <span className="dsl-b22 bold">{program.title}</span>
            <EditDropdown options={LibraryProgramDetailMenu[userRole]} onChange={onSelect} />
          </div>
          <Input
            className="input-field"
            title="Title"
            value={program.title}
            direction="vertical"
            placeholder="Title your career program..."
            onChange={this.handleTitle}
          />
          <Input
            className="input-field"
            as="textarea"
            rows="3"
            title="Description"
            value={program.data.description}
            direction="vertical"
            placeholder="Summarize your career program..."
            onChange={this.handleDescription}
          />
          <Accordion className="settings-career">
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Levels"
                  direction="vertical"
                  className="tag-dropdown"
                  width="fit-content"
                  defaultIds={[program.level]}
                  data={levelOptions}
                  getValue={e => e.value}
                  onChange={e => this.slider.slickGoTo(e[0] - 1)}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Role"
                  direction="vertical"
                  className="tag-dropdown"
                  width="fit-content"
                  defaultIds={[program.job_role_id]}
                  data={jobs}
                  returnBy="data"
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('role')}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Author"
                  direction="vertical"
                  className="tag-dropdown"
                  width="fit-content"
                  defaultIds={[program.author_id]}
                  data={authors}
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('author')}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Department (multiple select)"
                  direction="vertical"
                  className="tag-dropdown"
                  width="fit-content"
                  defaultIds={program.data.department_id}
                  data={departments}
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('department')}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Competencies (multiple select)"
                  direction="vertical"
                  className="tag-dropdown"
                  width="fit-content"
                  defaultIds={program.data.competency_id}
                  data={competencies}
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('competency')}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Categories (multiple select)"
                  direction="vertical"
                  className="tag-dropdown"
                  width="fit-content"
                  defaultIds={program.data.category_id}
                  data={categories}
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('category')}
                />
              </Col>
            </Row>
            <Button className="float-right" name="ADD LEVELS" type="medium" onClick={this.handleAddLevel} />
          </Accordion>
        </div>
        <div className="modules-contents mt-3">
          <Slider
            infinite
            adaptiveHeight
            prevArrow={<CustomArrow name="left" />}
            nextArrow={<CustomArrow name="right" />}
            ref={slider => (this.slider = slider)}
          >
            {levelData.map((e, index) => {
              const { chronology_lock, time_lock, habits, quotas, trainings, documents, title } = e
              const habitsLength =
                type(habits) === 'Object'
                  ? length(habits.day) + length(habits.week) + length(habits.month)
                  : length(habits)

              return (
                <div key={`level-${index}`}>
                  <p className="dsl-b22 bold">{`Level ${index + 1}`}</p>
                  <Button className="float-right" type="link" onClick={this.handleLevelDelete(index + 1)}>
                    <Icon name="far fa-trash-alt" size={14} color="#376caf" />
                  </Button>
                  <Row className="mx-0">
                    <Col xs={6} className="px-0 mb-3">
                      <Input
                        className="input-field"
                        title="Job Title"
                        value={title}
                        direction="vertical"
                        placeholder="Type the level title here..."
                        onChange={this.handleChangeLevel('title', index + 1)}
                      />
                    </Col>
                  </Row>
                  <Row className="mx-0">
                    <Col xs={6} className="px-0">
                      <p className="dsl-m12 mb-2">Estimated Time to Complete</p>
                      <p className="dsl-l16 normal mx-2">This will autofill automatically</p>
                    </Col>
                  </Row>
                  <Accordion className="settings-career">
                    <Row className="mx-0">
                      <Col xs={12} sm={12} md={4} className="px-0 my-3">
                        <p className="dsl-m12 mb-2">Estimated Time to Complete</p>
                        <p className="dsl-b16">Default from courses</p>
                        <p className="dsl-b16">Target for track</p>
                      </Col>
                      <Col xs={12} sm={6} md={4} className="px-0 my-3">
                        <Toggle
                          title="Chronology Lock"
                          leftLabel="Off"
                          rightLabel="On"
                          checked={chronology_lock || false}
                          onChange={this.handleChangeLevel('chronology_lock', index + 1)}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={4} className="px-0 my-3">
                        <Toggle
                          title="Time Lock"
                          leftLabel="Off"
                          rightLabel="On"
                          checked={time_lock || false}
                          onChange={this.handleChangeLevel('time_lock', index + 1)}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <div className="required-field pt-4 border-top">
                    <p className="dsl-b18 text-500">Required Quotas</p>
                    {length(quotas) > 0 ? (
                      <Instances.QuotasEdit
                        data={quotas}
                        type="instance"
                        options={quotaOptions}
                        onChange={this.handleChangeLevel('quotas', index + 1)}
                      />
                    ) : (
                      <Instances.Empty />
                    )}
                    <div className="d-flex justify-content-end py-4">
                      <Button name="+ ATTACH QUOTA" type="low" onClick={this.handleAddModule('quotas', index + 1)} />
                    </div>
                  </div>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Habits</p>
                    {habitsLength > 0 ? (
                      <Instances.HabitsEdit
                        data={habits}
                        type="instance"
                        onChange={this.handleChangeLevel('habits', index + 1)}
                      />
                    ) : (
                      <Instances.Empty />
                    )}
                    <div className="d-flex justify-content-end py-4">
                      <Button name="+ ATTACH HABIT" type="low" onClick={this.handleAddModule('habits', index + 1)} />
                    </div>
                  </div>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Training</p>
                    {length(trainings.items) > 0 ? (
                      <Instances.TrainingsEdit
                        data={trainings.items}
                        type="instance"
                        onChange={this.handleChangeLevel('trainings', index + 1)}
                      />
                    ) : (
                      <Instances.Empty />
                    )}
                    <div className="d-flex justify-content-end pt-4 pb-5 mb-4">
                      <Dropdown
                        align="right"
                        width="fit-content"
                        caret="none"
                        returnBy="data"
                        placeholder="+ ATTACH TRAINING"
                        className="add-training-dropdown"
                        selectable={false}
                        data={trainingTypes}
                        onChange={this.handleSelectModule(index + 1)}
                      />
                    </div>
                  </div>
                  <div className="d-flex float-right">
                    <Button
                      name="Save Draft"
                      className="btn-save mr-3"
                      disabled={this.props.program === program && !!!program.published}
                      onClick={this.handleSubmit(0)}
                    />
                    <Button
                      name="Save & Publish"
                      className="btn-save"
                      disabled={(this.props.program === program || !canPublish) && !!program.published}
                      onClick={this.handleSubmit(1)}
                    />
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
  jobs: PropTypes.array,
  userRole: PropTypes.number,
  tags: PropTypes.shape({
    authors: PropTypes.array,
    departments: PropTypes.array,
    competencies: PropTypes.array,
    categories: PropTypes.array,
  }),
  program: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    data: PropTypes.any,
  }),
  onModal: PropTypes.func,
  onSave: PropTypes.func,
  onSelect: PropTypes.func,
}

Edit.defaultProps = {
  jobs: [],
  userRole: 1,
  tags: { authors: [], departments: [], competencies: [], categories: [] },
  program: { id: 0, title: '', data: {} },
  onModal: () => {},
  onSave: () => {},
  onSelect: () => {},
}

export default Edit
