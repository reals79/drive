import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { Picker, Emoji } from 'emoji-mart'
import { equals, filter, find, includes, isEmpty, isNil, path, prop, propEq, replace, sortBy, split } from 'ramda'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Avatar, Button, CheckBox, EditDropdown, Icon, Input, Text, Upload } from '@components'
import { RecurringType, UserRoles, ProgramStatus, ProgramTypes } from '~/services/config'
import { localDate } from '~/services/util'
import './TaskDetail.scss'

const UnKnownUser = {
  id: 0,
  profile: {
    avatar: null,
    first_name: 'Unknown',
    last_name: 'User',
  },
}

const SystemAssign = {
  id: -1,
  profile: {
    avatar: '/images/robot.png',
    first_name: 'System',
    last_name: 'Assigned',
  },
}

const GeneralProject = {
  id: 166,
  name: 'General',
}

class TaskDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      fileType: 'image',
      preview: null,
      comment: '',
      openEmoji: false,
      checked: props.task.status == 3,
      uploadUrl: props.uploadUrl,
    }

    this.handleDrop = this.handleDrop.bind(this)
    this.handleCommentForm = this.handleCommentForm.bind(this)
    this.handleEmojiInput = this.handleEmojiInput.bind(this)
    this.handleApprove = this.handleApprove.bind(this)
    this.handleDecline = this.handleDecline.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleInputActuals = this.handleInputActuals.bind(this)
    this.handleRequestPromotion = this.handleRequestPromotion.bind(this)
    this.handleCheck = this.handleCheck.bind(this)

    const { id, viewed } = props.task
    props.onFetch(id)
    if (!(viewed === 1)) {
      props.onUpdate('viewed', props.task.id)
    }
  }

  componentDidMount() {
    const { task } = this.props
    if (task.data.program_id) {
      this.props.onFetchProgram(task.data.program_id, null)
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { uploadUrl } = this.props
    if (!equals(uploadUrl, prevProps.uploadUrl)) {
      await this.setState({ uploadUrl: uploadUrl.location, fileType: prevState.file?.type })
      this.handleFileDisplay()
    }
  }

  handleEmojiInput(e) {
    const comment = this.state.comment + e.native
    this.setState({ comment })
  }

  handleDrop(file) {
    if (file.length === 0) return
    this.setState({ preview: file[0].name })
    this.setState({ file: file[0] })
  }

  handleCommentForm() {
    const { file, comment } = this.state
    const { task } = this.props
    if (!isNil(file)) {
      const payload = {
        attachment_hash: null,
        file,
      }
      this.props.onUpload(payload)
    }
    if (!isEmpty(comment)) {
      this.props.onAdd(comment, task.id)
    }
    this.setState({ comment: '', preview: null, openEmoji: false })
  }

  handleFileDisplay = () => {
    const { task } = this.props
    const { uploadUrl, fileType } = this.state
    let url = ''
    if (equals(split('/', fileType)[0], 'application')) {
      url = `<a href=\'${uploadUrl}\' class="text-break">${uploadUrl}</a>`
    } else {
      url = `<a href=\'${uploadUrl}\' download target="_blank"><img src=\'${uploadUrl}\' height="50px" width="50px" /></a>`
    }
    this.props.onAdd(url, task.id)
  }

  handleApprove() {
    const { task, userId, after } = this.props
    const payload = {
      type: 'Comment',
      data: {
        before: {
          title: 'Approve Task',
          body: 'Are you sure you want to approve this task?',
          description: isNil(task.data.approval_id) ? null : 'You can leave your comment here.',
        },
      },
      callBack: {
        onYes: e => {
          if (!isEmpty(e)) {
            if (!isNil(task.data.approval_id)) {
              this.props.onAdd(e, task.data.approval_id)
            }
            this.props.onAdd(e, task.id)
          }
          this.props.onUpdate('completed', task.id, userId, after)
        },
      },
    }
    this.props.onModal(payload)
  }

  handleDecline() {
    const { task } = this.props
    const payload = {
      type: 'Comment',
      data: {
        before: {
          title: 'Decline Task',
          body: 'Are you sure you want to deny this task?',
          description: isNil(task.data.approval_id) ? null : 'You can leave your comment why the task is denied.',
        },
      },
      callBack: {
        onYes: e => {
          if (!isEmpty(e)) {
            if (!isNil(task.data.approval_id)) {
              this.props.onAdd(e, task.data.approval_id)
            }
            this.props.onAdd(e, task.id)
          }
          this.props.onUpdate('denied', task.id)
        },
      },
    }
    this.props.onModal(payload)
  }

  handleSelect(e) {
    const { task } = this.props
    let payload = {}

    if (e === 'edit') {
      const after = this.props.after
        ? this.props.after
        : {
            type: 'FETCHTASKSFEED_REQUEST',
            userId: task.user_id,
            perPage: 500,
            page: 1,
          }
      payload = {
        type: 'Edit Task',
        data: {
          before: {
            card: task,
            after,
          },
        },
        callBack: null,
      }
    } else if (e === 'delete') {
      payload = {
        type: 'Confirm',
        data: {
          before: {
            title: 'Delete',
            body: 'Are you sure you want to delete this item ?',
          },
        },
        callBack: {
          onYes: () => this.props.onDelete(task.id),
        },
      }
    }

    this.props.onClose()
    this.props.onModal(payload)
  }

  handleInputActuals() {
    const { quotas, task, users } = this.props
    const user = find(propEq('id', task.user_id), users) || { profile: {} }
    const date = task.data.actual_at
    const actualDate = moment(date)
    const remainQuotas = filter(x => {
      const { actuals } = x
      let isActual = false
      actuals.forEach(e => {
        if (moment(e.actual_at).isSame(actualDate)) {
          isActual = true
          return
        }
      })
      return !isActual
    }, quotas)
    const scorecard = { id: 0, quotas: remainQuotas }
    this.props.onModal({
      type: 'Save Actuals',
      data: { before: { user, scorecards: [scorecard], date, type: 'programs' }, after: {} },
      callBack: {},
    })
  }

  handleRequestPromotion() {
    const { task } = this.props
    if (isNil(task.data.program_id)) return
    const after = {
      type: 'UPDATECARDINSTANCE_REQUEST',
      payload: {
        event: 'delete',
        cardId: task.id,
        card: task,
        after: this.props.after,
      },
    }
    this.props.onCompleteRequest({ programId: task.data.program_id, after })
    this.props.onClose()
  }

  handleCheck(id, e) {
    const { task, role, userId, projects, onUpdate } = this.props
    if (role > UserRoles.MANAGER && task.user_id !== userId) {
      toast.error('You do not have permission to do that.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      return
    }

    const project = find(propEq('id', task.project_id), projects) || GeneralProject
    if (role > UserRoles.MANAGER && project.name === 'Approval') {
      toast.error(
        'Your Manager must complete this Approval Task in their feed. This copy of the task is a reminder that you sent them a request for approval. It will auto-complete once your manager gives approval.',
        {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        }
      )
      return
    }
    if (e.target.checked && !this.state.checked) {
      onUpdate('completed', task.id, userId)
    } else {
      onUpdate('incompleted', task.id, userId)
    }
    this.setState({ checked: e.target.checked })
  }

  handleProgramDetail = card => {
    const { id, type, user_id } = card
    if (ProgramTypes[type - 1] === 'careers') {
      this.props.onFetchProgram(id, `/hcm/report-${ProgramTypes[type - 1]}/employee/${user_id}/view`)
    } else if (ProgramTypes[type - 1] === 'certifications') {
      this.props.getCertificationDetail(
        card,
        'certifications',
        `/hcm/report-${ProgramTypes[type - 1]}/${user_id}/${id}/view`
      )
    }
    this.props.onClose()
  }

  render() {
    const { preview, file, comment, openEmoji, checked } = this.state
    const { role, users, task, projects, userId, quotas, careers, certifications } = this.props
    const self = find(propEq('id', task.user_id), users) || this.props.self
    const assignee = find(propEq('id', task.user_id), users) || UnKnownUser
    const creator = isNil(task.assigned_by) ? SystemAssign : find(propEq('id', task.assigned_by), users) || UnKnownUser
    const project = find(propEq('id', task.project_id), projects) || GeneralProject
    const projectName = task.data.type === 'recurring' ? RecurringType[task.data.schedule_interval].label : project.name
    const isRequested = !(isNil(task.data.program_id) && isNil(task.data.approval_id))
    const isPromotionTask = includes('PROMOTION AVAILABLE:', task.data.name) && !isNil(task.data.program_id)
    const isApproval = project.name === 'Approval' && isRequested && !isPromotionTask && role < UserRoles.USER
    const isEnableDots = role > UserRoles.MANAGER && !(isNil(task.assigned_by) || task.assigned_by === userId)
    const actuals = task.actualData
    const program =
      isPromotionTask || isApproval
        ? find(propEq('id', task.data.program_id), careers) || find(propEq('id', task.data.program_id), certifications)
        : null
    const isPromotted = isNil(program) ? true : program.status === ProgramStatus.PROMOTION
    const companyName = project.company_name
    const comments = task.comments && task.comments.length > 0 ? sortBy(prop('created_at'), task.comments) : []
    return (
      <div className="task-detail-modal modal-content">
        <div className="modal-header bg-primary">
          <span className="dsl-w14 w-100 text-center">Task Details</span>
        </div>
        <div className="modal-body px-3 mx-3 pt-4">
          <Row className="task-detail border-bottom mx-0">
            <Col sm={12} className="px-0">
              <div className="d-flex align-items-center mb-3">
                <div className="d-flex align-items-center d-flex-1">
                  <CheckBox
                    id={`task-detail-modal-${task.id}`}
                    className="mr-2"
                    checked={checked}
                    size="regular"
                    onChange={this.handleCheck.bind(task.id, this)}
                  />
                  <p className={`dsl-b16 text-500 mb-0 ${checked ? 'text-line-through' : ''}`}>
                    {!isNil(actuals)
                      ? `Save Actuals for ${moment(task.created_at)
                          .subtract(1, 'month')
                          .format('MMMM')}`
                      : task.data.name}
                  </p>
                </div>
                <div className="d-flex">
                  <div className="edit">
                    {!isEnableDots && <EditDropdown options={['Edit', 'Delete']} onChange={this.handleSelect} />}
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={12} md={7} className="title-container">
              <p className="dsl-m12 mb-3">Description</p>
              <p
                className="dsl-b16 pl-2"
                dangerouslySetInnerHTML={{
                  __html: replace(/\n/g, '<br />', task.data.description || 'No description saved'),
                }}
              />
              {isPromotionTask && !isPromotted && (
                <>
                  <p className="dsl-b14">
                    You completed all your career program requirements, please request a promotion from your manager.
                  </p>
                  <div className="d-flex justify-content-end w-100 p-3">
                    <Button name="REQUEST COMPLETION" type="medium" onClick={this.handleRequestPromotion} />
                  </div>
                </>
              )}
              {isApproval && (
                <div className="ml-2">
                  <div onClick={() => this.handleProgramDetail(program)}>
                    <Text
                      className="cursor-pointer"
                      title="Current career"
                      value={program?.title}
                      titleWidth={100}
                      disabled
                    />
                  </div>
                  <Text
                    title="Started"
                    value={moment(program?.created_at).format('MMM DD, YY')}
                    titleWidth={100}
                    disabled
                  />
                  <Text
                    title="Requested"
                    value={program?.data?.levels[task.data?.program_level]?.title}
                    titleWidth={100}
                    disabled
                  />
                </div>
              )}
              {!isNil(actuals) && (
                <>
                  <p className="dsl-m12 mb-3">Actuals</p>
                  <p className="dsl-b16 pl-2">
                    {`You have saved ${actuals.actuals_saved} actuals for ${actuals.quota_total} quotas. Please save the remaining actuals.`}
                  </p>
                  {task.user_id === userId && actuals.actuals_saved < actuals.quota_total && (
                    <Button name="INPUT ACTUALS" onClick={this.handleInputActuals} />
                  )}
                </>
              )}
            </Col>
            <Col sm={12} md={5} className="info-container">
              <div className="info-wrapper mb-4">
                <p className="dsl-m12 info-label">Company:</p>
                <p className="dsl-b16 mb-0">{companyName}</p>
              </div>
              <div className="info-wrapper mb-4">
                <p className="dsl-m12 info-label">Project:</p>
                <p className="dsl-b16 mb-0">{projectName}</p>
              </div>
              <div className="info-wrapper mb-4">
                <p className="dsl-m12 info-label">Due:</p>
                <p className="dsl-b16 mb-0">
                  {task.status === 2 && <Icon name="fas fa-exclamation-triangle mr-1" color="#ff0000" size={12} />}
                  <span className={task.status === 2 ? 'dsl-r14' : 'dsl-b16'}>
                    {isNil(task.due_at)
                      ? moment.unix(task.data.due_date).format('MMM D')
                      : moment(task.due_at).format('MMM D')}
                  </span>
                </p>
              </div>
              <div className="info-wrapper">
                <p className="dsl-m12 info-label">Created:</p>
                <p className="dsl-b16 mb-0">{localDate(task.created_at, 'MMM D')}</p>
              </div>
              <div className="info-wrapper align-items-center">
                <p className="dsl-m12 info-label">Created by:</p>
                <Avatar url={creator.profile.avatar} type="logo" />
                <p className="dsl-b14 mb-0 ml-2">{`${creator.profile.first_name} ${creator.profile.last_name}`}</p>
              </div>
              <div className="info-wrapper align-items-center">
                <p className="dsl-m12 info-label">Task assignee:</p>
                <Avatar
                  url={assignee.profile.avatar}
                  type="logo"
                  borderColor={assignee === SystemAssign ? '#969faa' : 'transparent'}
                  borderWidth={1}
                />
                <p className="dsl-b14 mb-0 ml-2">{`${assignee.profile.first_name} ${assignee.profile.last_name}`}</p>
              </div>
            </Col>
          </Row>
          <div className="comments-detail border-bottom">
            <div className="comments-container mb-4">
              <div className="d-flex justify-content-between">
                <p className="dsl-b16 text-500 my-4">Notes</p>
              </div>
              {isApproval && (
                <div className="info-wrapper">
                  <Avatar url={creator.profile.avatar} type="logo" />
                  <div className="comment-body ml-5">
                    <p className="dsl-b16 mb-2 text-500">
                      {`${creator.profile.first_name} ${creator.profile.last_name}`}
                      <span className="dsl-m12 ml-2">
                        {localDate(task.created_at, `MMM D`) + ' at ' + localDate(task.created_at, `h:mma`)}
                      </span>
                    </p>
                    <p className="dsl-b14 mb-2">I have completed all scorecards and ready to get promoted.</p>
                    <div className="d-flex align-items-center">
                      <Button name="APPROVE" type="medium" onClick={this.handleApprove} />
                      <Button className="ml-2" name="DENY" type="medium" onClick={this.handleDecline} />
                    </div>
                  </div>
                </div>
              )}

              {task.comments && task.comments.length > 0
                ? comments.map(comment => {
                    const commentUser = find(propEq('id', comment.user_id), users) || UnKnownUser
                    return (
                      <div className="info-wrapper" key={comment.id}>
                        <Avatar url={commentUser.profile.avatar} type="logo" />
                        <div className="comment-body ml-5">
                          <p className="dsl-b16 mb-2 text-500">
                            {`${commentUser.profile.first_name} ${commentUser.profile.last_name}`}
                            <span className="dsl-m12 ml-2">
                              {localDate(comment.created_at, `MMM D`) + ' at ' + localDate(comment.created_at, `h:mma`)}
                            </span>
                          </p>
                          <p className="dsl-b14 mb-2" dangerouslySetInnerHTML={{ __html: comment.data.body }} />
                        </div>
                      </div>
                    )
                  })
                : !isApproval && <p className="dsl-b14 text-left pt-2">No comments</p>}
            </div>
            <div className="comments-container">
              <div className="my-4">
                <p className="dsl-b16 text-500 mb-0">Add Note</p>
              </div>
              <div className="d-flex mb-2">
                <Avatar url={this.props.self.profile.avatar} type="logo" />
                <div className="comment-body">
                  <Input
                    as="textarea"
                    type="text"
                    placeholder="Type here..."
                    value={comment}
                    onChange={e => this.setState({ comment: e })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="footer-contents mb-2">
            <div className="d-flex align-items-center">
              {path(['data', 'attachment', 'name'], task) && (
                <a href={task.data.attachment.location} target="_blank">
                  {task.data.attachment.name.split('/').pop()}
                </a>
              )}
              <Upload
                size={14}
                multiple={false}
                icon="fal fa-paperclip"
                color="#376caf"
                title={isNil(preview) ? 'Attach File' : preview}
                onDrop={this.handleDrop}
              />
              <div className="emoji-attach">
                <Icon
                  name="far fa-smile"
                  onClick={() => this.setState({ openEmoji: !openEmoji })}
                  size={25}
                  color="#343f4b"
                >
                  <Emoji emoji=":slightly_smiling_face:" size={32} />
                </Icon>
                <span className="dsl-b14 mb-0 ml-2 mt-1">Smiles</span>
              </div>
              <div className="emoji-container">
                {openEmoji && <Picker style={{ position: 'absolute' }} onSelect={this.handleEmojiInput} />}
              </div>
            </div>
            <Button onClick={this.handleCommentForm} name="Send" />
          </div>
        </div>
      </div>
    )
  }
}

TaskDetail.defaultProps = {
  role: 1,
  self: {
    id: 0,
    profile: {
      first_name: '',
      last_name: '',
      avatar: '',
    },
  },
  quotas: {},
  userId: 0,
  projects: [],
  users: [],
  careers: [],
  onAdd: () => {},
  onFetch: () => {},
  onUpdate: () => {},
  onUpload: () => {},
  onModal: () => {},
  onDelete: () => {},
  onClose: () => {},
  onFetchProgram: () => {},
  onCompleteRequest: () => {},
}

TaskDetail.propTypes = {
  role: PropTypes.number,
  self: PropTypes.shape({
    id: PropTypes.number,
    profile: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }),
  quotas: PropTypes.any,
  careers: PropTypes.array,
  userId: PropTypes.number.isRequired,
  projects: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onModal: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCompleteRequest: PropTypes.func,
  onFetchProgram: PropTypes.func,
}

const mapStateToProps = state => ({
  uploadUrl: state.app.learnUploadURL,
})

export default connect(mapStateToProps, null)(TaskDetail)
