import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { equals, filter } from 'ramda'
import moment from 'moment'
import { DatePicker, ErrorBoundary, Filter, TaskList as Tasks, TaskList as Habits, TaskEmptyList } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { SPECIALOPTIONS } from '~/services/config'
import ScorecardList from './ScorecardList'
import Training from './Training'
import './DailyPlan.scss'

class DailyPlan extends Component {
  state = {
    user: {},
    tasks: [],
    performanceTask: [],
    userId: this.props.userId < 0 ? this.props.self.id : this.props.userId,
    company: this.props.company,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { tasksCard } = nextProps.tasksData

    let tasks = []
    let performanceTask = []
    if (tasksCard?.data) {
      tasks = filter(x => {
        const today = moment().startOf('day')
        const isBefore = moment(x.completed_at, 'YYYY-MM-DD hh:mm:ss').isBefore(today)
        return !(x.completed_at && isBefore)
      }, tasksCard.data)
    }
    performanceTask = filter(({ data }) => {
      if (data.performance_review_task === 'yes') return true
    }, tasks)
    tasks = filter(({ user_id, data }) => {
      if (user_id === prevState.userId) return true
      if (data.approval_id && data.user_id === prevState.userId) return true
      return false
    }, tasks)
    if (!equals(tasks, prevState.tasks) || performanceTask !== prevState.performanceTask) {
      return { tasks, performanceTask }
    }

    return null
  }

  // componentDidMount() {
  //   const { userId } = this.state
  //   this.props.fetchTasks(userId, 500, 1)
  // }

  handleFilter = (type, data) => {
    const { self } = this.props
    if (data.length === 0) return
    if (type === 'employee') {
      const { user } = this.state
      const userId = data[0].id < 0 ? self.id : data[0].id
      if (user.id !== userId) {
        this.setState({ user: data[0], userId })
        this.props.fetchTasks(userId, 500, 1)
      }
    } else {
      let ids = []
      if (data[0].id < 0) ids = self.companies.map(item => item.id)
      else ids = data.map(item => item.id)
      this.props.fetchData()
      this.setState({ company: ids })
    }
  }

