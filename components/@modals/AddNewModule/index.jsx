import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import { clone, equals, filter, uniq } from 'ramda'
import { Accordion, Button, Dropdown, Icon, Input, Thumbnail, Toggle, Upload, Pagination } from '@components'
import { LearningModule, TimeIntervals, InitQuiz } from '~/services/config'
import Question from './Question'
import './AddNewModule.scss'

class AddNewModule extends Component {
  state = {
    name: '',
    type: LearningModule[3],
    description: '',
    thumbnail: '',
    video: '',
    file: '',
    videoURL: '',
    composer: '',
    objectives: [''],
    selected: {
      author: [],
      department: [],
      competency: [],
      category: [],
    },
    approval: false,
    chronologicalLock: false,
    timeLock: false,
    disabled: true,
    current: 1,
    perPage: 5,
    questions: [InitQuiz[1], InitQuiz[2], InitQuiz[4]],
    submitted: false,
  }

  handleAddAnswer = e => {
    let questions = clone(this.state.questions)
    questions[e - 1].rules.options.push('')
    this.setState({ questions })
  }

  handleAddQuestion = () => {
    let questions = clone(this.state.questions)
    questions.push(InitQuiz[1])
    this.setState({ questions })
  }

  handleChangeQuizType = (e, idx) => {
    const type = e[0]
    let questions = clone(this.state.questions)
    questions[idx] = InitQuiz[type]
    this.setState({ questions })
  }

  handleChangeQuestion = (data, idx) => {
    let questions = clone(this.state.questions)
    questions[idx].wording = data
    this.setState({ questions })
  }

  handleChangeAnswers = (data, idx1, idx2) => {
    let questions = clone(this.state.questions)
    const { type } = questions[idx1]
    if (type === 3 || type === 4) {
      questions[idx1].rules.options[idx2] = data
    } else {
      questions[idx1].rules.answer = data
    }
    this.setState({ questions })
  }

  handleChangeChecked = (e, idx1, idx2) => {
    let questions = clone(this.state.questions)
    const { type } = questions[idx1]
    const index = `${idx2}`
    if (type === 3) {
      questions[idx1].rules.answer = e ? index : ''
    } else {
      let { answer } = questions[idx1].rules
      if (e) {
        answer.push(index)
      } else {
        answer = filter(x => x != index, answer)
      }
      questions[idx1].rules.answer = uniq(answer)
    }
    this.setState({ questions })
  }

  handleComposer = e => {
    this.setState({ composer: e })
  }

  handleFile = e => {
    this.setState({ file: e[0] })
  }

  handleThumbnail = e => {
    this.setState({ thumbnail: e })
  }

