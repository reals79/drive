import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import queryString from 'query-string'
import { toast } from 'react-toastify'
import { clone, equals, filter, find, findLast, includes, isEmpty, isNil, path, propEq } from 'ramda'
import { Avatar, Button, DatePicker, EditDropdown, Icon, Filter, Input, Rating, Text, Upload } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import ManageActions from '~/actions/manage'
import { UserRoles, SPECIALOPTIONS } from '~/services/config'
import { avatarBackgroundColor } from '~/services/util'
import IndividualMonthPdf from './IndividualMonthPdf'
import Agreed from './Agreed'
import SignOff from './SignOff'
import * as Quota from './Quota'
import * as Commitments from './Commitments'
import './IndividualPerformance.scss'

const getAvgStars = reviews => {
  let stars = 0
  let counts = 0
  reviews.forEach(item => {
    if (item.status == 2) {
      counts += 1
      if (item.data?.average_star_rating !== 'N/A') {
        stars += item.data?.average_star_rating
      }
    }
  })
  return (stars / counts).toFixed(2)
}

class IndividualPerformance extends Component {
  constructor(props) {
    super(props)

    const values = queryString.parse(props.location.search)
    let editable
    let completed
    if (includes('report-performance', props.location.pathname)) {
      editable = false
      completed = true
    } else {
      editable = props.data.performance.status !== 2
      completed = props.data.performance.status === 2
    }

    const companyId = props.data.performance.company_id || props.companyId
    const company = find(propEq('id', companyId), props.companies) || {}
    const managers = company.managers || []
    const roles = company.job_roles || []

    const id = Number(props.match.params.id)
    let user = find(propEq('id', id), props.users) || { profile: {} }
    const job = find(propEq('id', user.job_role_id), roles) || {}
    user = { ...user, job }
    const manager = props.role < 4 ? props.user : find(item => item.id == user.manager_id, managers)

    const note = path(['data', 'coaching', 'comments'], props.data.performance)

    this.state = {
      show: '', // Save&Exit, Save&Next
      note,
      user,
      manager,
      companyId,
      managers,
      roles,
      submitted: false,
      nextOne: false,
      nextTwo: isEmpty(note) || isNil(note) ? false : true,
      selectedMonth: {
        start: moment(values.date_start)
          .utc()
          .startOf('month'),
        end: moment(values.date_start)
          .utc()
          .endOf('month'),
      },
      editable,
      completed,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps
    const { selectedMonth, note } = prevState
    let { show } = prevState
    let nextOne = true
    const { performance, scorecards } = data

    if (scorecards.length == 0) {
      nextOne = false
    } else {
      let totalActuals = 0
      let totalQuotas = 0
      scorecards.map(item => {
        item.quotas.map(quota => {
          const actual = findLast(x => moment(x.actual_at).isBetween(selectedMonth.start, selectedMonth.end))(
            quota.actuals
          )
          if (actual) totalActuals += 1
        })
        totalQuotas += item.quotas.length
      })
      nextOne = totalActuals == totalQuotas
    }

    const nextTwo = isEmpty(note) || isNil(note) ? false : true

    const agreed = performance.data.agreed
    if (agreed && agreed.supervisor && agreed.employee) show = ''

    return { nextOne, nextTwo, show }
  }

  componentDidMount() {
    const { data } = this.props
    if (!this.state.nextOne) {
      let visible = false
      data.scorecards.forEach(item => {
        if (item.quotas.length > 0) visible = true
      })
      if (visible) this.handleActualModal()
    }
    const { companyId, selectedMonth, user } = this.state
    const startDate = moment(selectedMonth.start).format('YYYY-MM-DD')
    const endDate = moment(selectedMonth.end).format('YYYY-MM-DD')
    this.props.fetchReviews(user.id, companyId, startDate, endDate)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.performance.id !== this.props.data.performance.id) {
      this.setState({ note: path(['data', 'coaching', 'comments'], this.props.data.performance) })
    }
    const { performance } = this.props.data
    if (!this.state.selectedMonth.start.isSame(performance.date_start, 'month')) {
      this.setState({
        selectedMonth: {
          start: moment(performance.date_start)
            .utc()
            .startOf('month'),
          end: moment(performance.date_start)
            .utc()
            .endOf('month'),
        },
      })
    }
  }

