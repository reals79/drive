import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { clone, equals, filter, find, isEmpty, propEq } from 'ramda'
import ReactQuill from 'react-quill'
import {
  Accordion,
  Button,
  Dropdown,
  EditDropdown,
  Filter,
  Icon,
  Input,
  Pagination,
  Thumbnail,
  Toggle,
  Upload,
} from '@components'
import Question from './Question'
import { LibraryCardEditMenu, TimeIntervals, LearningModule } from '~/services/config'
import { length } from '~/services/util'
import './LibraryModuleCard.scss'

class Edit extends React.PureComponent {
  constructor(props) {
    super(props)

    const { data } = props
    const type = find(propEq('id', data.card_type_id), LearningModule)

    this.state = {
      name: data.name,
      description: data.data.description,
      type,
      selected: {
        author: [data.author_id],
        department: data.data.department || [],
        competency: data.data.competency || [],
        category: data.data.category || [],
      },
      thumbnail: data.data.thumb_url,
      videoURL: data.data.video_url,
      modules: length(data.children),
      objectives: clone(data.data.objectives) || [],
      questions: data.data.questions || [
        {
          wording: '',
          options: [
            { answer: '', checked: false },
            { answer: '', checked: false },
          ],
        },
      ],
      approval: data.data.action_approval === 'manager',
      perPage: 25,
      current: 1,
    }
  }

  handleInputChange = name => text => {
    this.setState({ [name]: text })
  }

  handleThumbnail = e => {
    this.setState({ thumbnail: e })
  }

  handleVideo = e => {
    this.setState({ video: e[0] })
  }

