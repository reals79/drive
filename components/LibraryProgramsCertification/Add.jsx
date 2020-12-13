import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { history } from '~/reducers'
import { concat, clone, equals, filter, length, isNil, isEmpty, any } from 'ramda'
import {
  Accordion,
  Button,
  Dropdown,
  Filter,
  Input,
  LibraryProgramsList as ProgramsList,
  Upload,
  Thumbnail,
  Toggle,
} from '@components'
import { LibraryExpires, LibraryLevels } from '~/services/config'
import { TrainingTypes, DocumentTypes } from './Config'
import CustomArrow from './CustomArrow'
import './LibraryProgramsCertification.scss'

class Add extends Component {
  state = {
    title: '',
    description: '',
    level: null,
    expiration: 0,
    certificateLink: '',
    iconLink: '',
    author_id: null,
    company: this.props.company,
    department_id: [],
    competency_id: [],
    category_id: [],
    programLevels: [],
    quotaData: false,
    habitData: false,
    levelInd: 0,
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

  handleSelectTags = key => tag => {
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
      default:
        break
    }
  }

  handleSelectLevels = e => {
    const level = e[0]
    let programLevels = []
    for (let i = 0; i < level; i++) {
      programLevels[i] = {
        title: '',
        certificate_pdf: '',
        icon_url: '',
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

  handleChangeLevel = (key, ind) => e => {
    const programLevels = clone(this.state.programLevels)
    programLevels[ind][key] = e
    this.setState({ programLevels })
  }

  handleDrop = type => e => {
    if (type === 'icon') {
      this.setState({ iconLink: e })
    } else {
      this.setState({ certificateLink: e[0] })
    }
  }

  handleSelectModule = ind => e => {
    this.handleAddModule(e[0].name, ind)()
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
    if (type === 'powerpoint') {
      payload = {
        type: 'Add Document',
        data: { before: { id: 0, name: 'Power Point' }, after: null },
        callBack: null,
      }
    }
    if (type === 'word') {
      payload = {
        type: 'Add Document',
        data: { before: { id: 1, name: 'Word' }, after: null },
        callBack: null,
      }
    }
    if (type === 'pdf') {
      payload = {
        type: 'Add Document',
        data: { before: { id: 2, name: 'PDF' }, after: null },
        callBack: null,
      }
    }
    if (type === 'courses' || type === 'tracks') {
      history.push(`/library/training/${type}/new`)
      return
    }
    this.setState({ levelInd: ind })
    this.props.onModal(payload)
  }

  handleAddModule = (type, ind) => () => {
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

  handleChangeModules = (type, ind) => list => {
    const programLevels = clone(this.state.programLevels)
    if ('trainings' === type) {
      const courses = filter(e => 1 === e.card_type_id, list)
      const tracks = filter(e => isNil(e.card_type_id), list)
      programLevels[ind]['courses'] = courses
      programLevels[ind]['tracks'] = tracks
      this.setState({ programLevels })
    } else if ('documents' === type) {
      const pdf = filter(e => 'PDF' === e.data.type, list)
      const word = filter(e => 'Word' === e.data.type, list)
      const powerpoint = filter(e => 'Power Point' === e.data.type, list)
      programLevels[ind]['pdf'] = pdf
      programLevels[ind]['word'] = word
      programLevels[ind]['powerpoint'] = powerpoint
      this.setState({ programLevels })
    } else {
      programLevels[ind][type] = list
      this.setState({ programLevels })
    }
  }

  handleSave = (index, published) => () => {
    const {
      title,
      description,
      level,
      expiration,
      certificateLink,
      iconLink,
      programLevels,
      company,
      author_id,
      department_id,
      competency_id,
      category_id,
    } = this.state
    if (index < level - 1) {
      this.slider.slickGoTo(index + 1)
      return
    }

    let levels = {}
    let disabled = false
    for (let i = 0; i < level; i++) {
      const quotas = programLevels[i].quotas.map(item => {
        const { title, habits, tracks, courses, word, pdf, powerpoint } = programLevels[i]
        const total =
          length(quotas) +
          length(habits) +
          length(concat(tracks, courses)) +
          length(concat(concat(word, pdf), powerpoint))
        const quotaDisabled = any(sl => 0 === sl.quota_target || isNil(sl.quota_target))(programLevels[i].quotas)
        disabled = isEmpty(title) || total === 0 || quotaDisabled
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
        certificate_pdf: certificateLink,
        icon_url: iconLink,
        valid_months: expiration,
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
      level,
      data: {
        levels,
        description,
        category: category_id,
        competency: competency_id,
        department: department_id,
      },
      type: 2,
      published,
    }

    const payload = {
      type: 'certifications',
      data: {
        program,
      },
    }
    this.props.onSave(payload, iconLink, certificateLink)
  }

  render() {
    const { tags } = this.props
    const { authors, departments, competencies, categories } = tags
    const { title, description, level, author_id, programLevels, iconLink } = this.state
    const isLeveled = !isEmpty(title) && !isNil(level) && !isNil(author_id)

    return (
      <>
        <Filter aligns={['left', 'right']} backTitle="all certifications" onBack={() => this.props.history.goBack()} />
        <div className="lib-programs-certification">
          <div className="settings-contents">
            <p className="dsl-b22 bold text-left py-2">Add New Certification</p>
            <Input
              className="input-field"
              title="Title"
              value={title}
              direction="vertical"
              placeholder="Title your certification..."
              onChange={title => this.setState({ title })}
            />
            <Input
              className="input-field"
              as="textarea"
              rows="3"
              title="Description"
              value={description}
              direction="vertical"
              placeholder="Type here..."
              onChange={description => this.setState({ description })}
            />
            <Row className="mx-0 my-4">
              <Col xs={6} className="px-0">
                <p className="dsl-m12 mb-3">Upload icon</p>
                <div className="d-flex">
                  <Thumbnail
                    src={iconLink}
                    type="upload"
                    size="medium"
                    label="Upload icon"
                    onDrop={this.handleDrop('icon')}
                  />
                </div>
              </Col>
              <Col xs={6} className="px-0">
                <p className="dsl-m12 mb-3">Upload certificate</p>
                <div className="d-flex">
                  <Thumbnail src="fal fa-file-pdf" className="certificate-thumbnail" />
                  <Upload
                    type="link"
                    title="UPLOAD"
                    size={14}
                    color="#376caf"
                    className="ml-4"
                    onDrop={this.handleDrop('certification')}
                  />
                </div>
              </Col>
            </Row>
            <Accordion className="settings-certificate" expanded>
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
                    title="Expiration"
                    direction="vertical"
                    data={LibraryExpires}
                    defaultIndexes={[0]}
                    width="fit-content"
                    height={250}
                    onChange={e => this.setState({ expiration: e[0] })}
                  />
                </Col>
                <Col xs={12} sm={6} className="px-0 my-3">
                  <Dropdown
                    title="Author"
                    direction="vertical"
                    className="tag-dropdown"
                    width="fit-content"
                    height={135}
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
                    height={135}
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
                    data={categories}
                    getValue={e => e.name}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
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
                      <Row className="mx-0">
                        <Col xs={6} className="px-0">
                          <Input
                            className="input-field"
                            title="Title"
                            type="text"
                            value={title}
                            direction="vertical"
                            placeholder="Title your certification..."
                            onChange={this.handleChangeLevel('title', index)}
                          />
                        </Col>
                      </Row>
                      <Row className="mx-0">
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
                      <Accordion className="settings-certificate">
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
                              onChange={this.handleChangeLevel('chronology_lock', index)}
                            />
                          </Col>
                          <Col xs={12} sm={6} md={4} className="px-0 my-3">
                            <Toggle
                              title="Time Lock"
                              leftLabel="Off"
                              rightLabel="On"
                              checked={time_lock}
                              onChange={this.handleChangeLevel('time_lock', index)}
                            />
                          </Col>
                        </Row>
                      </Accordion>
                      <div className="required-field pt-4 border-top">
                        <p className="dsl-b18 text-500">Required Quotas</p>
                        {length(quotas) > 0 ? (
                          <ProgramsList.QuotaList
                            modules={quotas}
                            quotaOptions={this.props.quotaOptions}
                            onChange={this.handleChangeModules('quotas', index)}
                          />
                        ) : (
                          <ProgramsList.EmptyList />
                        )}
                        <div className="d-flex justify-content-end py-4">
                          <Button name="+ ADD QUOTA" type="low" onClick={this.handleAddModule('quotas', index)} />
                        </div>
                      </div>
                      <div className="required-field">
                        <p className="dsl-b18 text-500">Required Habits</p>
                        {length(habits) > 0 ? (
                          <ProgramsList.HabitList
                            modules={habits}
                            onChange={this.handleChangeModules('habits', index)}
                          />
                        ) : (
                          <ProgramsList.EmptyList />
                        )}
                        <div className="d-flex justify-content-end py-4">
                          <Button name="+ ADD HABIT" type="low" onClick={this.handleAddModule('habits', index)} />
                        </div>
                      </div>
                      <div className="required-field">
                        <p className="dsl-b18 text-500">Required Training</p>
                        {!isNil(trainings) && length(trainings) > 0 ? (
                          <ProgramsList.TrainingList
                            modules={trainings}
                            onChange={this.handleChangeModules('trainings', index)}
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
                            placeholder="+ ADD TRAINING"
                            className="add-training-dropdown"
                            selectable={false}
                            data={TrainingTypes}
                            onChange={this.handleSelectModule(index)}
                          />
                        </div>
                      </div>
                      <div className="required-field pt-4 pb-5 mb-4 border-top">
                        <p className="dsl-b18 text-500">Documents:</p>
                        {length(documents) > 0 ? (
                          <ProgramsList.DocumentList
                            modules={documents}
                            onChange={this.handleChangeModules('documents', index)}
                          />
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
                            data={DocumentTypes}
                            onChange={this.handleSelectModule(index)}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        {level === index + 1 ? (
                          <>
                            <Button name="Save Draft" className="btn-save mr-3" onClick={this.handleSave(index, 0)} />
                            <Button name="Save & Publish" className="btn-save" onClick={this.handleSave(index, 1)} />
                          </>
                        ) : (
                          <>
                            <Button name="Save Draft" className="btn-save mr-3" onClick={this.handleSave(index, 0)} />
                            <Button name="SAVE & NEXT" className="btn-save" onClick={this.handleSave(index, 1)} />
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
  onSave: () => {},
  onModal: () => {},
}

export default Add