  handleAdd = e => {
    const { selectedMonth } = this.state
    const payload = {
      ...e,
      card_type: 'task',
      type: 'single',
      performance_id: this.props.data.performance.id,
      company_id: this.state.companyId,
    }
    const after = {
      type: 'INDIVIDUALPERFORMANCEREVIEW_REQUEST',
      userId: this.state.user.id,
      companyId: this.state.companyId,
      route: null,
      startDate: moment(selectedMonth.start).format('YYYY-MM-DD'),
      endDate: moment(selectedMonth.end).format('YYYY-MM-DD'),
    }
    this.props.assignCard(payload, after)
  }

  handleAssign = e => {
    const { selectedMonth } = this.state
    const ids = e.templates
    let payload = {
      user_id: [this.state.user.id],
      performance_id: this.props.data.performance.id,
      company_id: this.state.companyId,
      card_template_id: ids,
      card_type: 'courses',
      due_date: e.due_date,
    }
    if (e.type === 'tracks') payload = { ...payload, card_type: 'tracks' }
    const after = {
      type: 'INDIVIDUALPERFORMANCEREVIEW_REQUEST',
      userId: this.state.user.id,
      companyId: this.state.companyId,
      route: null,
      startDate: moment(selectedMonth.start).format('YYYY-MM-DD'),
      endDate: moment(selectedMonth.end).format('YYYY-MM-DD'),
    }
    this.props.assignCard(payload, after)
  }

  handleDate = e => {
    const { user, companyId } = this.state
    this.props.fetchPrevious({
      userId: user.id,
      currentId: this.props.data.performance.id,
      startDate: moment(e.start).format('YYYY-MM-DD'),
      endDate: moment(e.end).format('YYYY-MM-DD'),
    })
    this.props.fetchReviews(
      user.id,
      companyId,
      moment(e.start).format('YYYY-MM-DD'),
      moment(e.end).format('YYYY-MM-DD')
    )
    this.setState({ selectedMonth: e })
  }

  handleFilter = (type, e) => {
    const { companyId, roles, selectedMonth } = this.state
    if (type === 'employee') {
      if (e[0].id < 0) return
      const user = e[0]
      const job = find(propEq('id', user.job_role_id), roles) || {}
      this.props.fetchReviews(
        e[0].id,
        companyId,
        moment(selectedMonth.start).format('YYYY-MM-DD'),
        moment(selectedMonth.end).format('YYYY-MM-DD')
      )
      this.setState({ user: { ...user, job } })
    } else {
      this.props.fetchReviews(
        this.state.user.id,
        e[0].id,
        moment(selectedMonth.start).format('YYYY-MM-DD'),
        moment(selectedMonth.end).format('YYYY-MM-DD')
      )
      this.setState({ companyId: e[0].id })
    }
  }

  handleTask = () => {
    const { projects } = this.props
    const performanceProject = find(propEq('name', 'Reviews'), projects)
    const payload = {
      type: 'Add New Task',
      data: {
        before: {
          assignees: [this.state.user.id],
          projectId: performanceProject ? performanceProject.id : null,
        },
        after: null,
      },
      callBack: { onAdd: this.handleAdd },
    }
    this.props.toggleModal(payload)
  }

  handleTraining = () => {
    const payload = {
      type: 'Assign Training',
      data: { before: { assignees: [this.state.user.id], modules: [], companyId: this.state.companyId }, after: null },
      callBack: { onAssign: this.handleAssign },
    }
    this.props.toggleModal(payload)
  }

