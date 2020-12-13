import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import { clone, equals, filter, uniq } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Icon, Input, Thumbnail, Toggle, Upload, Pagination } from '@components'
import { LearningModule, TimeIntervals, InitQuiz } from '~/services/config'
import Question from './Question'
import './LibraryModuleCard.scss'

class Add extends React.PureComponent {
  state = {
    type: LearningModule[3],
    name: '',
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
    companyId: 0,
    userId: 0,
    modelOpen: false,
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

  handleRemoveQuestion = idx => {
    let questions = clone(this.state.questions)
    if (questions.length === 1) {
      toast.error('Quiz module should have one more questions.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }
    questions.splice(idx, 1)
    this.setState({ questions })
  }

  handleComposer = e => {
    this.setState({ composer: e })
  }

  handleFile = e => {
    this.setState({ file: e[0] })
    this.props.onModal({
      type: 'Confirm',
      data: {
        before: {
          title: 'Converting',
          body:
            'The presentation file is converting to be browser compatible, please wait a few minutes before previewing the module',
          yesButtonText: 'OK',
          noButtonText: null,
        },
      },
      callBack: {
        onYes: () => {
          this.setState({ modelOpen: true })
        },
      },
    })
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

  handlePreview = () => {
    const { type, name, description, thumbnail, file, videoURL, objectives, modelOpen } = this.state
    const item = {
      id: null,
      card_type_id: type.id,
      name,
      data: {
        name,
        tags: [],
        thumb_url: thumbnail,
        video_url: videoURL,
        competency: [],
        curriculum: [],
        department: [],
        attachments: [file],
        description,
        objectives,
      },
      recommended: null,
      published: 0,
      children: [],
    }
    const payload = {
      type: 'Preview',
      data: { before: { course: { children: [item] }, module: item, index: 0 }, after: null },
      callBack: null,
    }
    if (!modelOpen && type.label === 'Presentation') {
      this.props.onModal({
        type: 'Confirm',
        data: {
          before: {
            title: 'Converting',
            body:
              'The presentation file is converting to be browser compatible, please wait a few minutes before previewing the module',
            yesButtonText: 'OK',
            noButtonText: null,
          },
        },
        callBack: {
          onYes: () => {
            this.setState({ modelOpen: true })
          },
        },
      })
    } else {
      this.props.onModal(payload)
    }
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
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

  handleChangeFilter = (type, e) => {
    if (equals(type, 'company')) {
      this.setState({ companyId: e[0].id })
    } else {
      this.setState({ userId: e[0].id })
    }
  }

  handleSubmit = published => () => {
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
      companyId,
    } = this.state

    if (
      type.label === 'Quiz'
        ? name === '' || selected.author.length == 0
        : name === '' || description === '' || selected.author.length == 0
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
        published,
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

    this.props.onUpdate(payload, thumbnail, video, pdf, file)
  }

  handleInputChange = name => text => {
    this.setState({ [name]: text })
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
    const { authors, departments, competencies, categories, history } = this.props
    const showModuleComposer = !['Presentation', 'Quiz', 'Video'].includes(type.label)
    const showAttachment = !['Video', 'Quiz'].includes(type.label)
    const isPPT = ['Study', 'Presentation'].includes(type.label)
    const disabled =
      type.label === 'Quiz'
        ? name === '' || selected.author.length == 0
        : name === '' || description === '' || selected.author.length == 0

    return (
      <>
        <Filter
          mountEvent
          aligns={['left', 'right']}
          backTitle="all modules"
          dataCy="library-training-moduleFilterSection"
          onBack={() => history.goBack()}
          onChange={this.handleChangeFilter}
        />
        <div className="library-module-card border-5 mb-2 pt-3" data-cy="library-training-addModule">
          <div className="detail-content">
            <div className="d-flex justify-content-between mb-3">
              <span className="dsl-b22 bold">Create Module</span>
            </div>

            <p className="dsl-m12 mb-2">Module type</p>
            <div className="d-flex align-items-center my-3">
              <Dropdown
                data={LearningModule}
                defaultIndexes={[3]}
                dataCy="library-training-module-type"
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
                <span className="title-font">Module description</span>
                <ReactQuill
                  className="module-text d-flex-1"
                  title="Module description"
                  dataCy="library-training-module-description"
                  placeholder="Type here..."
                  value={description}
                  theme="snow"
                  modules={{ toolbar: { container: [['link']] } }}
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

            {type.label !== 'Quiz' && (
              <div className="d-flex float-right mt-4">
                <Button
                  type="medium"
                  dataCy="library-training-module-preview"
                  name="Preview"
                  busy={false}
                  onClick={this.handlePreview}
                />
                <Button
                  className="ml-3"
                  name="Save Draft"
                  dataCy="library-training-module-saveDraft"
                  onClick={this.handleSubmit(0)}
                />
                <Button
                  className="ml-3"
                  name="Save & Publish"
                  disabled={disabled}
                  dataCy="library-training-module-savePublish"
                  onClick={this.handleSubmit(1)}
                />
              </div>
            )}
          </div>
        </div>

        {type.label === 'Quiz' && (
          <div className="library-module-card border-5" data-cy="library-training-module-questions">
            <div className="detail-content">
              <div className="border-bottom my-4">
                <p className="dsl-b20 bold my-3">Questions</p>
              </div>
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
                      onRemoveQuestion={this.handleRemoveQuestion}
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
              <div className="d-flex float-right mt-4">
                <Button
                  className="ml-3"
                  name="Save Draft"
                  data-cy="library-training-module-saveDraftQuestionBtn"
                  onClick={this.handleSubmit(0)}
                />
                <Button
                  className="ml-3"
                  name="Save & Publish"
                  disabled={disabled}
                  data-cy="library-training-module-savePublishQuestionBtn"
                  onClick={this.handleSubmit(1)}
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

Add.propTypes = {
  companyId: PropTypes.number,
  authors: PropTypes.array,
  departments: PropTypes.array,
  competencies: PropTypes.array,
  categories: PropTypes.array,
  history: PropTypes.any,
  onUpdate: PropTypes.func,
  onModal: PropTypes.func,
}

Add.defaultProps = {
  companyId: 0,
  authors: [],
  departments: [],
  competencies: [],
  categories: [],
  history: {},
  onUpdate: () => {},
  onModal: () => {},
}

export default Add