  render() {
    const { tasksData, projects, userRole, employees, self } = this.props
    const { userId, tasks, performanceTask, startDate, endDate } = this.state

    return (
      <ErrorBoundary className="mng-daily-work-plan">
        <div className="d-flex align-items-center align-items-md-start card-fix">
          <Filter type="individual" mountEvent removed={[[], [SPECIALOPTIONS.LIST]]} onChange={this.handleFilter} />
          <div className="d-flex w-30 justify-content-start justify-content-xl-end mr-2">
            <DatePicker
              calendar="day"
              append="none"
              format="MMM D"
              as="span"
              align="right"
              value={startDate}
              disabled
              className="mobile-dev"
              data-cy="hcm-daily-plan-dateToday"
            />
          </div>
        </div>
        <Row className="mx-0 task-detail-wrapper" data-cy="hcm-daily-plan-dailyPlanShowcase">
          <Col xs={12} md={6} lg={6} className="px-0 pb-2 col-smd-12">
            <ScorecardList
              className="plan-tasks"
              userId={userId}
              userRole={userRole}
              user={self}
              users={employees}
              title="Scorecard Tasks"
              tasks={performanceTask}
              projects={projects}
              footer={<TaskEmptyList className="task-placeholder" message="You have no incomplete Scorecard tasks." />}
              onModal={e => this.props.toggleModal(e)}
              onReview={(userId, companyId, route, dateStart, dateEnd) =>
                this.props.fetchPersonalReviews(userId, companyId, route, dateStart, dateEnd)
              }
              onDelete={e => this.props.deleteScorecard(e)}
            />
            <Tasks
              className="plan-tasks"
              dataCy="hcm-daily-plan-openTask"
              userId={this.props.userId}
              userRole={userRole}
              user={self}
              users={employees}
              title="Open Tasks"
              tasks={tasks}
              projects={projects}
              footer={<TaskEmptyList className="task-placeholder" message="There are no assigned Tasks to show" />}
              onUpdate={(type, id) => this.props.updateTask(type, id)}
              onDelete={id => this.props.deleteTask(id)}
              onModal={e => this.props.toggleModal(e)}
            />
            <Training
              className="plan-tasks"
              dataCy="hcm-daily-plan-openTraining"
              title="Open Trainings"
              userId={userId}
              startDate={startDate}
              endDate={endDate}
            />
            <Habits
              className="plan-tasks"
              dataCy="hcm-daily-plan-openHabit"
              title="Open Habits"
              tasks={tasksData.habitsCard}
              user={self}
              users={employees}
              projects={projects}
              footer={<TaskEmptyList className="task-placeholder" message="There are no assigned Habits to show" />}
              onUpdate={(type, id) => this.props.updateTask(type, id)}
              onDelete={id => this.props.deleteTask(id)}
              onModal={e => this.props.toggleModal(e)}
            />
          </Col>
          <Col xs={12} md={6} lg={6} className="px-0 col-smd-12">
            <ScorecardList
              className="plan-tasks"
              userId={userId}
              userRole={userRole}
              user={self}
              users={employees}
              title="Completed Scorecard Tasks"
              completed
              tasks={performanceTask}
              projects={projects}
              footer={<TaskEmptyList className="task-placeholder" message="You have no complete Scorecard tasks." />}
              onModal={e => this.props.toggleModal(e)}
              onReview={(userId, companyId, route, dateStart, dateEnd) =>
                this.props.fetchPersonalReviews(userId, companyId, route, dateStart, dateEnd)
              }
              onDelete={e => this.props.deleteScorecard(e)}
            />
            <Tasks
              className="plan-tasks"
              dataCy="hcm-daily-plan-completedTask"
              userId={this.props.userId}
              userRole={userRole}
              user={self}
              users={employees}
              title="Completed Tasks"
              completed
              tasks={tasks}
              projects={projects}
              footer={<TaskEmptyList className="task-placeholder" message="There are no completed Tasks to show" />}
              onUpdate={(type, id) => this.props.updateTask(type, id)}
              onDelete={id => this.props.deleteTask(id)}
              onModal={e => this.props.toggleModal(e)}
            />
            <Training
              className="plan-tasks"
              dataCy="hcm-daily-plan-completedTraining"
              title="Completed Trainings"
              completed
              userId={userId}
              startDate={startDate}
              endDate={endDate}
            />
            <Habits
              className="plan-tasks"
              title="Completed Habits"
              dataCy="hcm-daily-plan-completedHabit"
              completed
              tasks={tasksData.habitsCard}
              user={self}
              users={employees}
              projects={projects}
              footer={<TaskEmptyList className="task-placeholder" message="There are no completed Habits to show" />}
              onUpdate={(type, id) => this.props.updateTask(type, id)}
              onDelete={id => this.props.deleteTask(id)}
              onModal={e => this.props.toggleModal(e)}
            />
          </Col>
        </Row>
      </ErrorBoundary>
    )
  }
}

DailyPlan.propTypes = {
  company: PropTypes.shape({ id: PropTypes.number }),
  userId: PropTypes.number.isRequired,
  userRole: PropTypes.number,
  fetchTasks: PropTypes.func.isRequired,
}

DailyPlan.defaultProps = {
  userId: 0,
  userRole: 1,
  company: { id: 0 },
  fetchTasks: () => {},
}

const mapStateToProps = state => ({
  self: state.app.user,
  userId: state.app.selectedEmployee['individual'][0],
  userRole: state.app.app_role_id,
  company: state.app.company_info,
  tasksData: state.manage.tasksData,
  projects: state.app.projects,
  employees: state.app.employees,
})

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(AppActions.postmulticompanydataRequest()),
  fetchPersonalReviews: (userId, companyId, route, dateStart, dateEnd) =>
    dispatch(MngActions.individualperformancereviewRequest(userId, companyId, route, dateStart, dateEnd)),
  fetchTasks: (userId, perPage, page) => dispatch(MngActions.fetchtasksfeedRequest(userId, perPage, page)),
  deleteTask: cardId => dispatch(MngActions.deletetaskRequest(cardId, 'task')),
  deleteScorecard: payload => dispatch(DevActions.postdeletescorecardRequest(payload)),
  updateTask: (event, cardId) => dispatch(MngActions.updatetaskRequest(event, cardId)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DailyPlan)