  handleActualModal() {
    const { user, companyId, editable, selectedMonth } = this.state
    if (!editable || this.props.data.performance.status == 2) return
    const payload = {
      type: 'Save Actuals',
      data: {
        before: {
          selected: null,
          user,
          scorecards: filter(e => e.status !== 3, this.props.data.scorecards),
          date: moment(selectedMonth.start).format('YYYY-MM-DD'),
          after: {
            type: 'INDIVIDUALPERFORMANCEREVIEW_REQUEST',
            userId: user.id,
            companyId,
            startDate: moment(selectedMonth.start).format('YYYY-MM-DD'),
            endDate: moment(selectedMonth.end).format('YYYY-MM-DD'),
            route: null,
          },
        },
        after: {},
      },
      callBack: {},
    }
    this.props.toggleModal(payload)
  }

  handleScorecardEdit = e => {
    switch (e) {
      case 'edit actuals':
        this.handleActualModal()
        break
      case 'unassign scorecard':
        this.props.toggleModal({
          type: 'Confirm',
          data: {
            before: {
              title: 'Unassign Scorecard',
              body: 'This will permanently delete the scorecard from your assignments.  Are you sure?',
            },
          },
          callBack: {
            onYes: () => {
              this.props.deleteScorecard({
                scorecard: { id: this.props.data.scorecards[0].id },
              })
            },
          },
        })
        break
      default:
        break
    }
  }

  handleSelectCommitMenu = (item, from) => event => {
    const { user, companyId } = this.state
    const { card_type_id } = item
    const { selectedMonth } = this.state
    const mode = card_type_id === 8 ? 'task' : 'course'
    const priorAfterAction = {
      type: 'GETPREVIOUSREVIEWTASKS_REQUEST',
      payload: {
        userId: user.id,
        currentId: this.props.data.performance.id,
        startDate: moment(selectedMonth.start).format('YYYY-MM-DD'),
        endDate: moment(selectedMonth.end).format('YYYY-MM-DD'),
      },
    }
    const newAfterAction = {
      type: 'INDIVIDUALPERFORMANCEREVIEW_REQUEST',
      userId: user.id,
      companyId,
      startDate: moment(selectedMonth.start).format('YYYY-MM-DD'),
      endDate: moment(selectedMonth.end).format('YYYY-MM-DD'),
      route: null,
    }
    const after = from === 'new' ? newAfterAction : priorAfterAction

    switch (event) {
      case 'detail view':
        if (equals(card_type_id, 8)) {
          this.props.toggleModal({
            type: 'Task Detail',
            data: { before: { card: item, after } },
            callBack: null,
          })
        } else {
          this.props.fetchTask(item.id, 'Preview')
        }
        break

      case 'edit':
        if (card_type_id === 8) {
          this.props.toggleModal({
            type: 'Edit Task',
            data: { before: { card: item, after } },
            callBack: null,
          })
        } else {
          this.props.toggleModal({
            type: 'Quick Edit',
            data: { before: { template: item, type: 'courses', from: 'instance', after } },
            callBack: {
              onDelete: () => this.props.deleteTask(item.id, mode, after),
            },
          })
        }
        break

      case 'delete':
        this.props.deleteTask(item.id, mode, after)
        break

      default:
        break
    }
  }

  handleUpdatePerformance = () => {
    const { note } = this.state
    const performance = clone(this.props.data.performance)
    performance.data.coaching = { comments: note }
    const payload = { performance }
    this.props.savePerformance(payload)
  }

  handleSaveExit = () => {
    const { note } = this.state
    const performance = clone(this.props.data.performance)
    performance.data.coaching = { comments: note }
    performance.status = 1
    const payload = { performance }
    this.props.savePerformance(payload)
    this.props.history.goBack()
  }

