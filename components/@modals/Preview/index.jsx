import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, Row, Col } from 'react-bootstrap'
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import moment from 'moment'
import { equals, length, is, isEmpty, isNil, find, propEq, filter, clone } from 'ramda'
import {
  Avatar,
  ErrorBoundary,
  Icon,
  Button,
  Upload,
  LearnChildQuiz as Quiz,
  CheckIcon,
  EmployeeDropdown,
} from '@components'
import { CardType, FileType, KEYS } from '~/services/config'
import { youtubeURL, convertUrl, validateUrl, avatarBackgroundColor, urlify } from '~/services/util'
import Presentation from './presentation'
import './Preview.scss'

class Preview extends Component {
  state = {
    ended: this.props.card.status > 2,
    started: false,
    isUploading: false,
    files: [],
    uploadFile: {},
    playing: false,
    enabled: false,
    played: this.props.videoState.played,
    playedSeconds: this.props.videoState.playedSeconds,
    presentIndex: 0,
    isLightboxOpen: false,
    attendance: this.props.attendance,
    attendees: [],
    prevModule: this.props.prevModule,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)

    const { card } = this.props
    if (is(Object, card.data.thumb_url)) {
      const reader = new FileReader()
      reader.onload = e => {
        var image = document.getElementById('image-view')
        image.src = e.target.result
      }
      reader.readAsDataURL(card.data.thumb_url)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.card.id !== this.props.card.id) {
      const { videoState } = this.props
      this.setState({
        isUploading: false,
        files: [],
        played: videoState.played,
        playedSeconds: videoState.playedSeconds,
      })
    } else if (this.state.isUploading) {
      const file = {
        name: this.state.uploadFile.name,
        preview: this.state.uploadFile.preview,
        size: this.state.uploadFile.size,
        type: this.state.uploadFile.type,
        url: this.props.attachedURL,
      }
      const files = [...this.state.files, file]
      this.setState({ isUploading: false, files })
    }
  }

  handleStateChange = state => {
    const { ended, started, attendance } = this.state
    const { card, onUpdate } = this.props
    if (card.card_type_id === 7) {
      state === 'ended' && attendance && this.handleCredit()
      if (state === 'ended' && !ended && started) {
        this.setState({ ended: true, started: false, playing: false })
        if (card.status < 3) {
          onUpdate('completed')
        }
      }
    }
  }

  handleProgress = state => {
    const { playing } = this.state
    if (playing) {
      this.setState(state)
      this.props.onVideoState(state)
    }
  }

  handleDrop = file => {
    if (file?.length === 0) return
    const payload = { attachment_hash: this.props.card.data.attachment_hash, file: file[0] }
    this.props.onUpload(payload)
    this.setState({ isUploading: true, uploadFile: file[0] })
  }

  handleRemove = index => {
    const { files } = this.state
    const upload = [...files.slice(0, index), ...files.slice(index + 1)]
    this.setState({ files: upload })
  }

  replay() {
    const { started, played } = this.state
    const { onUpdate, videoState, card, onResetQuiz } = this.props
    this.setState({ ended: false })
    if (!started) {
      this.setState({ started: true, playing: true })
    }
    if (card.status === 0) {
      onUpdate('started')
    } else {
      if (card.card_type_id === 5) onResetQuiz(card)
    }
    if (this.player && videoState.card_type_id === card.card_type_id && videoState.id === card.id) {
      if (played < 0.9) this.player.seekTo(played)
    }
  }

  handleReplay = () => {
    this.handleStart()
    this.props.onRate()
  }

  handleGoLockModule = () => {
    this.props.onGoLockModule()
  }

  handleSave = () => {
    this.props.onSave()
  }

  handleStart = () => {
    const { started } = this.state
    const { card, userId } = this.props
    if (card.card_type_id === 5 && card.user_id !== userId) {
      toast.error(`Sorry, only the assignee can complete the quiz.`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }
    if (!started) this.setState({ started: true })
    if (card.card_type_id === 7) this.replay()
    if (card.card_type_id === 15) this.setState({ ended: false, presentIndex: 0 })
    if (card.status === 0 || card.status === 2) this.props.onUpdate('started')
  }

  handleFinished = () => {
    this.setState({ ended: true, started: false })
    const { files, attendance } = this.state
    const { card, onNewAttach, onUpdate, onSave } = this.props
    const len = files?.length
    if (len !== 0 && card.card_type_id === 3) {
      const attachments = []
      for (let index = 0; index < len; index++) {
        attachments.push(files[index].url)
      }
      onNewAttach(attachments)
    }
    card.status !== 3 && onUpdate('completed')
    attendance && this.handleCredit()
    onSave()
  }

  playerRef = player => {
    this.player = player
  }

  handleEnableRequestChange = () => {
    const { enabled } = this.state
    this.setState({ enabled: !enabled })
  }

  handlePassed = passed => {
    if (passed === 1) {
      this.props.onUpdate('completed')
      this.setState({ ended: true, started: false })
    } else {
      this.setState({ ended: false, started: false })
    }
  }

  handleComplete = () => {
    const { card, onUpdate } = this.props
    this.setState({ ended: true, started: false })
    this.state.attendance && this.handleCredit()
    !equals(card.status, 3) && onUpdate('completed')
  }

  handleUpdate = () => {
    this.setState({ ended: true, started: false })
    this.state.attendance && this.handleCredit()
    this.props.onUpdate('completed')
  }

  handleOnPrevious = () => {
    this.setState({ ended: false, started: false, playing: false })
    this.props.onPrevious()
  }

  handleOnNext = () => {
    this.setState({ ended: false, started: false, playing: false })
    this.props.onNext()
  }

  handleKeyDown = e => {
    e.stopPropagation()
    const { card_type_id } = this.props.card
    if (equals(card_type_id, 15)) {
      // presentation card
      switch (e.keyCode) {
        case KEYS.LEFT_ARROW:
          this.handleChangePresentImage('prev')
          break

        case KEYS.RIGHT_ARROW:
          this.handleChangePresentImage('next')
          break

        case KEYS.SPACE:
          this.handleChangePresentImage('next')
          break

        default:
          break
      }
    }
  }

  handleSubmit = () => {
    const { files } = this.state
    const { card } = this.props
    const attachment_required = card.data.attachment_required

    attachment_required && files?.length === 0
      ? toast.error('You are required to upload your attachment of your work before you can request approval', {
          position: toast.POSITION.TOP_CENTER,
        })
      : this.handleComplete()
  }

  handleRightClick = event => {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  handleChangePresentImage = event => {
    const { card } = this.props
    const { presentIndex, attendance } = this.state
    const { presentation_images } = card.data
    if (isNil(presentation_images) || isEmpty(presentation_images)) return

    const imageLen = length(presentation_images)
    if (event === 'prev') {
      if (!equals(presentIndex, 0)) {
        this.setState({ presentIndex: (presentIndex + imageLen - 1) % imageLen })
      }
    } else {
      if (equals(presentIndex + 1, imageLen)) {
        this.setState({ ended: true, isLightboxOpen: false })
        attendance && this.handleCredit()
        !equals(card.status, 3) && this.props.onUpdate('completed')
      } else {
        this.setState({ presentIndex: (presentIndex + 1) % imageLen })
      }
    }
  }

  handleSelectedAttendees = attendees => {
    this.setState({ attendees })
  }

  handleClearAttendee = id => {
    const attendees = filter(x => x !== id, this.state.attendees)
    this.setState({ attendees })
  }

  handleSaveRecord = () => {
    const { attendees } = this.state
    const { course, userId } = this.props
    if (isNil(course) || equals(course.id, 0) || !equals(course.card_type_id, 1)) {
      toast.error('Invalid course!', { position: toast.POSITION.TOP_CENTER })
      return
    }
    const payload = {
      user_id: [...attendees, userId],
      card_template_id: course.id,
      card_type: 'courses',
      due_date: moment().format('YYYY-MM-DD'),
    }
    const attendance = { course, users: [...attendees, userId] }
    this.props.onAssign(payload, attendance)
    this.props.onClose()
  }

  handleCredit = () => {
    const { index, course } = this.props
    const card = { ...course.children[index], status: 3 }
    let data = clone(course)
    data.children[index] = card

    this.props.onModal({
      type: null,
      data: { before: { course: data, module: card, index }, after: null },
      callBack: null,
    })
  }

  render() {
    const {
      ended,
      started,
      files,
      playing,
      enabled,
      presentIndex,
      isLightboxOpen,
      attendance,
      attendees,
      prevModule,
    } = this.state
    const { lockModule, isFirstModule, isLastModule, course, index, userId, managerId, allEmployees } = this.props
    const card = attendance ? course.children[index] : this.props.card
    const type = card.card_type_id
    const status = card.status
    const action = card.data.action_approval
    const hasManager = !isNil(managerId) && !equals(managerId, 0)
    const attachment_required = card.data.attachment_required
    const programId = card.program_id
    const assignedBy = card.assigned_by
    const youtubeID = youtubeURL(card.data.video_url)
    const videoURL = youtubeID ? `https://www.youtube.com/watch?v=${youtubeID}` : convertUrl(card.data.video_url)
    const employees = filter(x => x.id !== userId && x.id !== null, allEmployees)

    return (
      <>
        <ErrorBoundary className="preview-modal border-5 m-0">
          {!isFirstModule && (
            <Button type="link" className="left-arrow desktop" onClick={this.handleOnPrevious}>
              <Icon name="fas fa-chevron-circle-left" size={23} color="#fff" />
            </Button>
          )}
          {!isLastModule && (
            <Button type="link" className="right-arrow desktop" onClick={this.handleOnNext}>
              <Icon name="fas fa-chevron-circle-right" size={23} color="#fff" />
            </Button>
          )}
          {!isFirstModule && (
            <Button type="link" className="left-arrow mobile d-none" onClick={this.handleOnPrevious}>
              <Icon name="fas fa-chevron-circle-left" size={23} color="#fff" />
            </Button>
          )}
          {!isLastModule && (
            <Button type="link" className="right-arrow mobile d-none" onClick={this.handleOnNext}>
              <Icon name="fas fa-chevron-circle-right" size={23} color="#fff" />
            </Button>
          )}
          <Row>
            <Col>
              <div className="d-flex p-3 ml-2 mt-1">
                <CheckIcon size={21} checked={status === 3} />
                <div className="justify-content-between module-status align-items-center">
                  <p className={classNames('dsl-m16 mb-2 custom-font', status === 3 && 'text-line-through')}>
                    <b>{card.data.name || card.name}</b>
                  </p>
                  <p className="dsl-m12 mb-0 align-items-center">
                    <Icon name={CardType[type].alias} color="#c3c7cc" size={12} />
                    &nbsp;&nbsp;
                    {isNil(programId)
                      ? assignedBy === userId
                        ? 'Self Assigned'
                        : 'Manager Assigned'
                      : `Program Assigned : `}
                  </p>
                </div>
              </div>
              <div
                className={
                  card.data.objectives?.length > 0 && !isEmpty(card.data.objectives[0])
                    ? 'col-md-12 col-xs-12 px-0'
                    : 'px-0'
                }
              >
                <div className="position-relative">
                  <div className={classNames('media-content', type === 7 && 'video-container')}>
                    {type === 7 && (
                      <ReactPlayer
                        id="ds-video"
                        ref={this.playerRef}
                        playing={playing}
                        url={videoURL}
                        controls
                        width="100%"
                        height="100%"
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload',
                              poster: card.data.thumb_url,
                            },
                          },
                          youtube: {
                            playerVars: {
                              autoplay: 0,
                              playsinline: 1,
                              showinfo: 0,
                              rel: 0,
                            },
                          },
                        }}
                        onStart={() => this.handleStateChange('started')}
                        onEnded={() => this.handleStateChange('ended')}
                        onProgress={this.handleProgress}
                        className="video-player"
                        onContextMenu={this.handleRightClick}
                      />
                    )}
                    {type === 15 && (
                      <Presentation
                        index={presentIndex}
                        isOpen={isLightboxOpen}
                        images={card.data.presentation_images || [card.data.thumb_url]}
                        onOpen={() => this.setState({ isLightboxOpen: true })}
                        onClose={() => this.setState({ isLightboxOpen: false })}
                        onPrev={() => this.handleChangePresentImage('prev')}
                        onNext={() => this.handleChangePresentImage('next')}
                      />
                    )}
                    {type !== 7 && type !== 15 && is(String, card.data.thumb_url) && (
                      <Image className="border-5 d-flex-1" src={card.data.thumb_url || '/images/no-image.jpg'} />
                    )}
                    {type !== 7 && type !== 15 && is(Object, card.data.thumb_url) && (
                      <img id="image-view" className="border-5 d-flex-1" />
                    )}
                  </div>
                  {(ended || (!started && equals(status, 3))) && card.locked === 0 && (
                    <div className="overlay completed">
                      <div className="d-flex justify-content-center align-items-center h-100 completed-view">
                        <Button
                          type="link"
                          className="controls align-items-center color-white"
                          onClick={this.handleReplay}
                        >
                          <Icon name="far fa-redo-alt" size={30} color="#fff" />
                          &nbsp; <div className="btn-text">Replay</div>
                        </Button>
                        <Button className="controls align-items-center color-white" onClick={this.handleSave}>
                          <Icon name="fal fa-times" size={30} color="#fff" />
                          &nbsp; <div className="btn-text">Save & Exit</div>
                        </Button>
                        <Button className="controls align-items-center color-white" onClick={this.handleOnNext}>
                          <Icon
                            name={`fas ${isLastModule ? 'fa-graduation-cap' : 'fa-arrow-alt-right'}`}
                            size={30}
                            color="#fff"
                          />
                          &nbsp;&nbsp;
                          <div className="btn-text">{isLastModule ? 'Finish Course' : 'Next Module'}</div>
                        </Button>
                      </div>
                    </div>
                  )}
                  {!started && !ended && status < 3 && card.locked !== 1 && (
                    <div className="overlay-start overlay d-center" onClick={this.handleStart}>
                      <div className="d-flex flex-column align-items-center">
                        <div className="module-type-container">
                          {type == 7 ? (
                            <Icon name="fal fa-play-circle" color="#fff" size={55} />
                          ) : (
                            <Icon name={CardType[type].alias} color="#fff" size={35} />
                          )}
                        </div>
                        <div className="py-2 px-5 cursor-pointer">
                          <p className="mb-0 dsl-b18 color-white mx-4 text-center">Start</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {card.locked === 1 && (
                    <div className="overlay d-center dsl-w12 unlock-text">
                      {!isNil(lockModule) && lockModule.status === 3 && card.data.delay_days !== 0 ? (
                        <p className="delay-text">
                          Sorry, this module is still locked. Please wait for {card.data.delay_days}
                          days.
                        </p>
                      ) : (
                        <div className="unlock-content">
                          <div className="icon-text">
                            <Icon name="fas fa-lock-alt mb-2 mobile-screen mb-2" color="#333f4b" size={20} />
                            <Icon name="fas fa-lock-alt mb-2 desktop-screen" color="#333f4b" size={30} />
                            <p className="dsl-w14 mt-1 custom-text-color">Module is Locked</p>
                          </div>
                          <p className="bottom-text">
                            <span className="pb-2">
                              Please complete&nbsp;&nbsp;
                              <a
                                onClick={this.handleGoLockModule}
                                className="cursor-pointer text-underline text-primary"
                              >
                                &quot;{prevModule.name}&quot;
                              </a>
                              &nbsp;&nbsp;module
                              <br />
                            </span>
                            <span>before you proceed</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {started && type === 3 && (
                  <div className="action-container px-3 pb-1">
                    <p className="dsl-b16 mt-4 mb-2">
                      <strong>Once Completed:</strong>
                    </p>
                    {attachment_required && (
                      <div>
                        <div className="justify-content-end d-flex align-items-center mb-1 flex-column flex-md-row">
                          <Upload onDrop={this.handleDrop} title="Upload" />
                          <p className="dsl-b14 mb-0">a supporting files and request approval from your manager</p>
                        </div>
                        <p className="dsl-d12 mt-1">Drop your files here, or click to select files to upload.</p>
                      </div>
                    )}
                    <aside className="w-100">
                      <div className="align-items-start d-flex flex-column mt-2">
                        {files?.length !== 0 && <CheckIcon checked color="#343f4b" size={17} />}
                        <div className="d-flex flex-column">
                          {files?.map((f, index) => (
                            <div key={`${f.name}-${index}`} className="align-items-center d-flex w-100">
                              <Icon name={FileType[f.type].alias} color="#343f4b" size={17} />
                              <p className="mb-0">{f.name}</p>
                              <Button type="link" className="flex-grow-1" onClick={() => this.handleRemove(index)}>
                                <Icon name="far fa-times" color="#376CAF" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <span className="my-2 d-flex cursor-pointer" onClick={this.handleEnableRequestChange}>
                        <CheckIcon checked={enabled} size={17} />
                        <p className="dsl-b14 text-left">
                          I have studied the material to be knowledgable about its contents and apply the learning to my
                          work.
                        </p>
                      </span>
                      <div className="justify-content-end">
                        <Button
                          className="ml-auto"
                          disabled={!enabled}
                          name={action === 'manager' && hasManager ? 'Request Approval' : 'Complete'}
                          onClick={this.handleSubmit}
                        />
                      </div>
                    </aside>
                  </div>
                )}
                {started && (type === 5 || type === 16) && (
                  <Quiz quizId={card.data.assessment_id} name={card.data.name} onFinish={this.handlePassed} />
                )}
                {started && type === 14 && (
                  <div className="bg-light p-4">
                    <p className="dsl-p16 mt-2 bold text-center">{card.data.name}</p>
                    <p className="dsl-b14 mb-4 text-center">You need to read it carefully</p>
                    <div dangerouslySetInnerHTML={{ __html: card.data.study_content }} />
                    <div className="my-5">
                      <p className="dsl-b14 mb-4 text-center">
                        I have studied the material to be knowledgable about its contents and apply the learning to my
                        work.
                      </p>
                      <div className="text-center d-flex-1">
                        <Button onClick={this.handleUpdate} name="Im Finished" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row className="p-3 ml-2">
            <Col md={9} sm={12} className="border-right p-0">
              <p className="dsl-b14 mt-2" dangerouslySetInnerHTML={{ __html: urlify(card.data.description) }} />
              <div className="body pr-0">
                <p className="dsl-m14 text-400 my-2">
                  <strong>Learning Objectives</strong>
                </p>
                {card.data.objectives?.map((el, index) => (
                  <div className={classNames('d-flex mb-2', card.locked !== 0 && 'pointer-none')} key={el + index}>
                    <div className="img-circle bg-primary d-center circle">{index + 1}</div>
                    <p className="dsl-b14 pl-2 m-0 w-100 pt-1">{el}</p>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={3} sm={12}>
              <p className="dsl-m14 text-400 mt-2">
                <strong>Downloads</strong>
              </p>
              {card.data.attachments?.length > 0 && (
                <div className={classNames(!validateUrl(card.data.attachments) && 'opacity-5 pointer-none')}>
                  <Icon name="fas fa-file-pdf px-2" color="#376CAF" size={12} />
                  <a className="dsl-b14" href={card.data.attachments} target="_blank">
                    {card.data.name || card.name}
                  </a>
                </div>
              )}
              {card.data.attachments?.length === 0 && <p className="dsl-b12">No attachment/download</p>}
            </Col>
          </Row>
        </ErrorBoundary>
        {attendance && (
          <div className="preview-modal border-5 m-0 mt-2">
            <div className="py-2 border-bottom">
              <p className="dsl-b20 bold mb-2">Attendance</p>
              <p className="dsl-m12">The Meaning of Our Mission</p>
            </div>
            <div className="d-flex align-items-start py-3">
              <p className="dsl-m12 my-3">Attendees</p>
              <div className="w-100">
                {attendees?.length > 0 && (
                  <Row className="m-0 px-3 py-2">
                    {attendees.map(userId => {
                      const user = find(propEq('id', userId), employees)
                      if (isNil(user)) return null
                      const { id, profile } = user
                      const url = convertUrl(profile.avatar, '/images/default.png')
                      return (
                        <Col sm={3} xs={6} key={id} className="d-flex align-items-center py-2">
                          <Avatar
                            url={url}
                            type="initial"
                            name={`${profile.first_name} ${profile.last_name}`}
                            backgroundColor={avatarBackgroundColor(id)}
                          />
                          <p className="dsl-b14 mb-0 ml-2">{`${profile.first_name} ${profile.last_name}`}</p>
                          <Button type="link" className="btn-clear" onClick={() => this.handleClearAttendee(id)}>
                            <Icon name="fal fa-times" size={14} />
                          </Button>
                        </Col>
                      )
                    })}
                  </Row>
                )}
                <EmployeeDropdown
                  noArrow
                  label="+ ADD ATTENDEE"
                  employees={employees}
                  selectedUsers={attendees}
                  onSelected={this.handleSelectedAttendees}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button disabled={isEmpty(attendees)} onClick={this.handleSaveRecord}>
                SAVE & RECORD
              </Button>
            </div>
          </div>
        )}
      </>
    )
  }
}

Preview.propTypes = {
  userId: PropTypes.number,
  attendance: PropTypes.bool,
  managerId: PropTypes.number,
  index: PropTypes.number,
  card: PropTypes.any.isRequired,
  course: PropTypes.shape({
    id: PropTypes.number,
    card_type_id: PropTypes.number,
  }),
  attachedURL: PropTypes.string,
  videoState: PropTypes.any,
  allEmployees: PropTypes.array,
  trackName: PropTypes.string,
  lockModule: PropTypes.any,
  onResetQuiz: PropTypes.func,
  onAssign: PropTypes.func,
  onClose: PropTypes.func,
  onModal: PropTypes.func,
}

Preview.defaultProps = {
  userId: 0,
  attendance: false,
  managerId: 0,
  card: {},
  index: 0,
  course: {
    id: 0,
    card_type_id: 0,
  },
  attachedURL: '',
  trackName: 'New Hire Orientation',
  lockModule: null,
  videoState: {},
  allEmployees: [],
  onPrevious: () => {},
  onNext: () => {},
  onRate: () => {},
  onSave: () => {},
  onUpdate: () => {},
  onGoLockModule: () => {},
  onResetQuiz: () => {},
  onAssign: e => {},
  onClose: () => {},
  onModal: () => {},
}

export default Preview
