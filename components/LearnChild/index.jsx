import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Media, Image } from 'react-bootstrap'
import ReactPlayer from 'react-player'
import { equals, length, split, isEmpty, isNil } from 'ramda'
import Dropzone from 'react-dropzone'
import { toast } from 'react-toastify'
import { Icon, LearnChildQuiz as Quiz } from '@components'
import { CardType, CardStatus, FileType } from '~/services/config'
import './LearnChild.scss'

class LearnChildModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ended: props.card.status > 2,
      started: false,
      isUploading: false,
      files: [],
      uploadFile: {},
      playing: false,
      enableRequest: false,
      played: props.videoState.played,
      playedSeconds: props.videoState.playedSeconds,
    }
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

  // Video module
  handleStateChange(state) {
    const { ended, started } = this.state
    const { card, onUpdate } = this.props
    if (equals(card.card_type_id, 7)) {
      if (equals(state, 'ended') && !ended && started) {
        this.setState({ ended: true, started: false, playing: false })
        if (card.status < 3) {
          onUpdate('completed')
        }
      }
    }
  }

  handleProgress(state) {
    const { playing } = this.state
    if (playing) {
      this.setState(state)
      this.props.onVideoState(state)
    }
  }

  // Action module
  handleDrop(file) {
    if (equals(length(file), 0)) {
      return
    }
    const payload = {
      attachment_hash: this.props.card.data.attachment_hash,
      file: file[0],
    }
    this.props.onUpload(payload)
    this.setState({ isUploading: true, uploadFile: file[0] })
  }

  remove(index) {
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
    if (equals(card.status, 0)) {
      onUpdate('started')
    } else {
      if (equals(card.card_type_id, 5)) {
        // quiz module
        onResetQuiz(card)
      }
    }
    if (this.player && equals(videoState.card_type_id, card.card_type_id) && equals(videoState.id, card.id)) {
      if (played < 0.9) {
        this.player.seekTo(played)
      }
    }
  }

  onStart() {
    const { started } = this.state
    const { card, onUpdate } = this.props
    if (!started) {
      this.setState({ started: true })
    }
    if (equals(card.card_type_id, 7)) {
      this.replay()
    }
    if (equals(card.status, 0) || equals(card.status, 2)) {
      onUpdate('started')
    }
  }

  onFinished() {
    this.setState({ ended: true, started: false })
    const { files } = this.state
    const { card, onNewAttach, onUpdate, onSave } = this.props
    const len = length(files)
    if (!equals(len, 0) && equals(card.card_type_id, 3)) {
      const attachments = []
      for (let index = 0; index < len; index++) {
        attachments.push(files[index].url)
      }
      onNewAttach(attachments)
    }
    !equals(card.status, 3) && onUpdate('completed')
    onSave()
  }

  playerRef = player => {
    this.player = player
  }

  handleComplete() {
    const { card, onUpdate } = this.props
    this.setState({ ended: true, started: false })
    !equals(card.status, 3) && onUpdate('completed')
  }

  handleSubmit() {
    const { files } = this.state
    const { card } = this.props

    const attachment_required = card.data.attachment_required

    attachment_required && equals(length(files), 0)
      ? toast.error('You are required to upload your attachment of your work before you can request approval', {
          position: toast.POSITION.TOP_CENTER,
        })
      : this.handleComplete()
  }

  handleRightClick(event) {
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  render() {
    const { ended, started, files, playing, enableRequest } = this.state
    const {
      onPrevious,
      onNext,
      onSave,
      onRate,
      onUpdate,
      onGoLockModule,
      trackName,
      lockModule,
      isFirstModule,
      isLastModule,
      card,
      userId,
    } = this.props
    const dateString = split('-', split(' ', card.updated_at)[0])
    const statusDate = card.updated_at ? dateString[1] + '/' + dateString[2] + '/' + dateString[0].substr(2, 2) : ''
    const type = card.card_type_id
    const status = card.status
    const attachment_required = card.data.attachment_required
    const programId = card.program_id
    const assignedBy = card.assigned_by

    return (
      <div className="learn-child border-5 m-0">
        {!isFirstModule && (
          <Button
            variant="link"
            className="left-arrow desktop"
            onClick={() => {
              this.setState({ ended: false, started: false, playing: false })
              onPrevious()
            }}
          >
            <Icon name="far fa-chevron-circle-left" size={42} color="#fff" />
          </Button>
        )}
        {!isLastModule && (
          <Button
            variant="link"
            className="right-arrow desktop"
            onClick={() => {
              this.setState({ ended: false, started: false, playing: false })
              onNext()
            }}
          >
            <Icon name="far fa-chevron-circle-right" size={42} color="#fff" />
          </Button>
        )}
        {!isFirstModule && (
          <Button
            variant="link"
            className="left-arrow mobile d-none"
            onClick={() => {
              this.setState({ ended: false, started: false, playing: false })
              onPrevious()
            }}
          >
            <Icon name="far fa-chevron-circle-left" size={42} color="#343f4b" />
          </Button>
        )}
        {!isLastModule && (
          <Button
            variant="link"
            className="right-arrow mobile d-none"
            onClick={() => {
              this.setState({ ended: false, started: false, playing: false })
              onNext()
            }}
          >
            <Icon name="far fa-chevron-circle-right" size={42} color="#fff" />
          </Button>
        )}

        <div className={`align-items-center ${equals(card.locked, 0) ? '' : 'opacity-5'}`}>
          <div className="align-items-center">
            <Icon
              size={30}
              name={`${equals(status, 3) ? 'fal fa-check-circle' : 'far fa-circle'} mr-2`}
              color="#969faa"
            />
          </div>
          <div className="justify-content-between module-status">
            <div>
              <p className="dsl-d14 mb-0 align-items-center">
                <Icon name={CardType[type].alias} color="#c3c7cc" size={15} />
                &nbsp;&nbsp;
                {isNil(programId)
                  ? equals(assignedBy, userId)
                    ? 'Self Assigned'
                    : 'Manager Assigned'
                  : `Program Assigned : `}
              </p>
              <p className={`dsl-b16 mb-0 ${equals(status, 3) && 'text-line-through'}`}>
                <strong>{card.data.name || card.name}</strong>
              </p>
            </div>
            <div className="">
              {equals(card.locked, 0) ? (
                <p className="dsl-d14 mb-0 text-capitalize text-right">{CardStatus[status]}</p>
              ) : (
                <p className="dsl-d14 mb-0">Locked</p>
              )}
              {equals(card.locked, 0) && !equals(status, 0) && <p className="dsl-d14 mb-0 text-right">{statusDate}</p>}
            </div>
          </div>
        </div>
        <Media>
          <Media.Left
            className={
              length(card.data.objectives) > 0 && !isEmpty(card.data.objectives[0]) ? 'col-md-8 col-xs-12 px-0' : 'px-0'
            }
          >
            <div className="position-relative">
              <div className={`media-content ${equals(type, 7) ? 'video-container' : ''}`}>
                {equals(type, 7) ? (
                  <ReactPlayer
                    id="ds-video"
                    ref={this.playerRef}
                    playing={playing}
                    url={card.data.video_url}
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
                        playerVars: { showinfo: 1 },
                        preload: true,
                      },
                    }}
                    onStart={() => this.handleStateChange('started')}
                    onEnded={() => this.handleStateChange('ended')}
                    onProgress={e => this.handleProgress(e)}
                    className="video-player"
                    onContextMenu={e => this.handleRightClick(e)}
                  />
                ) : (
                  <Image
                    className="border-5"
                    src={card.data.thumb_url ? card.data.thumb_url : '/images/no-image.jpg'}
                  />
                )}
              </div>
              {(ended || (!started && equals(status, 3))) && equals(card.locked, 0) && (
                <div className="overlay completed">
                  <div className="h-100 d-flex">
                    <div className="col-xs-4 align-items-center justify-content-center">
                      <Button className="controls align-items-center color-white" onClick={() => this.replay()}>
                        <Icon name="far fa-redo-alt" size={30} color="#fff" />
                        &nbsp; Replay
                      </Button>
                    </div>
                    {/* <div className="w-50 align-items-center justify-content-center">
                        <Button
                          variant="link"
                          className="align-items-center color-white"
                          onClick={() => onRate()}
                        >
                          <Icon name="far fa-redo-alt" size={30} color="#fff" />
                          Rate Module
                        </Button>
                      </div> */}
                    <div className="col-xs-4 align-items-center justify-content-center">
                      <Button className="controls align-items-center color-white" onClick={() => onSave()}>
                        <Icon name="fal fa-times" size={30} color="#fff" />
                        &nbsp; Save & Exit
                      </Button>
                    </div>
                    <div className="col-xs-4 align-items-center justify-content-center">
                      <Button
                        className="controls align-items-center color-white"
                        onClick={() => {
                          this.setState({ ended: false })
                          onNext()
                        }}
                      >
                        <Icon
                          name={`fas ${isLastModule ? 'fa-graduation-cap' : 'fa-arrow-alt-right'} mr-3`}
                          size={30}
                          color="#fff"
                        />
                        {isLastModule ? 'Finish Course' : 'Next Module'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {!started && !ended && status < 3 && (
                <div className="overlay justify-content-center align-items-center">
                  <div className="d-flex flex-column align-items-center">
                    <div className="module-type-container bg-primary rounded-circle m-4">
                      <Icon name={CardType[type].alias} color="#fff" size={35} />
                    </div>
                    <div className="bg-primary rounded-circle py-2 px-5 cursor-pointer" onClick={() => this.onStart()}>
                      <p className="mb-0 dsl-b18 color-white mx-4 text-center">Start</p>
                    </div>
                  </div>
                </div>
              )}
              {equals(card.locked, 1) && (
                <div className="overlay bg-white align-items-center justify-content-center">
                  {!isNil(lockModule) && equals(lockModule.status, 3) && !equals(card.data.delay_days, 0) ? (
                    <p>
                      Sorry, this module is still locked. Please wait for {card.data.delay_days}
                      days.
                    </p>
                  ) : (
                    <p>
                      Please complete&nbsp;
                      <a onClick={() => onGoLockModule()} className="cursor-pointer">
                        &laquo; {lockModule.data.name} &raquo;
                      </a>
                      module before you proceed.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className={equals(card.locked, 0) ? '' : 'opacity-5'}>
              {!started && (
                <div>
                  <p className="dsl-b14 mt-4 bold">{card.data.name || card.name}</p>
                  <p className="dsl-b14 mt-2">{card.data.description}</p>
                </div>
              )}
              {started && equals(type, 3) && (
                <div className="action-container">
                  <p className="dsl-b16 mt-4 mb-2">
                    <strong>Once Completed:</strong>
                  </p>
                  {attachment_required && (
                    <Dropzone
                      className="drag-drop"
                      activeClassName="drag-drop active"
                      acceptClassName="drag-drop active"
                      rejectClassName="drag-drop deactivate"
                      onDrop={e => this.handleDrop(e)}
                      accept="image/jpeg, image/png, application/zip, video/mp4, video/x-msvideo, application/pdf"
                      multiple={false}
                    >
                      <div className="justify-content-center">
                        <p className="dsl-p14 text-underline">Upload</p>
                        <p className="dsl-b14">&nbsp;a supporting files and request approval from your manager</p>
                      </div>
                      <p className="dsl-d12 text-center">Drop your files here, or click to select files to upload.</p>
                    </Dropzone>
                  )}
                  <aside>
                    <div className="align-items-center">
                      {!equals(length(files), 0) && <Icon name="fal fa-check-circle" color="#343f4b" size={17} />}
                      {files.map((f, index) => {
                        return (
                          <span key={`${f.name}-${index}`} className="align-items-center">
                            <Icon name={FileType[f.type].alias} color="#343f4b" size={17} />
                            <p className="mb-0">{f.name}</p>
                            <Button variant="link" onClick={() => this.remove(index)}>
                              <Icon name="far fa-times" color="#376CAF" />
                            </Button>
                          </span>
                        )
                      })}
                    </div>

                    <span
                      className="my-4 d-flex cursor-pointer"
                      onClick={() => {
                        this.setState({ enableRequest: !enableRequest })
                      }}
                    >
                      <Icon color="#969faa" size={17} name={enableRequest ? 'fal fa-check-circle' : 'far fa-circle'} />
                      <p className="dsl-b14 text-center">
                        I have studied the material to be knowledgable about its contents and apply the learning to my
                        work.
                      </p>
                    </span>
                    <div className="my-4 justify-content-center">
                      <Button
                        className={`ds-btn ${enableRequest ? 'bg-primary' : 'bg-light-grey'}`}
                        onClick={() => this.handleSubmit()}
                        disabled={!enableRequest}
                      >
                        Request Approval
                      </Button>
                    </div>
                  </aside>
                </div>
              )}
              {started && equals(type, 5) && (
                <Quiz
                  quizId={card.data.assessment_id}
                  name={card.data.name}
                  onFinish={passed => {
                    if (equals(passed, 1)) {
                      this.setState({ ended: true, started: false })
                    } else {
                      this.setState({ ended: false, started: false })
                    }
                  }}
                />
              )}
              {started && equals(type, 14) && (
                <div className="bg-light p-4">
                  <p className="dsl-p16 mt-2 bold text-center">{card.data.name}</p>
                  <p className="dsl-b14 mb-4 text-center">You need to read it carefully</p>
                  <div dangerouslySetInnerHTML={{ __html: card.data.study_content }} />
                  <div className="my-5">
                    <p className="dsl-b14 mb-4 text-center">
                      I have studied the material to be knowledgable about its contents and apply the learning to my
                      work.
                    </p>
                    <div className="text-center w-100">
                      <Button
                        className="ds-btn bg-primary"
                        onClick={() => {
                          this.setState({ ended: true, started: false })
                          onUpdate('completed')
                        }}
                      >
                        Im Finished
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Media.Left>
          {length(card.data.objectives) > 0 && !isEmpty(card.data.objectives[0]) && (
            <div className={`body pl-5 pr-0 col-md-4 col-xs-12 ${equals(card.locked, 0) ? '' : 'opacity-5'}`}>
              <div className="border-bottom mb-2">
                <p className="dsl-p18 mb-4 align-items-center justify-content-center">
                  <Icon name={`${CardType[type].alias} mr-4`} size={23} />
                  {CardType[type].label} Module
                </p>
              </div>
              <p className="dsl-b16 my-2">
                <strong>Learning Objectives</strong>
              </p>
              {card.data.objectives.map((el, index) => {
                return (
                  <div className="d-flex mb-2" key={el + index}>
                    <div className="img-circle bg-primary align-items-center justify-content-center nums-content">
                      {index + 1}
                    </div>
                    <p className="dsl-b14 pl-2">{el}</p>
                  </div>
                )
              })}
              <p className="dsl-b16 mt-4">
                <strong>{`Downloads`}</strong>
              </p>
              {length(card.data.attachments) > 0 ? (
                card.data.attachments.map(link => {
                  ;<div>
                    <span>
                      <Icon name="fas fa-file-pdf" color="#376CAF" size={12} />
                      <a className="dsl-b14">{link}</a>
                    </span>
                  </div>
                })
              ) : (
                <div>
                  <p className="dsl-d12">no attachment/download</p>
                </div>
              )}
            </div>
          )}
        </Media>
      </div>
    )
  }
}

LearnChildModal.propTypes = {
  trackName: PropTypes.string,
  lockModule: PropTypes.any,
  videoState: PropTypes.any,
  onResetQuiz: PropTypes.func,
}

LearnChildModal.defaultProps = {
  trackName: 'New Hire Orientation',
  lockModule: null,
  videoState: {},
  onPrevious: () => {},
  onNext: () => {},
  onRate: () => {},
  onSave: () => {},
  onUpdate: () => {},
  onGoLockModule: () => {},
  onResetQuiz: () => {},
}

const mapStateToProps = state => ({
  attachedURL: state.app.learnUploadURL,
  videoState: state.develop.learnVideoState,
  card: state.develop.learnCurrentModule,
})

export default connect(mapStateToProps, null)(LearnChildModal)