  handleVideo = e => {
    this.setState({ video: e[0] })
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

  handleCreate = () => {
    const {
      approval,
      type,
      name,
      description,
      selected,
      learnObjectives,
      videoURL,
      thumbnail,
      video,
      pdf,
      file,
      questions,
    } = this.state

    // Validate submission
    this.setState({ submitted: true })
    if (
      type.label === 'Quiz'
        ? name === '' || selected.author.length == 0
        : name.length <= 5 || description.length <= 10 || selected.author.length == 0
    )
      return

    let payload = {
      template: {
        card_type_id: type.id,
        name,
        author_id: selected.author[0],
        access_type: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: 1,
        data: {
          description,
          category: selected.category,
          competency: selected.competency,
          department: selected.department,
          objectives: learnObjectives,
          thumb_url: '',
          attachment_hash: '',
          attachments: [],
          estimated_completion: TimeIntervals[5].value,
          action_approval: 'self',
          require_attachments: '',
          assessment_id: null,
          presentation_url: '',
          link: '',
          study_content: '',
          video_url: videoURL,
          embed_url: '',
        },
      },
    }

    if (type.label === 'Quiz') {
      let ques = clone(questions)
      for (const question of ques) {
        const { type, rules, wording } = question
        if (wording === '') {
          toast.error('Empty question!', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          return
        }
        if (type === 3 || type === 4) {
          const opt = filter(x => x != '', rules.options)
          if (opt.length == 0 || opt == '') {
            toast.error('Missing answer!', {
              position: toast.POSITION.TOP_CENTER,
              pauseOnFocusLoss: false,
              hideProgressBar: true,
            })
            return
          }
          const options = Object.assign(...opt.map((x, index) => ({ [index + 1]: x })))
          question.rules.options = options
        } else {
          if (rules.answer == '') {
            toast.error('Missing answer!', {
              position: toast.POSITION.TOP_CENTER,
              pauseOnFocusLoss: false,
              hideProgressBar: true,
            })
            return
          }
        }
      }
      if (ques.length == 0) {
        toast.error('Invalid questions!', {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        return
      }
      const items = Object.assign(...ques.map((x, index) => ({ [index + 1]: x })))
      payload = {
        assessment: {
          company_id: this.props.companyId,
          user_id: null,
          title: name,
          type: 2,
          status: 0,
          author_id: selected.author[0],
          data: {
            quiz: {
              items,
              rules: {
                taken: `${questions.length}`,
                correct: `${questions.length}`,
              },
            },
            settings: {
              order: 'linear',
              show_correct: 'yes',
            },
            description,
            category: selected.category,
            competency: selected.competency,
            department: selected.department,
            objectives: learnObjectives,
            assessment_id: null,
          },
          result: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          published,
        },
        data: {
          card_type_id: 5,
          name,
          data: {
            link: '',
            tags: [],
            type: 'recurring',
            category: selected.category,
            thumb_url: '',
            video_url: '',
            competency: selected.competency,
            delay_days: 0,
            department: selected.department,
            attachments: [],
            combo_order: '',
            description,
            assessment_id: null,
            meta_category: '',
            action_approval: approval ? 'manager' : 'self',
            assessment_type: '',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author_id: selected.author[0],
          parent_id: null,
          blocked_by: null,
          quota: '0',
          access_type: 1,
          rating: null,
          recommended: null,
          published,
        },
      }
    }
    this.props.onCreate(payload, thumbnail, video, pdf, file)
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handleInputChange = name => text => {
    this.setState({ [name]: text })
  }

  handleSwitch = item => e => {
    if (equals(item, 'chronological')) {
      this.setState({ chronologicalLock: e })
    } else if (equals(item, 'manager')) {
      this.setState({ approval: e })
    } else {
      this.setState({ timeLock: e })
    }
  }

  render() {
    const {
      type,
      name,
      description,
      thumbnail,
      videoURL,
      composer,
      objectives,
      approval,
      timeLock,
      chronologicalLock,
      selected,
      questions,
      current,
      perPage,
      video,
      file,
    } = this.state
    const { authors, departments, competencies, categories } = this.props
    const showModuleComposer = !['Presentation', 'Quiz', 'Video'].includes(type.label)
    const showAttachment = !['Video', 'Quiz'].includes(type.label)
    const isPPT = ['Study', 'Presentation'].includes(type.label)
    const disabled =
      type.label === 'Quiz'
        ? name === '' || selected.author.length == 0
        : name.length < 5 || description.length < 10 || selected.author.length == 0

    return (
      <div className="add-new-module-modal" dataCy="addNewModule">
        <div className="modal-header">
          <Icon name="fal fa-plus-circle" size={12} color="#fff" />
          <span className="dsl-w12 ml-1">Add Module</span>
        </div>
        <div className="modal-body clearfix">
          <p className="dsl-m12 mb-2">Module type</p>
          <div className="d-flex align-items-center ml-2 mb-3">
            <Icon name={`${type.alias} mr-1`} size={14} color="#343f4b" />
            <Dropdown
              data={LearningModule}
              dataCy="module-type"
              defaultIndexes={[3]}
              returnBy="data"
              getValue={item => item['label']}
              onChange={e => this.setState({ type: e[0] })}
            />
          </div>
          <div className="d-flex mt-3">
            <div>
              <p className="dsl-m12 mb-1">Module image</p>
              <Thumbnail
                src={thumbnail}
                dataCy="library-training-module-image"
                type="upload"
                size="medium"
                label="Upload image"
                onDrop={this.handleThumbnail}
              />
            </div>
            <div className="d-flex flex-column pl-4 d-flex-1">
              <Input
                className="module-input mb-3"
                title="Module title"
                dataCy="library-training-module-title"
                placeholder="Type here..."
                value={name}
                direction="vertical"
                onChange={this.handleInputChange('name')}
              />
              <Input
                className="module-text d-flex-1"
                title="Module description"
                dataCy="library-training-module-description"
                placeholder="Type here..."
                direction="vertical"
                as="textarea"
                value={description}
                onChange={this.handleInputChange('description')}
              />
            </div>
          </div>

          {type.label === 'Video' && (
            <div className="d-flex align-items-center mt-3">
              <div className="d-flex-1">
                <p className="dsl-m12 mb-1">File</p>
                <Upload
                  type="low"
                  accept="video/*"
                  title="Upload video file"
                  icon="fal fa-file-upload"
                  color="#376caf"
                  size={16}
                  onDrop={this.handleVideo}
                />
              </div>
              {!video && (
                <div className="d-flex-1 mt-5">
                  <p className="dsl-m12 mb-4">File types supported AVI, MP4</p>
                </div>
              )}
              <div className="d-flex-1">
                <p className="dsl-m12 mb-1">Or place the video link</p>
                <Input
                  className="video-url"
                  dataCy="library-training-module-videoUrl"
                  placeholder="Type here..."
                  direction="vertical"
                  value={videoURL}
                  onChange={e => this.setState({ videoURL: e })}
                />
              </div>
            </div>
          )}

          {showModuleComposer && (
            <div className="my-4">
              <p className="dsl-m12 my-1">Module composer:</p>
              <ReactQuill value={composer} onChange={this.handleComposer} />
            </div>
          )}

          <div className="d-flex mt-3">
            {showAttachment && (
              <div className="d-flex align-items-center mt-3">
                <div className="d-flex-1">
                  <p className="dsl-m12 mb-1">File</p>
                  <Upload
                    title={`Upload ${isPPT ? 'PPT' : ''} file`}
                    icon="fal fa-file-upload"
                    color="#376caf"
                    accept={isPPT ? '.ppt, .pptx, .pot, .potx, .odp' : ''}
                    size={16}
                    onDrop={this.handleFile}
                  />
                </div>
                {!file && (
                  <p className="dsl-m12 mt-5 mb-4">{`File types supported ${isPPT ? 'PPT' : 'PDF, DOC, XLS'}`}</p>
                )}
              </div>
            )}
            {type.label === 'Scorm' && (
              <Input
                className="video-url ml-4"
                placeholder="Paste scorm link..."
                dataCy="library-training-module-scormLink"
                title="Or place the scorm link"
                direction="vertical"
                value={videoURL}
                onChange={e => this.setState({ videoURL: e })}
              />
            )}
          </div>

          <p className="dsl-m12 mt-4">Learning objectives:</p>
          {objectives.map((item, index) => (
            <div className="d-flex" key={`ob${index}`}>
              <Input
                className="module-input mb-2 d-flex-1"
                dataCy={`library-training-module-learningObjectiveContent${index}`}
                key={`objectives${index}`}
                value={item}
                placeholder="Type here..."
                direction="vertical"
                onChange={this.handleObjectiveChange(index)}
              />
              <Button
                className="ml-auto"
                dataCy={`library-training-module-learningObjectiveTrashBtn${index}`}
                type="link"
                onClick={this.handleObjectiveDelete(index)}
              >
                <Icon name="far fa-trash-alt" size={14} color="#376caf" />
              </Button>
            </div>
          ))}
          <Button
            className="ml-auto"
            dataCy="library-training-module-learningObjectiveAddBtn"
            type="link"
            onClick={this.handleObjectiveAdd}
          >
            <Icon name="far fa-plus" size={14} color="#376caf" />
            <span className="dsl-p14 text-400 ml-1">ADD OBJECTIVE</span>
          </Button>

          <Accordion className="settings" expanded>
            <Row className="mt-2">
              <Col sm={6} md={6}>
                <p className="dsl-m12 my-2">Time to complete</p>
                <Dropdown
                  data={TimeIntervals}
                  dataCy="library-training-module-timeInterval"
                  defaultIndexes={[0]}
                  align="right"
                  width={100}
                  getValue={item => item['label']}
                />
              </Col>
              <Col sm={6} md={6}>
                <Toggle
                  checked={approval}
                  title="Manager approval"
                  dataCy="library-training-module-managerApproval"
                  leftLabel="Off"
                  rightLabel="On"
                  onChange={this.handleSwitch('manager')}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={12} sm={6} className="my-3">
                <Dropdown
                  title="Author"
                  direction="vertical"
                  dataCy="library-training-module-author"
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
                  dataCy="library-training-module-department"
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
                  dataCy="library-training-module-competencies"
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
                  dataCy="library-training-module-categories"
                  direction="vertical"
                  width="fit-content"
                  data={categories}
                  getValue={e => e.name}
                  onChange={this.handleSelectTags('category')}
                />
              </Col>
            </Row>
            {type.label !== 'Quiz' && (
              <>
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
                      title="Chronology Lock"
                      dataCy="library-training-module-chronologicalLock"
                      leftLabel="Off"
                      rightLabel="On"
                      onChange={this.handleSwitch('chronological')}
                    />
                  </Col>
                  <Col sm={6} md={6}>
                    <Toggle
                      checked={timeLock}
                      dataCy="library-training-module-timeLock"
                      title="Time Lock"
                      leftLabel="Off"
                      rightLabel="On"
                      onChange={this.handleSwitch('time')}
                    />
                  </Col>
                </Row>
              </>
            )}
          </Accordion>

          {type.label === 'Quiz' && (
            <>
              <p className="dsl-b20 bold my-3">Questions</p>
              {questions.map((item, index) => {
                if (index < perPage * current && index >= perPage * (current - 1)) {
                  return (
                    <Question
                      key={index}
                      index={index + 1}
                      dataCy={`question${index}`}
                      question={item}
                      onAddAnswer={this.handleAddAnswer}
                      onChangeType={this.handleChangeQuizType}
                      onChangeQuestion={this.handleChangeQuestion}
                      onChangeAnswer={this.handleChangeAnswers}
                      onChecked={this.handleChangeChecked}
                    />
                  )
                }
              })}
              <div className="d-flex justify-content-between align-items-center">
                <Pagination
                  current={current}
                  pers={[]}
                  total={Math.ceil(questions.length / perPage)}
                  onChange={current => this.setState({ current })}
                />
                <Button
                  dataCy="library-training-module-addQuestionBtn"
                  className="ml-auto"
                  type="medium"
                  onClick={this.handleAddQuestion}
                >
                  <Icon name="far fa-plus" size={14} color="#376caf" />
                  <span className="dsl-p14 text-400 ml-1">ADD QUESTION</span>
                </Button>
              </div>
            </>
          )}

          <Button
            className="ml-auto mr-2 mt-3"
            disabled={disabled}
            dataCy="moduleAddBtn"
            name="ADD"
            onClick={this.handleCreate}
          />
        </div>
      </div>
    )
  }
}

AddNewModule.propTypes = {
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  onCreate: PropTypes.func.isRequired,
}

AddNewModule.defaultProps = {
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  onCreate: () => {},
}

export default AddNewModule