  handleFile = e => {
    this.setState({ file: e[0] })
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

  handleAddAnswer = e => {
    let questions = clone(this.state.questions)
    questions[e - 1].options.push({ answer: '', checked: false })
    this.setState({ questions })
  }

  handleAddQuestion = () => {
    let questions = clone(this.state.questions)
    questions.push({
      wording: '',
      options: [
        { answer: '', checked: false },
        { answer: '', checked: false },
      ],
    })
    this.setState({ questions })
  }

  handleChangeQuestion = (data, idx) => {
    let questions = clone(this.state.questions)
    questions[idx].wording = data
    this.setState({ questions })
  }

  handleChangeAnswers = (data, idx1, idx2) => {
    let questions = clone(this.state.questions)
    questions[idx1].options[idx2].answer = data
    this.setState({ questions })
  }

  handleChangeChecked = (e, idx1, idx2) => {
    let questions = clone(this.state.questions)
    questions[idx1].options[idx2].checked = e
    this.setState({ questions })
  }

  handleSwitch = e => {
    this.setState({ approval: e })
  }

  handleSelectTags = key => tags => {
    const { selected } = this.state
    if (!equals(selected[key], tags)) {
      selected[key] = tags
      this.setState({ selected })
    }
  }

  handlePreview = () => {
    const data = clone(this.props.data)
    const { name, description, thumbnail, objectives } = this.state
    data.name = name
    data.data.description = description
    data.data.objectives = objectives
    data.data.thumb_url = thumbnail
    const payload = {
      type: 'Preview',
      data: { before: { course: { children: [data] }, module: data, index: 0 }, after: null },
      callBack: null,
    }
    this.props.onModal(payload)
  }

  handleUpdate = published => () => {
    const data = clone(this.props.data)
    const { approval, name, description, thumbnail, videoURL, objectives, selected, file } = this.state

    const isImage = typeof thumbnail.name == 'string'
    const isVideo = typeof videoURL.name == 'string'

    // Validate submission
    if (name.length <= 5) return
    if (description.length <= 10) return

    data.author_id = selected.author[0]
    data.name = name
    data.data.description = description
    data.data.department = selected.department
    data.data.competency = selected.competency
    data.data.category = selected.category
    data.data.action_approval = approval ? 'manager' : 'self'
    data.data.objectives = filter(e => !isEmpty(e))(objectives)
    if (thumbnail && !isImage) {
      data.data.thumb_url = thumbnail
    }
    if (videoURL && !isVideo) {
      data.data.video_url = videoURL
    }

    const payload = { template: { ...data, published } }
    const after = {
      type: 'LIBRARYTEMPLATES_REQUEST',
      payload: { mode: 'modules' },
    }

    this.props.onUpdate(payload, isImage ? thumbnail : null, isVideo ? videoURL : null, null, file, after)
  }

  render() {
    const {
      approval,
      description,
      name,
      objectives,
      selected,
      thumbnail,
      type,
      videoURL,
      questions,
      perPage,
      current,
    } = this.state
    const { authors, departments, competencies, categories, history, userRole, onCardMenu } = this.props
    const showAttachment = !['Video', 'Quiz'].includes(type.label)
    const isPPT = ['Study', 'Presentation'].includes(type.label)

    return (
      <>
        <Filter aligns={['left', 'right']} backTitle="all modules" onBack={() => history.goBack()} />
        <div className="library-module-card border-5" data-cy="editModuleform">
          <div className="detail-content">
            <div className="d-flex justify-content-between my-3">
              <span className="dsl-b22 bold" data-cy="editItemTitle">{`Edit ${type.label} Module`}</span>
              <EditDropdown
                options={LibraryCardEditMenu[userRole]}
                onChange={onCardMenu}
                dataCy="moduleEditTopThreedot"
              />
            </div>
            <div className="d-flex mt-3">
              <div>
                <p className="dsl-m12 mb-1">Module image</p>
                <Thumbnail
                  src={thumbnail}
                  dataCy="thumbnail"
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
                  dataCy="moduleTitle"
                  placeholder="Type here..."
                  value={name}
                  direction="vertical"
                  onChange={this.handleInputChange('name')}
                />
                <span className="title-font">Module description</span>
                <ReactQuill
                  className="module-text d-flex-1"
                  title="Module description"
                  dataCy="moduleDescription"
                  placeholder="Type here..."
                  theme="snow"
                  value={description}
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
                    dataCy="videoUpload"
                    title="Upload video file"
                    icon="fal fa-file-upload"
                    color="#376caf"
                    size={16}
                    onDrop={this.handleVideo}
                  />
                </div>
                <div className="d-flex-1">
                  <p className="dsl-m12 mb-1">Or place the video link</p>
                  <Input
                    className="video-url"
                    placeholder="Type here..."
                    dataCy="videoUrl"
                    direction="vertical"
                    value={videoURL}
                    onChange={e => this.setState({ videoURL: e })}
                  />
                </div>
              </div>
            )}

            <div className="d-flex mt-3">
              {showAttachment && (
                <div className="d-flex-1">
                  <p className="dsl-m12 mb-1">File</p>
                  <Upload
                    title={`Upload ${isPPT ? 'PPT' : ''} file`}
                    icon="fal fa-file-upload"
                    dataCy="fileUpload"
                    color="#376caf"
                    accept={isPPT ? '.ppt, .pptx, .pot, .potx, .odp' : ''}
                    size={16}
                    onDrop={this.handleFile}
                  />
                </div>
              )}
              {type.label === 'Scorm' && (
                <Input
                  className="video-url ml-4"
                  dataCy="scormLink"
                  placeholder="Paste scorm link..."
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
                  key={`objectives${index}`}
                  dataCy={`learningObjectiveInput${index}`}
                  value={item}
                  placeholder="Type here..."
                  direction="vertical"
                  onChange={this.handleObjectiveChange(index)}
                />
                <Button dataCy="trashIcon" className="ml-auto" type="link" onClick={this.handleObjectiveDelete(index)}>
                  <Icon name="far fa-trash-alt" size={14} color="#376caf" />
                </Button>
              </div>
            ))}
            <Button dataCy="addObjectiveBtn" className="ml-auto" type="link" onClick={this.handleObjectiveAdd}>
              <Icon name="far fa-plus" size={14} color="#376caf" />
              <span className="dsl-p14 text-400 ml-1">ADD OBJECTIVE</span>
            </Button>
            {type.label === 'Quiz' && (
              <>
                {questions.map((item, index) => {
                  if (index < perPage * current && index >= perPage * (current - 1)) {
                    return (
                      <Question
                        key={index}
                        index={index + 1}
                        dataCy={`question${index}`}
                        question={item.wording}
                        answers={item.options}
                        onAddAnswer={this.handleAddAnswer}
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
                    dataCy="modulePagination"
                    pers={[]}
                    total={Math.ceil(questions.length / perPage)}
                    onChange={current => this.setState({ current })}
                  />
                  <Button dataCy="addQuestion" className="ml-auto" type="medium" onClick={this.handleAddQuestion}>
                    <Icon name="far fa-plus" size={14} color="#376caf" />
                    <span className="dsl-p14 text-400 ml-1">ADD QUESTION</span>
                  </Button>
                </div>
              </>
            )}

            <Accordion className="settings" expanded>
              <Row className="mt-2">
                <Col sm={6}>
                  <p className="dsl-m12 my-2">Time to complete</p>
                  <Dropdown
                    data={TimeIntervals}
                    dataCy="timeInterval"
                    defaultIndexes={[0]}
                    align="right"
                    width={100}
                    getValue={item => item['label']}
                  />
                </Col>
                <Col sm={6}>
                  <Toggle
                    checked={approval}
                    title="Manager approval"
                    dataCy="manageApproval"
                    leftLabel="Off"
                    rightLabel="On"
                    onChange={this.handleSwitch}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col xs={12} sm={6} className="my-3">
                  <Dropdown
                    title="Author"
                    dataCy="author"
                    direction="vertical"
                    width="fit-content"
                    data={authors}
                    getValue={e => e.name}
                    defaultIds={selected.author}
                    onChange={this.handleSelectTags('author')}
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
                    defaultIds={selected.department}
                    onChange={this.handleSelectTags('department')}
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
                    defaultIds={selected.competency}
                    onChange={this.handleSelectTags('competency')}
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
                    defaultIds={selected.category}
                    onChange={this.handleSelectTags('category')}
                  />
                </Col>
              </Row>
            </Accordion>

            <div className="d-flex float-right mt-4">
              {type.label !== 'Quiz' && (
                <Button type="medium" dataCy="previewBtn" name="Preview" busy={false} onClick={this.handlePreview} />
              )}
              <Button dataCy="saveDraftBtn" className="ml-3" name="Save Draft" onClick={this.handleUpdate(0)} />
              <Button dataCy="savePublishBtn" className="ml-3" name="Save & Publish" onClick={this.handleUpdate(1)} />
            </div>
          </div>
        </div>
      </>
    )
  }
}

Edit.propTypes = {
  userRole: PropTypes.number,
  data: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCardMenu: PropTypes.func,
}

Edit.defaultProps = {
  userRole: 1,
  data: {},
  onUpdate: () => {},
  onCardMenu: () => {},
}

export default Edit
