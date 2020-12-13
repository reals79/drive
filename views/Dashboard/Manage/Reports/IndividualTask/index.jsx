import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clone, descend, find, isNil, propEq, prop, sortWith } from 'ramda'
import moment from 'moment'
import {
  ErrorBoundary,
  Filter,
  TaskReport,
  CoreTaskItem as TaskItem,
  CoreTaskHeader as TaskHeader,
  CoreHabitItem as HabitItem,
} from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import './IndividualTask.scss'

class IndividualTask extends Component {
  state = {
    startDate: moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: moment()
      .endOf('month')
      .format('YYYY-MM-DD'),
    incompletedTasks: [],
    completedTasks: [],
    dailyHabits: [],
    weeklyHabits: [],
    monthlyHabits: [],
    userId: Number(this.props.match.params.id),
    companyId: this.props.companyId === -1 ? this.props.companyId : this.props.companyId,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { tasks, projects } = nextProps
    const _tasks = clone(tasks)

    const incompletedTasks = []
    const completedTasks = []
    const dailyHabits = []
    const weeklyHabits = []
    const monthlyHabits = []

    if (projects.length > 0) {
      _tasks.tasksCard.data.forEach(task => {
        const projectId = isNil(task.project_id) ? 166 : task.project_id
        const project = find(propEq('id', projectId), projects) || {}
        task.project = project
        if (isNil(task.completed_at)) {
          incompletedTasks.push(task)
        } else {
          const isBetween = moment(task.completed_at).isBetween(prevState.startDate, prevState.endDate)
          isBetween && completedTasks.push(task)
        }
      })

      _tasks.habitsCard.forEach(habit => {
        const projectId = isNil(habit.project_id) ? 166 : habit.project_id
        const project = find(propEq('id', projectId), projects) || {}
        habit.project = project
        if (habit.data.schedule_interval === 'day') {
          dailyHabits.push(habit)
        } else if (habit.data.schedule_interval === 'week') {
          weeklyHabits.push(habit)
        } else if (habit.data.schedule_interval === 'month') {
          monthlyHabits.push(habit)
        }
      })
    }

    return { incompletedTasks, completedTasks, dailyHabits, weeklyHabits, monthlyHabits }
  }

  componentDidMount() {
    const { userId, startDate, endDate } = this.state
    this.props.getTasks(userId, startDate, endDate)
  }

  handleFilter = (type, data) => {
    const { startDate, endDate } = this.state

    if (isNil(data)) return
    if ('employee' === type && data.length > 0) {
      if (data[0].id > 0) {
        this.props.getTasks(data[0].id, startDate, endDate)
        const payload = {
          company_id: [this.state.companyId],
          user_id: data[0].id,
          date_start: startDate,
          date_end: endDate,
        }
        this.props.getReports(payload)
        this.setState({ userId: data[0].id })
      }
    } else {
      const companyId = data[0].id
      if (companyId < 0) return
      this.setState({ companyId })
    }
  }

  handleNavigation = () => {
    this.props.history.goBack()
  }

  handleUpdateTask = (type, id) => {
    this.props.updateTask(type, id)
  }

  handleUpdateHabit = (checked, id) => {
    if (checked) {
      this.props.updateTask('completed', id)
    } else {
      this.props.updateTask('incompleted', id)
    }
  }

  handleReport = (startDate, endDate) => {
    const { userId, companyId } = this.state
    this.props.getTasks(userId, startDate, endDate)
    const payload = { company_id: [companyId], user_id: userId, date_start: startDate, date_end: endDate }
    this.props.getReports(payload)
    this.setState({ startDate, endDate })
  }

  render() {
    const { reports } = this.props
    const { userId, incompletedTasks, dailyHabits, weeklyHabits, monthlyHabits } = this.state
    const completedTasks = sortWith([descend(prop('completed_at'))], this.state.completedTasks)

    return (
      <ErrorBoundary className="reports-task-detail">
        <Filter backTitle="company task reports" onChange={this.handleFilter} onBack={this.handleNavigation} />
        <TaskReport
          data={reports}
          selected={userId}
          individualTaskData={{
            incompletedTasks,
            completedTasks,
            dailyHabits,
          }}
          onTasks={this.handleReport}
        />

        <div className="mt-2 d-block d-lg-flex">
          <div className="d-flex-1 custom-margin-right">
            {incompletedTasks.length > 0 && (
              <div className="card mt-2 pt-0 pb-4">
                <TaskHeader title="Incomplete Tasks" />
                {incompletedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    project={task.project}
                    onUpdate={this.handleUpdateTask}
                    onModal={e => this.props.toggleModal(e)}
                    className="reports-task-item"
                  />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="card mt-2 pt-0 pb-4 py-0">
                <TaskHeader title="Completed Tasks" />
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    project={task.project}
                    onUpdate={this.handleUpdateTask}
                    onModal={e => this.props.toggleModal(e)}
                    className="reports-task-item"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="d-flex-1 custom-margin-left">
            {dailyHabits.length > 0 && (
              <div className="card mt-2 pt-0 pb-4">
                <TaskHeader title="Daily Habits" />
                {dailyHabits.map(task => (
                  <HabitItem
                    key={task.id}
                    type="Daily"
                    habit={task}
                    project={task.project}
                    status={reports.individuals[0].habits[task.data.schedule_id]}
                    onModal={e => this.props.toggleModal(e)}
                    onUpdate={this.handleUpdateHabit}
                  />
                ))}
              </div>
            )}
            {weeklyHabits.length > 0 && (
              <div className="card mt-2 pt-0 pb-4">
                <TaskHeader title="Weekly Habits" />
                {weeklyHabits.map(task => (
                  <HabitItem
                    key={task.id}
                    type="Weekly"
                    habit={task}
                    project={task.project}
                    status={reports.individuals[0].habits[task.data.schedule_id]}
                    onModal={e => this.props.toggleModal(e)}
                    onUpdate={this.handleUpdateHabit}
                  />
                ))}
              </div>
            )}
            {monthlyHabits.length > 0 && (
              <div className="card mt-2 pt-0 pb-4">
                <TaskHeader title="Monthly Habits" />
                {monthlyHabits.map(task => (
                  <HabitItem
                    key={task.id}
                    type="Monthly"
                    habit={task}
                    project={task.project}
                    status={reports.individuals[0].habits[task.data.schedule_id]}
                    onModal={e => this.props.toggleModal(e)}
                    onUpdate={this.handleUpdateHabit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  companyId: state.app.company_info.id,
  reports: state.manage.tasksReport,
  projects: state.app.projects,
  tasks: state.manage.tasksData,
  companyId: state.app.selectedCompany[0],
})

const mapDispatchToProps = dispatch => ({
  getTasks: (userId, startDate, endDate) =>
    dispatch(MngActions.fetchtasksfeedRequest(userId, 5000, 1, startDate, endDate)),
  getReports: payload => dispatch(MngActions.companyindividualRequest(payload)),
  updateTask: (type, cardId) => dispatch(MngActions.updatetaskRequest(type, cardId)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTask)
