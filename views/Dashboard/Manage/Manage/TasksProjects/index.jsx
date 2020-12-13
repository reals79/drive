import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { append, clone, filter, find, includes, isNil, length, propEq } from 'ramda'
import { toast } from 'react-toastify'
import moment from 'moment'
import {
  Button,
  Dropdown,
  CoreTaskHeader as TaskHeader,
  CoreTaskItem as TaskItem,
  ErrorBoundary,
  Icon,
  Filter,
  TaskEmptyList,
  Pagination,
} from '@components'
import AppActions from '~/actions/app'
import MngActions from '~/actions/manage'
import { SPECIALOPTIONS } from '~/services/config'
import { inPage } from '~/services/util'
import './TasksProjects.scss'

class TasksProjects extends Component {
  state = {
    current1: 1,
    current2: 1,
    current3: 1,
    current4: 1,
    showingProjects: 6,
    selectedUsers: [],
    openMyTasks: [],
    completedMyTasks: [],
    openMyHabits: [],
    completedMyHabits: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { id, selectedProjectTasks } = nextProps

    const { habits, tasks } = selectedProjectTasks
    const today = moment().startOf('day')

    const openMyTasks = isNil(tasks) ? [] : filter(x => x.status !== 3 && x.user_id === id, tasks)
    const completedMyTasks = isNil(tasks)
      ? []
      : filter(x => {
          const isBefore = moment(x.completed_at).isBefore(today)
          return x.status == 3 && !isBefore
        }, tasks)
    const completedMyHabits = isNil(habits) ? [] : filter(x => x.status == 3, habits)
    const openMyHabits = isNil(habits) ? [] : filter(x => x.status !== 3, habits)

    return { openMyTasks, completedMyTasks, openMyHabits, completedMyHabits }
  }

  componentDidMount() {
    const { selectedProject, companyProjects, employees, userIds } = this.props
    const project = companyProjects?.find(item => item.id === 0) || selectedProject
    const ids = userIds[0] === -1 ? employees.filter(item => item.id !== null).map(item => item.id) : userIds
    this.props.selectProject(project, ids)
  }

  handleAddProject = () => {
    const payload = {
      type: 'Add New Project',
      data: { before: null, after: null },
      callBack: null,
    }
    this.props.toggleModal(payload)
  }