  handleSaveNext = () => {
    const { note } = this.state
    const { role } = this.props

    if (!(isEmpty(note) || isNil(note))) {
      this.handleUpdatePerformance()
      this.setState({ show: 'Save&Next' })
      if (role > UserRoles.Manager) {
        toast.warn('The coaching worksheet will be available once your managers saves it for sign off.', {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
  }

  handleSign = sign => {
    const { companyId, selectedMonth, manager } = this.state
    const companyIds = companyId < 0 ? this.props.companies.map(item => item.id) : [companyId]
    const after = {
      type: 'COMPANYPERFORMANCEREVIEWS_REQUEST',
      companyIds,
      userIds: null,
      perPage: 25,
      page: 1,
      startDate: moment(selectedMonth.start).format('YYYY-MM-DD'),
      endDate: moment(selectedMonth.end).format('YYYY-MM-DD'),
    }
    this.props.signPerformance(sign, isEmpty(manager), after)
  }

  handleDrop = e => {
    this.props.upload({ file: e[0] })
  }

  handleResetPassword = () => {
    this.props.toggleModal({ type: 'Reset Password' })
  }

  handlePdf = async () => {
    const { completed, manager, note, selectedMonth, user } = this.state
    const { data, projects, reviews, users } = this.props
    const avgStars = reviews.length ? getAvgStars(reviews) : 0
    const pdfData = { avgStars, completed, data, manager, note, projects, reviews, selectedMonth, user, users }
    const pdf = await IndividualMonthPdf(pdfData)
    const pdfUrl = URL.createObjectURL(pdf)
    window.open(pdfUrl, '__blank')
  }

  render() {
    const { show, note, user, manager, submitted, nextOne, nextTwo, selectedMonth, editable, completed } = this.state
    const { projects, data, role, reviews, users } = this.props
    const { performance, scorecards } = data
    const { tasks, trainings } = performance
    const agreed = performance.data.agreed

    return (
      <div className="ind-performance-reviews">
        <Filter
          backTitle="all reviews"
          removed={[[], [SPECIALOPTIONS.LIST]]}
          onChange={this.handleFilter}
          onBack={() => this.props.history.goBack()}
        />
        <div className="card">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <span className="dsl-b22 bold">Performance Review</span>
              <span className="dsl-b16 font-italic mt-1 ml-2">{performance.status === 2 ? null : '(in-progress)'}</span>
            </div>
            <div className="d-flex d-h-end">
              <DatePicker
                className="mt-1 mt-md-0"
                calendar="month"
                append="caret"
                format="MMM YY"
                as="span"
                align="right"
                value={selectedMonth}
                disabledDate={e => moment(e).isSameOrAfter(new Date())}
                onSelect={this.handleDate}
              />
              <span className="ml-2 cursor-pointer">
                <Icon name="far fa-print" size={18} color="#343f4b" onClick={this.handlePdf} />
              </span>
            </div>
          </div>
          <div className="mt-4 d-flex">
            <div className="d-flex">
              <div className="preview-image">
                <Avatar
                  size="large"
                  url={user.profile.avatar}
                  type="initial"
                  name={`${user.profile.first_name} ${user.profile.last_name}`}
                  backgroundColor={avatarBackgroundColor(user.id)}
                />
              </div>
              <div className="ml-3">
                <p className="dsl-b24 bold mb-2">{`${user.profile.first_name} ${user.profile.last_name}`}</p>
                <Text title="Role:" value={user.job.name} titleWidth={80} disabled />
                <Text title="Hire date:" value={moment(user.hired_at).format('M/D/YYYY')} titleWidth={80} disabled />
                <Text
                  title="Supervisor:"
                  value={manager ? `${manager.profile.first_name} ${manager.profile.last_name}` : 'Na'}
                  titleWidth={80}
                  disabled
                />
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between d-flex-1">
              <div>
                {reviews.length ? (
                  <>
                    <Rating
                      className="mb-2"
                      title="Prior Review:"
                      titleWidth={80}
                      score={reviews[0].data ? reviews[0].prior_score : 0}
                    />
                    <Rating title="YTD Review:" titleWidth={80} score={getAvgStars(reviews)} />
                  </>
                ) : (
                  <>
                    <Rating
                      className="mb-2"
                      title="Prior Review:"
                      titleWidth={80}
                      score={performance.data ? performance.prior_score : 0}
                    />
                    <Rating
                      title="YTD Review:"
                      titleWidth={80}
                      score={performance.data ? performance.data.ytd_star_rating : 0}
                    />
                  </>
                )}
              </div>
              <div />
            </div>
          </div>
        </div>

        <div className="card mt-2">
          <div className="scorecard-header">
            <p className="dsl-b22 bold mb-4">Scorecard</p>
            {role < UserRoles.USER && editable && !completed && (
              <EditDropdown
                options={role < UserRoles.USER ? ['Edit Actuals', 'Unassign Scorecard'] : ['Edit Actuals']}
                onChange={this.handleScorecardEdit}
              />
            )}
          </div>
          {scorecards.length === 0 ? (
            <p className="dsl-d14 text-center mt-5">
              {editable
                ? 'Cannot complete Performance Review until a scorecard is assigned.'
                : 'There are no Performance Review until a scorecard is assigned.'}
            </p>
          ) : (
            scorecards.map(item => (
              <div key={`ee${item.id}`}>
                <p className="dsl-b18 bold mb-0">{item.title}</p>
                <Quota.Header title="Quota" />
                <Quota.List quotas={item.quotas} now={selectedMonth} />
                <Quota.Total quotas={item.quotas} now={selectedMonth} />
              </div>
            ))
          )}

          {editable && !completed && !submitted && (
            <div className="d-flex justify-content-end mt-4">
              <Button
                className="ml-4"
                name="Next"
                disabled={!nextOne}
                onClick={() => this.setState({ submitted: true })}
              />
            </div>
          )}
        </div>

        {(editable ? submitted : true) && (
          <div className="card mt-2">
            <div className="coaching-worksheet-header">
              <p className="dsl-b22 bold mb-2">Coaching Worksheet</p>
              <p> {moment(selectedMonth.start).format('MMM, YYYY')} </p>
            </div>
            {scorecards.map(item => (
              <div key={`ff${item.id}`}>
                <p className="dsl-b18 bold mb-0 mt-3">Quotas Below Minimum</p>
                <Quota.Header title="Quotas" />
                <Quota.List quotas={item.quotas} now={selectedMonth} limit={2} onModal={this.handleActualModal} />
              </div>
            ))}

            <p className="dsl-b18 bold mb-0 mt-4">Coaching Notes:</p>
            {performance.status == 2 || !editable ? (
              <>
                {note ? (
                  <p className="dsl-b14 mt-3">{note}</p>
                ) : (
                  <p className="dsl-b14 text-center mt-3">No coaching notes were saved.</p>
                )}
              </>
            ) : (
              <Input
                className="mt-3"
                value={note}
                direction="vertical"
                as="textarea"
                rows={3}
                onChange={e => this.setState({ note: e })}
              />
            )}

            <span className="dsl-m12 pt-3 mb-2">Attach file if any applicable </span>
            <div className="d-flex upload-button">
              <Upload title="Upload File" icon="fal fa-file-import" color="#376caf" onDrop={this.handleDrop} />
            </div>

            <p className="dsl-b18 bold mb-0 mt-4">Plan: Tasks & Training</p>
            <div className="list-item pb-2 mt-2">
              <span className="dsl-m12">Tasks</span>
            </div>
            {reviews.tasks && tasks && !reviews.tasks.length && !tasks.length ? (
              <p className="dsl-b14 text-center mt-3">No Tasks</p>
            ) : (
              <div className="performance-tasks">
                {reviews.tasks &&
                  reviews.tasks.map(task => {
                    if (task.user_id === user.id)
                      return (
                        <Commitments.Task
                          key={`e${task.id}`}
                          role={role}
                          task={task}
                          users={users}
                          projects={projects}
                          yellow
                          onSelect={this.handleSelectCommitMenu(task, 'prior')}
                        />
                      )
                  })}
                {tasks &&
                  tasks.map(task => {
                    if (task.user_id === user.id)
                      return (
                        <Commitments.Task
                          key={`e${task.id}`}
                          role={role}
                          task={task}
                          users={users}
                          projects={projects}
                          onSelect={this.handleSelectCommitMenu(task, 'new')}
                        />
                      )
                  })}
              </div>
            )}
            <div className="list-item pb-2 mt-3">
              <span className="dsl-m12">Training</span>
            </div>
            {reviews.trainings && trainings && !reviews.trainings.length && !trainings.length ? (
              <p className="dsl-b14 text-center mt-3">No Training</p>
            ) : (
              <div className="performance-training">
                {reviews.trainings &&
                  reviews.trainings.map(training => (
                    <Commitments.Training
                      key={`f${training.id}`}
                      role={role}
                      training={training}
                      users={users}
                      yellow
                      onSelect={this.handleSelectCommitMenu(training, 'prior')}
                    />
                  ))}
                {trainings &&
                  trainings.map(training => (
                    <Commitments.Training
                      key={`e${training.id}`}
                      role={role}
                      training={training}
                      users={users}
                      onSelect={this.handleSelectCommitMenu(training, 'new')}
                    />
                  ))}
              </div>
            )}

            {editable && !completed && (
              <>
                {role < UserRoles.USER && (
                  <>
                    <Button className="ml-auto mt-3" type="low" name="+ ADD TASK" onClick={this.handleTask} />
                    <Button className="ml-auto mt-2" type="low" name="+ ADD TRAINING" onClick={this.handleTraining} />
                  </>
                )}
                <div className="d-flex justify-content-end pt-3">
                  {role < UserRoles.USER && (
                    <Button className="ml-auto" type="medium" name="Save & Exit" onClick={this.handleSaveExit} />
                  )}
                  <Button className="ml-2" name="Save & Sign Review" onClick={this.handleSaveNext} />
                </div>
              </>
            )}
          </div>
        )}

        {completed && agreed && (
          <div className="card agreed mt-card">
            <p className="dsl-b22 bold mb-4">Agreed:</p>
            <div className="d-flex">
              {agreed.supervisor && <Agreed title="Supervisor" data={agreed.supervisor} />}
              {agreed.employee && <Agreed title="Employee" data={agreed.employee} />}
            </div>
          </div>
        )}

        <SignOff
          user={user}
          manager={manager}
          performance={performance}
          scorecards={scorecards}
          users={users}
          projects={projects}
          reviews={reviews}
          show={show}
          selectedMonth={selectedMonth}
          onHide={() => this.setState({ show: '' })}
          onSign={this.handleSign}
          onReset={this.handleResetPassword}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  role: state.app.app_role_id,
  user: state.app.user,
  userId: state.app.id,
  companies: state.app.companies,
  companyId: state.app.selectedCompany,
  users: state.app.employees,
  data: state.manage.individualPerformanceReview,
  reviews: state.manage.previousReviews,
  projects: state.app.projects,
})

const mapDispatchToProps = dispatch => ({
  assignCard: (payload, after) => dispatch(ManageActions.assigntrainingRequest(payload, after)),
  savePerformance: payload => dispatch(ManageActions.postperformancereviewRequest(payload)),
  fetchReviews: (userId, companyId, startDate, endDate) =>
    dispatch(ManageActions.individualperformancereviewRequest(userId, companyId, null, startDate, endDate)),
  fetchPrevious: e => dispatch(ManageActions.getpreviousreviewtasksRequest(e)),
  fetchTask: (cardId, mode) => dispatch(ManageActions.fetchtaskdetailRequest(cardId, mode)),
  deleteTask: (cardId, mode, after) => dispatch(ManageActions.deletetaskRequest(cardId, mode, after)),
  deleteScorecard: payload => dispatch(DevActions.postdeletescorecardRequest(payload)),
  signPerformance: (payload, completed, after) => dispatch(ManageActions.postsignoffRequest(payload, completed, after)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
  upload: payload => dispatch(AppActions.uploadRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualPerformance)
