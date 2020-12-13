import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import Slider from 'react-slick'
import { isNil, keys, values, isEmpty, length, concat, clone, propEq, type, dropLast } from 'ramda'
import {
  Accordion,
  Button,
  Dropdown,
  EditDropdown,
  Input,
  Upload,
  Thumbnail,
  Toggle,
  CareerRequiredInstances as Instances,
} from '@components'
import { LibraryExpires, LibraryProgramDetailMenu } from '~/services/config'
import { TrainingTypes } from './Config'
import CustomArrow from './CustomArrow'
import './LibraryProgramsCertification.scss'

class Edit extends Component {
  constructor(props) {
    super(props)

    const { program, jobs } = props
    const job = find(propEq('id', program.job_role_id), jobs) || {}
    this.state = {
      curLevel: 0,
      job,
      program,
      certificateLink: program.data.attachments[0],
      iconLink: program.data.thumb_url,
      levelData: [],
      isLevel: false,
    }

    this.handleLink = this.handleLink.bind(this)
    this.handleChangeTitle = this.handleChangeTitle.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleSelectTags = this.handleSelectTags.bind(this)
    this.handleChangeLevel = this.handleChangeLevel.bind(this)
    this.handleAddModule = this.handleAddModule.bind(this)
    this.handleSelectModule = this.handleSelectModule.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
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
    })
    return { isLevel, levelData: newLevelData }
  }

  handleLink(link) {
    if (!isNil(link) && !isEmpty(link)) {
      const win = window.open(link, '_blank')
      win.focus()
    }
  }

  handleChangeTitle(title) {
    const { program } = this.state
    const newProgram = {
      ...program,
      title,
    }
    this.setState({ program: newProgram })
  }

  handleChangeDescription(description) {
    const { program } = this.state
    const newProgram = {
      ...program,
      data: {
        ...program.data,
        description,
      },
    }
    this.setState({ program: newProgram })
  }

  handleSelectTags(key, tag) {
    const { program } = this.state
    let newProgram = { ...program }
    switch (key) {
      case 'author':
        newProgram = {
          ...program,
          author_id: tag[0],
        }
        break
      case 'department':
        newProgram = {
          ...program,
          data: {
            ...program.data,
            department_id: tag,
          },
        }
        break
      case 'competency':
        newProgram = {
          ...program,
          data: {
            ...program.data,
            competency_id: tag,
          },
        }
        break
      case 'category':
        newProgram = {
          ...program,
          data: {
            ...program.data,
            category_id: tag,
          },
        }
        break
      case 'job_title':
        newProgram = {
          ...program,
          job_title_id: tag[0],
        }
        break
      default:
        break
    }
    this.setState({ program: newProgram })
  }

  handleChangeLevel(key, ind, e) {
    const { program, isLevel } = this.state
    if (!isLevel) return
    let programLevels = clone(program.data.levels)
    if (key === 'trainings') {
      programLevels[ind][key] = {
        ...programLevels[ind][key],
        items: e,
      }
    } else {
      programLevels[ind][key] = e
    }
    const newProgram = {
      ...program,
      data: {
        ...program.data,
        levels: programLevels,
      },
    }
    this.setState({ program: newProgram })
  }

  handleAddModule(type, ind) {
    const { program } = this.state
    let programLevels = clone(program.data.levels)
    let after = []
    if (type === 'quotas') {
      after = programLevels[ind][type]
    } else if (type === 'habits') {
      after = concat(
        concat(programLevels[ind][type].day, programLevels[ind][type].week),
        programLevels[ind][type].month
      )
    } else if (type === 'tracks' || type === 'courses') {
      after = programLevels[ind]['trainings'].items
    }

    this.props.onModal({
      type: 'Attach Library',
      data: {
        before: { modules: [], show: [type], selected: [] },
        after,
      },
      callBack: {
        onAttach: e => {
          if (type === 'quotas') {
            programLevels[ind]['quotas'] = concat(programLevels[ind]['quotas'], e.templates)
          } else if (type === 'habits') {
            let day = [],
              week = [],
              month = []
            e.templates.map(item => {
              if (item.data.schedule_interval === 'day') {
                day.push(item)
              } else if (item.data.schedule_interval === 'week') {
                week.push(item)
              } else {
                month.push(item)
              }
            })
            programLevels[ind]['habits'].day = concat(programLevels[ind]['habits'].day, day)
            programLevels[ind]['habits'].week = concat(programLevels[ind]['habits'].week, week)
            programLevels[ind]['habits'].month = concat(programLevels[ind]['habits'].month, month)
          } else if (type === 'tracks' || type === 'courses') {
            let templates = clone(e.templates)
            templates = templates.map(item => {
              item.type = dropLast(1, type)
              return item
            })
            programLevels[ind]['trainings'].items = concat(programLevels[ind]['trainings'].items, templates)
          }
          const newProgram = {
            ...program,
            data: {
              ...program.data,
              levels: programLevels,
            },
          }
          this.setState({ program: newProgram })
        },
      },
    })
  }

  handleDrop(type, e) {
    if (type === 'icon') {
      this.setState({ iconLink: e })
    } else {
      this.setState({ certificateLink: e[0] })
    }
  }

  handleSelectModule(ind, e) {
    this.handleAddModule(e[0].name, ind)
  }

  handleSave(published) {
    const { program, certificateLink, iconLink, isLevel } = this.state
    const programLevels = isLevel ? clone(program.data.levels) : null
    let levels = {}
    const isImage = typeof iconLink.name == 'string'
    const isFile = typeof certificateLink.name == 'string'

    if (!isNil(programLevels)) {
      keys(programLevels).map(key => {
        const day = programLevels[key].habits.day.map(item => item.id)
        const week = programLevels[key].habits.week.map(item => item.id)
        const month = programLevels[key].habits.month.map(item => item.id)
        const habits = { day, week, month }
        const quotas = programLevels[key].quotas.map(item => {
          return {
            quota_template_id: item.id,
            quota_target: item.quota_target || 0,
            quota_calculation: item.quota_calculation || 0,
            span_months: item.span_months || 0,
            minimum_months: item.minimum_months || 0,
          }
        })
        const trainings = programLevels[key].trainings.items.map(item => {
          const type = item.card_type_id === 1 ? 'course' : 'track'
          return {
            type,
            item_id: item.id,
          }
        })
        levels[key] = {
          ...programLevels[key],
          habits,
          quotas,
          trainings: {
            ...programLevels[key].trainings,
            items: trainings,
          },
        }
      })
    }
    const newProgram = {
      ...program,
      published,
      data: {
        ...program.data,
        levels,
      },
    }
    const payload = {
      type: 'certifications',
      data: {
        program: newProgram,
      },
    }
    this.props.onSave(payload, isImage ? iconLink : null, isFile ? certificateLink : null)
  }

  render() {
    const { tags, role, onSelect, quotaOptions } = this.props
    const { authors, departments, competencies, categories } = tags
    const { job, curLevel, program, certificateLink, iconLink, levelData } = this.state

    const disabled = this.props.program === program && isEmpty(iconLink) && isEmpty(certificateLink)

    return (
      <div className="lib-programs-certification">
        <div className="certification-detail">
          <div className="d-flex py-2">
            <p className="dsl-b22 bold">{program.title}</p>
            <div className="d-flex-1" />
            <EditDropdown options={LibraryProgramDetailMenu[role]} onChange={onSelect} />
          </div>
          <Input
            className="input-field"
            title="Title"
            value={program.title}
            direction="vertical"
            placeholder="Title your career program..."
            onChange={this.handleChangeTitle}
          />
          <Input
            className="input-field"
            as="textarea"
            rows="3"
            title="Description"
            value={program.data.description}
            direction="vertical"
            placeholder="Summarize your career program..."
            onChange={this.handleChangeDescription}
          />
          <Row className="mx-0 my-4">
            <Col xs={6} className="px-0">
              <p className="dsl-m12 mb-3">Thumbnail</p>
              <div className="d-flex">
                <Thumbnail
                  src={iconLink}
                  type="upload"
                  size="medium"
                  label="Upload icon"
                  onDrop={this.handleDrop.bind(this, 'icon')}
                />
              </div>
            </Col>
            <Col xs={6} className="px-0">
              <p className="dsl-m12 mb-3">Certificate</p>
              <Thumbnail
                src="fal fa-file-pdf"
                className="certificate-thumbnail"
                onClick={this.handleLink.bind(this, program.data.attachments[0])}
              />
              <Upload
                icon=""
                type="link"
                title="UPLOAD"
                size={14}
                color="#376caf"
                onDrop={this.handleDrop.bind(this, 'certification')}
              />
            </Col>
          </Row>
          <Accordion className="settings-certificate" expanded>
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <p className="dsl-m12 mb-2">Levels</p>
                <p className="dsl-b16 normal mx-2">{`Level ${program.level ? program.level : 'N/A'}`}</p>
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Expiration"
                  direction="vertical"
                  data={LibraryExpires}
                  defaultIndexes={[levelData[curLevel].valid_months || 0]}
                  width="fit-content"
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
                  onChange={this.handleSelectTags.bind(this, 'author')}
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
                  onChange={this.handleSelectTags.bind(this, 'department')}
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
                  onChange={this.handleSelectTags.bind(this, 'competency')}
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
                  onChange={this.handleSelectTags.bind(this, 'category')}
                />
              </Col>
            </Row>
          </Accordion>
        </div>
        <div className="modules-contents mt-3">
          <Slider
            infinite
            adaptiveHeight
            prevArrow={<CustomArrow name="left" />}
            nextArrow={<CustomArrow name="right" />}
            ref={slider => (this.slider = slider)}
            afterChange={ind => this.setState({ curLevel: ind })}
          >
            {levelData.map((e, index) => {
              const { title, chronology_lock, time_lock, habits, quotas, trainings, documents } = e
              const habitsLength =
                type(habits) === 'Object'
                  ? length(habits.day) + length(habits.week) + length(habits.month)
                  : length(habits)

              return (
                <div key={`level-${index}`}>
                  <p className="dsl-b22 bold">{`Level ${index + 1}`}</p>
                  <Row className="mx-0">
                    <Col xs={6} className="px-0 mb-3">
                      <Input
                        className="input-field"
                        title="Job Title"
                        value={title}
                        direction="vertical"
                        placeholder="Type here..."
                        onChange={this.handleChangeLevel.bind(this, 'title', index + 1)}
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
                          onChange={this.handleChangeLevel.bind(this, 'chronology_lock', index + 1)}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={4} className="px-0 my-3">
                        <Toggle
                          title="Time Lock"
                          leftLabel="Off"
                          rightLabel="On"
                          checked={time_lock || false}
                          onChange={this.handleChangeLevel.bind(this, 'time_lock', index + 1)}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <div className="required-field pt-4 border-top">
                    <p className="dsl-b18 text-500">Required Quotas</p>
                    {quotas && length(quotas) > 0 ? (
                      <Instances.QuotasEdit
                        data={quotas}
                        type="instance"
                        options={quotaOptions}
                        onChange={this.handleChangeLevel.bind(this, 'quotas', index + 1)}
                      />
                    ) : (
                      <Instances.Empty />
                    )}
                    <div className="d-flex justify-content-end py-4">
                      <Button
                        name="+ ADD QUOTA"
                        type="low"
                        onClick={this.handleAddModule.bind(this, 'quotas', index + 1)}
                      />
                    </div>
                  </div>
                  <div className="required-field pt-4">
                    <p className="dsl-b18 text-500">Required Habits</p>
                    {habitsLength > 0 ? (
                      <Instances.HabitsEdit
                        data={habits}
                        type="template"
                        onChange={this.handleChangeLevel.bind(this, 'habits', index + 1)}
                      />
                    ) : (
                      <Instances.Empty />
                    )}
                    <div className="d-flex justify-content-end py-4">
                      <Button
                        name="+ ADD HABIT"
                        type="low"
                        onClick={this.handleAddModule.bind(this, 'habits', index + 1)}
                      />
                    </div>
                  </div>
                  <div className="required-field pt-4 mb-5">
                    <p className="dsl-b18 text-500">Required Training</p>
                    {trainings && length(trainings.items) > 0 ? (
                      <Instances.TrainingsEdit
                        data={trainings.items}
                        type="template"
                        onChange={this.handleChangeLevel.bind(this, 'trainings', index + 1)}
                      />
                    ) : (
                      <Instances.Empty />
                    )}
                    <div className="d-flex justify-content-end py-4 px-3">
                      <Dropdown
                        align="right"
                        width="fit-content"
                        caret="none"
                        returnBy="data"
                        placeholder="+ ADD TRAINING"
                        className="add-training-dropdown"
                        selectable={false}
                        data={TrainingTypes}
                        onChange={this.handleSelectModule.bind(this, index + 1)}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
        <div className="modules-contents">
          <div className="d-flex justify-content-end pb-2 px-3">
            <Button
              name="Save Draft"
              className="btn-save mr-3"
              disabled={disabled}
              onClick={this.handleSave.bind(this, 0)}
            />
            <Button
              name="Save & Publish"
              className="btn-save"
              disabled={disabled}
              onClick={this.handleSave.bind(this, 1)}
            />
          </div>
        </div>
      </div>
    )
  }
}

Edit.propTypes = {
  role: PropTypes.number,
  program: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    data: PropTypes.any,
  }),
  onSelect: PropTypes.func,
}

Edit.defaultProps = {
  role: 1,
  program: {
    id: 0,
    title: '',
    data: {},
  },
  onSelect: () => {},
}

export default Edit