  handleEditProject = () => {
    const selectedProject = clone(this.props.selectedProject)
    if (
      selectedProject.id == 0 ||
      selectedProject.id == 166 ||
      selectedProject.id == 9 ||
      selectedProject.id == 325 ||
      selectedProject.id == -3
    ) {
      toast.error(`Oops, You cannot edit the system project`, {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      let name = selectedProject.name
      name = name.substring(0, name.lastIndexOf('('))
      const payload = {
        type: 'Edit Project',
        data: { before: { card: { ...selectedProject, name } }, after: null },
        callBack: null,
      }
      this.props.toggleModal(payload)
    }
  }

  handleSelectProject = e => {
    const { selectedProject, selectProject, employees, userIds } = this.props
    const ids = userIds[0] === -1 ? employees.filter(item => item.id !== null).map(item => item.id) : userIds
    const selected = e[0]
    if (selectedProject.id !== selected.id) selectProject(selected, ids)
  }

  handleUserSelect(e) {
    const { selectedUsers } = this.state
    if (includes(e, selectedUsers)) {
      const newUsers = filter(x => x != e, selectedUsers)
      this.setState({ selectedUsers: newUsers })
    } else {
      this.setState({ selectedUsers: append(e, selectedUsers) })
    }
  }

  handleFilter = (type, data) => {
    const { companies, employees, selectedProject } = this.props
    if (data.length == 0) return
    if (type == 'employee') {
      let ids = []
      if (data[0].id < 0) ids = employees.filter(item => item.id !== null).map(item => item.id)
      else ids = data.map(item => item.id)
      this.props.selectProject(selectedProject, ids)
    } else {
      let ids = []
      if (data[0].id < 0) ids = companies.map(item => item.id)
      else ids = data.map(item => item.id)
      const userIds =
        this.props.userIds[0] === -1
          ? employees.filter(item => item.id !== null).map(item => item.id)
          : this.props.userIds
      this.props.getCompanyProjectsList(ids, userIds)
      this.setState({ companyIds: ids })
    }
  }

  render() {
    const { userRole, projects, companyProjects, id, selectedProject, employees, self, userIds } = this.props
    const {
      current1,
      current2,
      current3,
      current4,
      openMyTasks,
      completedMyTasks,
      openMyHabits,
      completedMyHabits,
    } = this.state
    const after = { type: 'SELECTPROJECT_REQUEST', project: selectedProject, userIds }

    return (
      <ErrorBoundary className="mng-tasks">
        <div className="mr-0">
          <Filter type="individual" mountEvent removed={[[], [SPECIALOPTIONS.LIST]]} onChange={this.handleFilter} />
          <div className="mx-0 projects-filter mb-2">
            <div className="dsl-d13 text-400 pb-2 desktop-screen">Projects</div>
            <Dropdown
              className="project-filter"
              select
              data={companyProjects}
              placeholder="All"
              defaultIds={[0]}
              returnBy="data"
              getValue={e => e.name}
              footer={
                <div className="d-flex border-top justify-content-between">
                  <Button className=" mt-2" name="Edit" type="link" onClick={this.handleEditProject} />
                  <Button className=" mt-2" type="link" onClick={this.handleAddProject}>
                    <Icon name="far fa-plus" size={14} color="#376caf" />
                    <span className="dsl-p14 text-400 ml-1 no-wrap">ADD PROJECT</span>
                  </Button>
                </div>
              }
              onChange={this.handleSelectProject}
            />
          </div>
          <div className="mb-2 mt-3 mt-md-0">
            <div className="row">
              <div className="px-0 col-smd-12 col-lg-6 col-md-6 col-12">
                <div className="card d-flex-1 mr-1" data-cy="hcm-task-project-openTaskTable">
                  <TaskHeader title="Open Tasks" data={openMyTasks} classname="task-title" />
                  <div className="box-detail" id="taskOpen">
                    {openMyTasks.length > 0 ? (
                      openMyTasks.map((task, index) => {
                        if (inPage(index, current1, 15))
                          return (
                            <TaskItem
                              key={task.id}
                              role={userRole}
                              userIds={userIds}
                              self={self}
                              users={employees}
                              task={task}
                              after={after}
                              className="mng-task-item"
                              dataCy={`hcm-task-project-openTaskItem${index}`}
                              project={
                                find(propEq('id', isNil(task.project_id) ? 166 : task.project_id), projects) || {}
                              }
                              onUpdate={(type, id) => this.props.updateTask(type, id)}
                              onDelete={id => this.props.deleteTask(id)}
                              onModal={e => this.props.toggleModal(e)}
                            />
                          )
                      })
                    ) : (
                      <TaskEmptyList message="No open tasks to display." />
                    )}
                  </div>
                  {openMyTasks.length >= 15 && (
                    <Pagination
                      dataCy="taskOpen"
                      current={current1}
                      perPage={15}
                      total={Math.ceil(length(openMyTasks) / 15)}
                      onChange={e => this.setState({ current1: e })}
                    />
                  )}
                </div>
                <div className="card d-flex-1 mr-1" data-cy="hcm-task-project-openHabits">
                  <TaskHeader title="Open Habits" data={openMyHabits} classname="task-title" />
                  <div className="box-detail" id="taskHabit">
                    {openMyHabits.length > 0 ? (
                      openMyHabits.map((task, index) => {
                        if (inPage(index, current2, 15))
                          return (
                            <TaskItem
                              key={task.id}
                              role={userRole}
                              userIds={userIds}
                              self={self}
                              users={employees}
                              task={task}
                              after={after}
                              className="mng-task-item"
                              dataCy={`hcm-task-project-openHabitItem${index}`}
                              project={
                                find(propEq('id', isNil(task.project_id) ? 166 : task.project_id), projects) || {}
                              }
                              onUpdate={(type, id) => this.props.updateTask(type, id)}
                              onDelete={id => this.props.deleteTask(id)}
                              onModal={e => this.props.toggleModal(e)}
                            />
                          )
                      })
                    ) : (
                      <TaskEmptyList message="No open habits to display" />
                    )}
                  </div>
                  {openMyHabits.length >= 15 && (
                    <Pagination
                      dataCy="taskHabit"
                      current={current2}
                      perPage={15}
                      total={Math.ceil(length(openMyHabits) / 15)}
                      onChange={e => this.setState({ current2: e })}
                    />
                  )}
                </div>
              </div>
              <div className="px-0 col-smd-12 col-lg-6 col-md-6 col-12">
                <div className="card d-flex-1 ml-1" data-cy="hcm-task-project-completedTask">
                  <TaskHeader title="Completed Tasks" data={completedMyTasks} classname="task-title" />
                  <div className="box-detail" id="completedTask">
                    {completedMyTasks.length > 0 ? (
                      completedMyTasks.map((task, index) => {
                        if (inPage(index, current3, 15))
                          return (
                            <TaskItem
                              key={task.id}
                              role={userRole}
                              userIds={userIds}
                              self={self}
                              users={employees}
                              task={task}
                              after={after}
                              className="mng-task-item"
                              dataCy={`hcm-task-project-completedTaskItem${index}`}
                              project={
                                find(propEq('id', isNil(task.project_id) ? 166 : task.project_id), projects) || {}
                              }
                              onUpdate={(type, id) => this.props.updateTask(type, id)}
                              onDelete={id => this.props.deleteTask(id)}
                              onModal={e => this.props.toggleModal(e)}
                            />
                          )
                      })
                    ) : (
                      <TaskEmptyList message="No completed tasks to display." />
                    )}
                  </div>
                  {completedMyTasks.length >= 15 && (
                    <Pagination
                      dataCy="completedTask"
                      current={current3}
                      perPage={15}
                      total={Math.ceil(length(completedMyTasks) / 15)}
                      onChange={e => this.setState({ current3: e })}
                    />
                  )}
                </div>

                <div className="card d-flex-1 ml-1 mb-5 mb-md-0" data-cy="hcm-task-project-completedHabits">
                  <TaskHeader title="Completed Habits" data={completedMyHabits} classname="task-title" />
                  <div className="box-detail" id="completedHabits">
                    {completedMyHabits.length > 0 ? (
                      completedMyHabits.map((task, index) => {
                        if (inPage(index, current4, 15))
                          return (
                            <TaskItem
                              key={task.id}
                              role={userRole}
                              userIds={userIds}
                              self={self}
                              users={employees}
                              task={task}
                              after={after}
                              className="mng-task-item"
                              dataCy={`hcm-task-project-completedHabitItem${index}`}
                              project={
                                find(propEq('id', isNil(task.project_id) ? 166 : task.project_id), projects) || {}
                              }
                              onUpdate={(type, id) => this.props.updateTask(type, id)}
                              onDelete={id => this.props.deleteTask(id)}
                              onModal={e => this.props.toggleModal(e)}
                            />
                          )
                      })
                    ) : (
                      <TaskEmptyList message="No completed habits to display." />
                    )}
                  </div>
                  {completedMyHabits.length >= 15 && (
                    <Pagination
                      dataCy="completedHabits"
                      current={current4}
                      perPage={15}
                      total={Math.ceil(length(completedMyHabits) / 15)}
                      onChange={e => this.setState({ current4: e })}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

TasksProjects.propTypes = {
  userRole: PropTypes.number,
  projects: PropTypes.array,
  companyProjects: PropTypes.array,
  selectedProject: PropTypes.any,
  selectedProjectTasks: PropTypes.shape({
    tasks: PropTypes.array,
    habits: PropTypes.array,
  }),
  companies: PropTypes.array,
  employees: PropTypes.array,
  companyIds: PropTypes.array,
  userIds: PropTypes.array.isRequired,
  getCompanyProjectsList: PropTypes.func,
  selectProject: PropTypes.func,
  updateTask: PropTypes.func,
  deleteTask: PropTypes.func,
  toggleModal: PropTypes.func,
}

TasksProjects.defaultProps = {
  userRole: 1,
  projects: [],
  companyProjects: [],
  selectedProject: {},
  selectedProjectTasks: {
    tasks: [],
    habits: [],
  },
  companies: [],
  employees: [],
  companyIds: [5],
  userIds: [],
  getCompanyProjectsList: () => {},
  selectProject: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  toggleModal: () => {},
}

const mapStateToProps = state => ({
  id: state.app.id,
  userRole: state.app.app_role_id,
  type: state.manage.tasksType,
  companyProjects: state.manage.companyProjects,
  projects: state.app.projects,
  selectedProject: state.manage.selectedProject,
  selectedProjectTasks: state.manage.selectedProjectTasks,
  companies: state.app.companies,
  employees: state.app.employees,
  companyIds: state.app.selectedCompany,
  userIds: state.app.selectedEmployee['individual'],
  self: state.app.user,
})

const mapDispatchToProps = dispatch => ({
  getCompanyProjectsList: (companyIds, userIds) => dispatch(MngActions.companyprojectsRequest(companyIds, userIds)),
  selectProject: (project, userIds) => dispatch(MngActions.selectprojectRequest(project, userIds)),
  updateTask: (event, cardId) => dispatch(MngActions.updatetaskRequest(event, cardId)),
  deleteTask: cardId => dispatch(MngActions.deletetaskRequest(cardId, 'task')),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TasksProjects)
