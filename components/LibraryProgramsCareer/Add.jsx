import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { any, concat, clone, equals, filter, isEmpty, isNil, length } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Input, LibraryProgramsList as ProgramsList, Toggle } from '@components'
import { LibraryLevels } from '~/services/config'
import CustomArrow from './CustomArrow'
import './LibraryProgramsCareer.scss'

class Add extends Component {
  constructor(props) {
    super(props)

    const { authors, departments, competencies, categories } = props.tags
    const { company } = props

    this.state = {
      title: '',
      description: '',
      level: null,
      expiration: 0,
      author_id: null,
      department_id: [],
      competency_id: [],
      category_id: [],
      role: {},
      programLevels: [],
      jobs: props.jobs,
      quotaOptions: props.quotaOptions,
      authors,
      departments,
      competencies,
      categories,
      company,
      quotaData: false,
      habitData: false,
      levelInd: 0,
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.handleSelectLevels = this.handleSelectLevels.bind(this)
    this.handleChangeLevel = this.handleChangeLevel.bind(this)
    this.handleAddModule = this.handleAddModule.bind(this)
    this.handleSelectModule = this.handleSelectModule.bind(this)
    this.handleChangeModules = this.handleChangeModules.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleNewModule = this.handleNewModule.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { modalData } = nextProps
    const { programLevels, levelInd } = prevState
    const modules = clone(programLevels)
    if (modalData.after) {
      const { quotas, habits } = modalData.after
      if (quotas) {
        if (!equals(quotas, modules[levelInd]['quotas'])) {
          modules[levelInd]['quotas'] = concat(modules[levelInd]['quotas'], quotas)
          return { programLevels: modules, quotaData: true }
        }
      }
      if (habits) {
        if (!equals(habits, modules[levelInd]['habits'])) {
          modules[levelInd]['habits'] = concat(modules[levelInd]['habits'], habits)
          return { programLevels: modules, habitData: true }
        }
      }
    }
    return null
  }

  componentDidUpdate(prevState) {
    const { quotaData, habitData, levelInd } = this.state
    if (quotaData && !prevState.quotaData) {
      this.handleAddModule('quotas', levelInd)
      this.setState({ quotaData: false })
    }
    if (habitData && !prevState.habitData) {
      this.handleAddModule('habits', levelInd)
      this.setState({ habitData: false })
    }
  }

  handleFilter(type, e) {
    let company = this.state.company

    if (isNil(e)) return
    if ('company' === type) {
      company = e[0]
    } else if ('employee' === type) {
    }

    if (company.id < 0) return

    this.setState({ company })
  }

  handleSelectTags(key, tag) {
    switch (key) {
      case 'author':
        this.setState({ author_id: tag[0] })
        break
      case 'department':
        this.setState({ department_id: tag })
        break
      case 'competency':
        this.setState({ competency_id: tag })
        break
      case 'category':
        this.setState({ category_id: tag })
        break
      case 'role':
        this.setState({ role: tag[0] })
      default:
        break
    }
  }

  handleSelectLevels(e) {
    const level = e[0]
    let programLevels = []
    for (let i = 0; i < level; i++) {
      programLevels[i] = {
        title: '',
        chronology_lock: false,
        time_lock: false,
        habits: [],
        quotas: [],
        courses: [],
        tracks: [],
        pdf: [],
        word: [],
        powerpoint: [],
      }
    }
    this.setState({ level, programLevels })
  }

  handleChangeLevel(key, ind, e) {
    const programLevels = clone(this.state.programLevels)
    programLevels[ind][key] = e
    this.setState({ programLevels })
  }

  handleSelectModule(ind, e) {
    this.handleAddModule(e[0].name, ind)
  }

  handleNewModule(type, ind) {
    const { programLevels } = this.state
    let payload = {}
    if (type === 'quotas') {
      const modules = clone(programLevels)
      const quotas = modules[ind][type]
      payload = {
        type: 'Add New Quota',
        data: { before: null, after: { quotas } },
      }
    }
    if (type === 'habits') {
      const modules = clone(programLevels)
      const habits = modules[ind][type]
      payload = {
        type: 'Add New Habit',
        data: { before: null, after: { habits } },
      }
    }
    this.setState({ levelInd: ind })
    this.props.onModal(payload)
  }

  handleAddModule(type, ind) {
    const { programLevels } = this.state
    this.props.onModal({
      type: 'Attach Library',
      data: {
        before: {
          show: [type],
          modules: [],
        },
        after: programLevels[ind][type],
      },
      callBack: {
        onAttach: e => {
          const modules = clone(programLevels)
          modules[ind][type] = concat(modules[ind][type], e.templates)
          this.setState({ programLevels: modules })
        },
        onAdd: () => this.handleNewModule(type, ind),
      },
    })
  }

  handleChangeModules(type, ind, list) {
    const programLevels = clone(this.state.programLevels)
    if ('trainings' === type) {
      const courses = filter(e => 1 === e.card_type_id, list)
      const tracks = filter(e => isNil(e.card_type_id), list)
      programLevels[ind]['courses'] = courses
      programLevels[ind]['tracks'] = tracks
      this.setState({ programLevels })
    } else {
      programLevels[ind][type] = list
      this.setState({ programLevels })
    }
  }

  handleSave(index, published) {
    const {
      title,
      description,
      level,
      role,
      author_id,
      department_id,
      competency_id,
      category_id,
      programLevels,
      company,
    } = this.state

    if (index < level - 1) {
      this.slider.slickGoTo(index + 1)
      return
    }

    let levels = {}
    let disabled = true
    for (let i = 0; i < level; i++) {
      const { title, habits, tracks, courses, word, pdf, powerpoint } = programLevels[i]
      const total =
        length(quotas) +
        length(habits) +
        length(concat(tracks, courses)) +
        length(concat(concat(word, pdf), powerpoint))
      const quotaDisabled = any(sl => 0 === sl.quota_target || isNil(sl.quota_target))(programLevels[i].quotas)
      disabled = isEmpty(title) || total === 0 || quotaDisabled

      const quotas = programLevels[i].quotas.map(item => {
        return {
          quota_template_id: item.id,
          quota_target: item.quota_target || 0,
          quota_calculation: item.quota_calculation || 0,
          span_months: item.span_months || 0,
          minimum_months: item.minimum_months || 0,
        }
      })

      let day = [],
        week = [],
        month = []
      programLevels[i].habits.map(item => {
        if (item.data.schedule_interval === 'day') {
          day.push(item.id)
        } else if (item.data.schedule_interval === 'week') {
          week.push(item.id)
        } else {
          month.push(item.id)
        }
      })

      const trainings = concat(programLevels[i].courses, programLevels[i].tracks).map(item => {
        const type = item.card_type_id === 1 ? 'course' : 'track'
        return {
          type,
          item_id: item.id,
        }
      })

      levels[i + 1] = {
        title: programLevels[i].title,
        quotas,
        habits: { day, week, month },
        trainings: {
          items: trainings,
          days_to_complete: '',
        },
        chronology_lock: programLevels[i].chronology_lock,
        time_lock: programLevels[i].time_lock,
      }
    }

    if (disabled) return

    const program = {
      author_id,
      company_id: company.id,
      user_id: null,
      status: 0,
      designation: 1,
      title,
      level: 1,
      data: {
        levels,
        description,
        category: category_id,
        competency: competency_id,
        department: department_id,
      },
      job_role_id: role.id,
      type: 1,
      published,
    }

    const payload = {
      type: 'careers',
      data: {
        program,
      },
    }
    this.props.onSave(payload)
  }

  render() {
    const {
      jobs,
      title,
      description,
      level,
      author_id,
      programLevels,
      role,
      quotaOptions,
      authors,
      departments,
      competencies,
      categories,
    } = this.state

    const trainingTypes = [
      { id: 0, value: 'Add Courses', name: 'courses' },
      { id: 1, value: 'Add Tracks', name: 'tracks' },
    ]
    const documentTypes = [
      { id: 0, value: 'Add Power Point', name: 'powerpoint' },
      { id: 1, value: 'Add Word', name: 'word' },
      { id: 3, value: 'Add PDF', name: 'pdf' },
    ]

    const isLeveled = !isEmpty(title) && !isNil(level) && !isNil(author_id) && !isEmpty(role)

    return (
      <>
        <Filter
          aligns={['left', 'right']}
          backTitle="all careers"
          onBack={() => this.props.history.goBack()}
          onChange={this.handleFilter}
        />
        <div className="lib-programs-career">
          <div className="settings-contents">
            <p className="dsl-b22 bold text-left py-2">Add New Career</p>
            <Input
              className="input-field"
              title="Title"
              value={title}
              direction="vertical"
              placeholder="Title your career program..."
              onChange={title => this.setState({ title })}
            />
            <Input
              className="input-field"
              as="textarea"
              rows="3"
              title="Description"
              value={description}
              direction="vertical"
              placeholder="Summarize your career program..."
              onChange={description => this.setState({ description })}
            />
            <Accordion className="settings-career">
              <Row className="mx-0">
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Levels"
                    direction="vertical"
                    data={LibraryLevels}
                    width="fit-content"
                    height={250}
                    onChange={this.handleSelectLevels}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Role"
                    width="fit-content"
                    direction="vertical"
                    data={jobs}
                    getValue={e => e.name}
                    returnBy="data"
                    onChange={this.handleSelectTags.bind(this, 'role')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'author')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Departments"
                    direction="vertical"
                    width="fit-content"
                    data={departments}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'department')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Competencies"
                    direction="vertical"
                    width="fit-content"
                    data={competencies}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'competency')}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    multi
                    title="Categories"
                    direction="vertical"
                    width="fit-content"
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags.bind(this, 'category')}
                  />
                </Col>
              </Row>
              <Button
                className="float-right"
                name="ADD LEVELS"
                disabled={!isLeveled}
                type={isLeveled ? 'medium' : 'high'}
              />
            </Accordion>
          </div>
          {isLeveled && (
            <div className="modules-contents mt-3">
              <Slider
                infinite
                adaptiveHeight
                prevArrow={<CustomArrow name="left" />}
                nextArrow={<CustomArrow name="right" />}
                ref={slider => (this.slider = slider)}
              >
                {programLevels.map((e, index) => {
                  const {
                    title,
                    chronology_lock,
                    time_lock,
                    habits,
                    quotas,
                    tracks,
                    courses,
                    word,
                    pdf,
                    powerpoint,
                  } = e
                  const trainings = concat(tracks, courses)
                  const documents = concat(concat(word, pdf), powerpoint)
                  return (
                    <div key={`level-${index}`}>
                      <p className="dsl-b22 bold">{`Level ${index + 1}`}</p>
                      <Row className="mx-0 mt-3">
                        <Col xs={6} className="px-0">
                          <Input
                            className="input-field"
                            title="Job Title"
                            type="text"
                            value={title}
                            direction="vertical"
                            placeholder="Type here..."
                            onChange={this.handleChangeLevel.bind(this, 'title', index)}
                          />
                        </Col>
                      </Row>
                      <Row className="mx-0 mt-3">
                        <Col xs={6} className="px-0">
                          <Input
                            className="input-field"
                            title="Estimated Time to Complete"
                            type="text"
                            direction="vertical"
                            placeholder="This will autofill automatically"
                            disabled
                          />
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
                              checked={chronology_lock}
                              onChange={this.handleChangeLevel.bind(this, 'chronology_lock', index)}
                            />
                          </Col>
                          <Col xs={12} sm={6} md={4} className="px-0 my-3">
                            <Toggle
                              title="Time Lock"
                              leftLabel="Off"
                              rightLabel="On"
                              checked={time_lock}
                              onChange={this.handleChangeLevel.bind(this, 'time_lock', index)}
                            />
                          </Col>
                        </Row>
                      </Accordion>
                      <div className="required-field pt-4 border-top">
                        <p className="dsl-b18 text-500">Required Quotas</p>
                        {length(quotas) > 0 ? (
                          <ProgramsList.QuotaList
                            modules={quotas}
                            quotaOptions={quotaOptions}
                            onChange={this.handleChangeModules.bind(this, 'quotas', index)}
                          />
                        ) : (
                          <ProgramsList.EmptyList />
                        )}
                        <div className="d-flex justify-content-end py-4">
                          <Button
                            name="+ ATTACH QUOTA"
                            type="low"
                            onClick={this.handleAddModule.bind(this, 'quotas', index)}
                          />
                        </div>
                      </div>
                      <div className="required-field">
                        <p className="dsl-b18 text-500">Required Habits</p>
                        {length(habits) > 0 ? (
                          <ProgramsList.HabitList
                            modules={habits}
                            onChange={this.handleChangeModules.bind(this, 'habits', index)}
                          />
                        ) : (
                          <ProgramsList.EmptyList />
                        )}
                        <div className="d-flex justify-content-end py-4">
                          <Button
                            name="+ ATTACH HABIT"
                            type="low"
                            onClick={this.handleAddModule.bind(this, 'habits', index)}
                          />
                        </div>
                      </div>
                      <div className="required-field pt-4 pb-5 mb-4 border-top">
                        <p className="dsl-b18 text-500">Required Training</p>
                        {length(trainings) > 0 ? (
                          <ProgramsList.TrainingList
                            modules={trainings}
                            onChange={this.handleChangeModules.bind(this, 'trainings', index)}
                          />
                        ) : (
                          <ProgramsList.EmptyList />
                        )}
                        <div className="d-flex justify-content-end py-4">
                          <Dropdown
                            align="right"
                            width="fit-content"
                            caret="none"
                            returnBy="data"
                            placeholder="+ ATTACH TRAINING"
                            className="add-training-dropdown"
                            selectable={false}
                            data={trainingTypes}
                            onChange={this.handleSelectModule.bind(this, index)}
                          />
                        </div>
                      </div>
                      {/* <div className="required-field pt-4 pb-5 mb-4 border-top">
                        <p className="dsl-b18 text-500">Documents:</p>
                        {length(documents) > 0 ? (
                          <ProgramsList.DocumentList modules={documents} />
                        ) : (
                          <p className="dsl-m12 mb-0">No documents uploaded yet...</p>
                        )}
                        <div className="d-flex justify-content-end py-3 mb-5">
                          <Dropdown
                            align="right"
                            width="fit-content"
                            caret="none"
                            returnBy="data"
                            placeholder="ADD DOCUMENT"
                            className="add-training-dropdown"
                            selectable={false}
                            data={documentTypes}
                            onChange={this.handleSelectModule.bind(this, index)}
                          />
                        </div>
                      </div> */}
                      <div className="d-flex float-right">
                        {level === index + 1 ? (
                          <>
                            <Button
                              name="Save Draft"
                              className="btn-save mr-3"
                              onClick={this.handleSave.bind(this, index, 0)}
                            />
                            <Button
                              name="Save & Publish"
                              className="btn-save"
                              onClick={this.handleSave.bind(this, index, 1)}
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              name="Save Draft"
                              className="btn-save mr-3"
                              onClick={this.handleSave.bind(this, this, 0)}
                            />
                            <Button
                              name="SAVE & NEXT"
                              className="btn-save"
                              onClick={this.handleSave.bind(this, index)}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </Slider>
            </div>
          )}
        </div>
      </>
    )
  }
}

Add.propTypes = {
  tags: PropTypes.shape({
    authors: PropTypes.array,
    departments: PropTypes.array,
    competencies: PropTypes.array,
    categories: PropTypes.array,
  }),
  company: PropTypes.shape({
    id: PropTypes.number,
  }),
  jobs: PropTypes.array,
  quotaOptions: PropTypes.array,
  onSave: PropTypes.func,
  onModal: PropTypes.func,
}

Add.defaultProps = {
  tags: {
    authors: [],
    departments: [],
    competencies: [],
    categories: [],
  },
  company: {
    id: 0,
  },
  jobs: [],
  quotaOptions: [],
  onSave: () => {},
  onModal: () => {},
}

export default Add
