import { put, select, call } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import {
  ascend,
  clone,
  concat,
  equals,
  find,
  findIndex,
  filter,
  isNil,
  isEmpty,
  insert,
  includes,
  join,
  pickBy,
  prop,
  propEq,
  reduce,
  replace,
  slice,
  sortBy,
  sortWith,
  toUpper,
  values,
} from 'ramda'
import moment from 'moment'
import queryString from 'query-string'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { history } from '~/reducers'
import { SPECIALOPTIONS } from '~/services/config'
import { convertUrl, localDate } from '~/services/util'

export function* getcareerprogramRequest(api, action) {
  try {
    const { programId, route } = action
    const response = yield api.getCareerProgram(programId)

    if (response.ok) {
      const { program } = response.data
      let user = {}
      if (!isNil(program.user_id)) {
        const employees = yield select(state => state.app.employees)
        user = find(propEq('id', program.user_id), employees) || {}
      }
      yield put(MngActions.getcareerprogramSuccess({ program, profile: user.profile || {} }))
      if (route) yield call(history.push, route)
    } else {
      yield put(MngActions.getcareerprogramFailure())
    }
  } catch (e) {
    yield put(MngActions.getcareerprogramFailure())
  }
}

export function* postcareerprogramRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postCareerProgram(payload)

    if (response.ok) {
      yield put(MngActions.postcareerprogramSuccess())
    } else {
      yield put(MngActions.postcareerprogramFailure())
    }
  } catch (e) {
    yield put(MngActions.postcareerprogramFailure())
  }
}

export function* fetchtasksfeedRequest(api, action) {
  const { userId, perPage, page, startDate, endDate } = action
  const companyId = yield select(state => state.app.company_info.id)

  try {
    const response = {}

    const tasksResponse = yield api.getTasks(userId, perPage, page)
    if (tasksResponse.ok) {
      tasksResponse.data.data.sort(function(x, y) {
        return x.data.due_date - y.data.due_date
      })
      for (let task of tasksResponse.data.data) {
        if (task.data.performance_review_task) {
          const userId = task?.user_id
          const startDate = moment(task.data.year_month)
            .startOf('month')
            .format('YYYY-MM-DD')
          const endDate = moment(task.data.year_month)
            .endOf('month')
            .format('YYYY-MM-DD')
          const options = `?user_id=${userId}&company_id=${companyId}&date_start=${startDate}&date_end=${endDate}`
          const performanceResponse = yield api.getIndividualPerformanceReview(options)
          if (performanceResponse.ok) {
            task.performance = performanceResponse.data
          }
        }
      }
      response.tasksCard = tasksResponse.data
    }

    let habitsData = []
    const habitsResponse = yield api.getHabits(
      userId,
      perPage,
      page,
      startDate && endDate && `date_start=${startDate}&date_end=${endDate}`
    )
    if (habitsResponse.ok) habitsData = habitsResponse.data.data

    const now = moment.utc().format('YYYY-MM-DD')
    const options = `status[]=3&archived=1&completed_at_start=${now}&${startDate &&
      endDate &&
      `date_start=${startDate}&date_end=${endDate}`}`
    const completedHabitsRes = yield api.getHabits(userId, perPage, page, options)
    if (completedHabitsRes.ok) habitsData = concat(habitsData, completedHabitsRes.data.data)
    response.habitsCard = habitsData.sort(function(x, y) {
      return x.data.due_date - y.data.due_date
    })

    const statsResponse = yield api.getStats(
      userId,
      startDate && endDate && `&date_start=${startDate}&date_end=${endDate}`
    )
    if (statsResponse.ok) response.statsCard = statsResponse.data
    yield put(MngActions.fetchtasksfeedSuccess(response))
  } catch (e) {
    yield put(MngActions.fetchtasksfeedFailure())
  }
}

export function* companyprojectsRequest(api, action) {
  const { companyIds, userIds } = action
  const companies = yield select(state => state.app.companies)
  const ids = join(
    '&',
    companyIds.map(id => 'company_id[]=' + id)
  )
  const response = yield api.getProjectStats(ids)
  if (response.ok) {
    try {
      response.data.map(project => {
        const company = find(propEq('id', project.company_id), companies)
        project.name = `${project.name} (${company.name})`
      })
      const userId = yield select(state => state.app.id)
      const tasksStatsRes = yield api.getStats(userId)
      const { adhoc_stats, recurring_types, recurring_open } = tasksStatsRes.data
      const mytasks = {
        company_id: 0,
        data: null,
        id: 0,
        name: 'My Tasks & Habits',
        task_stats: { ...adhoc_stats },
        habit_stats: { ...recurring_types },
        open_stats: recurring_open + adhoc_stats.pending,
      }
      const assignedtasks = {
        company_id: 0,
        id: SPECIALOPTIONS.SELFASSIGNED,
        name: 'Assigned by me',
      }
      const tempList = insert(0, assignedtasks, response.data)
      const projectList = insert(0, mytasks, tempList)
      const selectedProject = yield select(state => state.manage.selectedProject)
      const index = findIndex(propEq('id', selectedProject.id), projectList)
      yield put(MngActions.companyprojectsSuccess(projectList))
      if (index > -1) yield put(MngActions.selectprojectRequest(projectList[index], userIds))
      else yield put(MngActions.selectprojectRequest(projectList[0], userIds))
    } catch (err) {
      yield put(MngActions.companyprojectsFailure())
    }
  } else {
    yield put(MngActions.companyprojectsFailure())
  }
}

export function* selectusersRequest(api, action) {
  try {
    const { payload } = action
    const project = yield select(state => state.manage.selectedProject)
    if (!isEmpty(project)) {
      const request = { projectId: project.id, users: payload, project }
      yield put(MngActions.userprojecttaskRequest(request))
    }
  } catch (e) {
    yield put(MngActions.userprojecttaskRequest(request))
  }
}

export function* userprojecttaskRequest(api, action) {
  try {
    const { payload } = action
    const { projectId, users, completionType, project } = payload

    if (projectId === SPECIALOPTIONS.SELFASSIGNED) {
      const option = 'card_type_id[]=8&per_page=5000'
      const response = yield api.getAssignedCards(option)
      if (response.ok) {
        response.data.data.forEach(data => {
          data.due_at = isNil(data.due_at) ? localDate(data.data.due_date, 'YYYY-MM-DD HH:MM:SS') : data.due_at
        })
        const { data } = response.data

        const tasksList = filter(data => data.type === 'single' || data.user_id !== data.assigned_by, data)
        const completedTasksList = filter(({ status }) => equals(status, 3), tasksList)
        const habitsList = filter(({ data }) => !equals(data.type, 'single'), data)
        const completedHabitsList = filter(({ status }) => equals(status, 3), habitsList)
        const tasks = sortBy(prop('due_at'), tasksList)
        const completedTasks = sortBy(prop('due_at'), completedTasksList)
        const habits = sortBy(prop('due_at'), habitsList)
        const completedHabits = sortBy(prop('due_at'), completedHabitsList)
        yield put(MngActions.userprojecttaskSuccess({ tasks, habits }))
        yield put(
          MngActions.userprojecttaskSuccess({
            completionType: 'today',
            tasks: completedTasks,
            habits: completedHabits,
          })
        )
      } else {
        yield put(MngActions.userprojecttaskFailure())
      }
    } else {
      const userId = isNil(users) || isEmpty(users) || users[0] === -1 ? yield select(state => state.app.id) : users[0]
      if (!isNil(userId)) {
        if (!isNil(project) && !isNil(project.name) && project.name === 'Approval') {
          const res = yield api.getLearnFeeds('approvals', userId, '')
          if (res.ok) {
            const tasks = sortBy(prop('due_at'), res.data.data)
            yield put(MngActions.userprojecttaskSuccess({ tasks, habits: [] }))
          } else {
            yield put(MngActions.userprojecttaskFailure())
          }
        } else {
          const completedStart =
            completionType === 'today' ? moment.utc().format('YYYY-MM-DD') : moment.utc().format('YYYY-MM-01')
          const completedEnd = moment.utc().format('YYYY-MM-DD')
          const options =
            projectId === 0
              ? 'per_page=100'
              : reduce((cc, x) => cc + `&user_id[]=${x}`, `project_id[]=${projectId}`, users) + '&per_page=100'
          const queries = isNil(completionType)
            ? options
            : `${options}&completed_at_start=${completedStart}&completed_at_end=${completedEnd}`
          const completedQuery = isNil(completionType)
            ? `${queries}&status[]=3&archived=1&completed_at_start=${completedEnd}`
            : `${queries}&status[]=3&archived=1`
          const response = yield api.getUserProjectTasks(userId, queries)
          const response1 = yield api.getUserProjecthabits(userId, queries)
          const completedHabitsRes = yield api.getUserProjecthabits(userId, completedQuery)

          if (response.ok || response1.ok) {
            let tasksRes = response.ok ? response.data.data : []
            let habitsRes = response1.ok ? response1.data.data : []
            if (completedHabitsRes.ok) {
              habitsRes = concat(habitsRes, completedHabitsRes.data.data)
            }
            tasksRes = sortBy(prop('due_at'), tasksRes)
            habitsRes = sortBy(prop('due_at'), habitsRes)
            yield put(MngActions.userprojecttaskSuccess({ completionType, tasks: tasksRes, habits: habitsRes }))
          } else {
            yield put(MngActions.userprojecttaskFailure())
          }
        }
      } else {
        yield put(MngActions.userprojecttaskFailure())
      }
    }
  } catch (e) {
    yield put(MngActions.userprojecttaskFailure())
  }
}

export function* selectprojectRequest(api, action) {
  try {
    const { project, userIds } = action
    const payload = { projectId: project.id, users: userIds || [], project }

    yield put(MngActions.userprojecttaskRequest(payload))

    const { id, task_stats, habit_stats } = project
    const taskStats = isNil(task_stats)
      ? {}
      : {
          type: 'single',
          title: 'Tasks:',
          data: [
            { label: 'Total Open', value: task_stats.total },
            { label: 'Current', value: id > 0 ? task_stats.open : task_stats.pending },
            { label: 'Completed', value: task_stats.complete },
            { label: 'Past Due', value: task_stats.past_due },
          ],
        }

    const habitStats = isNil(habit_stats)
      ? {}
      : {
          type: 'recurring',
          data: [
            {
              title: 'Daily open:',
              data: [
                { label: 'Currently open', value: habit_stats.day.pending },
                { label: 'Completed today', value: habit_stats.day.complete },
                { label: 'MTD completion', value: habit_stats.day.completion },
              ],
            },
            {
              title: 'Weekly open:',
              data: [
                { label: 'Currently open', value: habit_stats.week.pending },
                { label: 'Completed today', value: habit_stats.week.complete },
                { label: 'MTD completion', value: habit_stats.week.completion },
              ],
            },
            {
              title: 'Monthly open:',
              data: [
                { label: 'Currently open', value: habit_stats.month.pending },
                { label: 'Completed today', value: habit_stats.month.complete },
                { label: 'MTD completion', value: habit_stats.month.completion },
              ],
            },
          ],
        }

    yield put(MngActions.selectprojectSuccess({ ...project, taskStats, habitStats }))
  } catch (e) {
    yield put(MngActions.selectprojectFailure())
  }
}

// retrieve Task Detail
export function* fetchtaskdetailRequest(api, action) {
  try {
    const { cardInstanceId, mode } = action
    const response = yield api.updateCardInstance(cardInstanceId)

    if (response.ok && !isNil(response.data)) {
      yield put(MngActions.fetchtaskdetailSuccess(response.data))
      if (mode === 'Preview') {
        const course = response.data
        yield put(
          AppActions.modalRequest({
            type: mode,
            data: { before: { course, module: course.children[0], index: 0 }, after: null },
            callBack: null,
          })
        )
      } else {
        let actuals = {}
        if (response.data.data.quota_actual_task === 'yes') {
          const userId = response.data.user_id
          let year = moment(response.data.due_at).year()
          let month = moment(response.data.due_at).month()
          if (month === 0) {
            month = 12
            year = year - 1
          }
          const actualRes = yield api.getActualsCount(userId, month, year)
          if (actualRes.ok) {
            actuals = { actualData: actualRes.data }
            const start = moment([year, month - 1])
            const end = moment(start).endOf('month')
            const startDate = start.format('YYYY-MM-DD')
            const endDate = end.format('YYYY-MM-DD')
            yield put(
              DevActions.fetchfeedsRequest({
                userId,
                startDate,
                endDate,
                order: 'id',
                type: 'quotas',
              })
            )
          }
        }
        const modalData = yield select(state => state.app.modalData)
        const data = {
          before: { ...modalData.before, card: { ...response.data, ...actuals } },
          after: null,
        }
        yield put(AppActions.modalRequest({ type: null, data, callBack: null }))
      }
    } else {
      yield put(MngActions.fetchtaskdetailFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchtaskdetailFailure())
  }
}

// Update Task Card Event
export function* updatetaskRequest(api, action) {
  try {
    const { event, cardId } = action
    const response = yield api.updateCard(event, cardId)

    if (response.ok) {
      yield put(MngActions.updatetaskSuccess({ event, cardId }))
    } else {
      yield put(MngActions.updatetaskFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  } catch (e) {
    yield put(MngActions.updatetaskFailure())
  }
}

// Edit Card
export function* edittaskRequest(api, action) {
  try {
    const userId = yield select(state => state.app.id)
    const companyId = yield select(state => state.app.company_info.id)

    const { data, taskId } = action.payload
    const response = yield api.updateCardInstance(taskId, 'update', data)

    if (response.ok) {
      yield put(MngActions.fetchtasksfeedRequest(userId, 100, 1))
      yield put(MngActions.companyprojectsRequest([companyId]))
      yield call(fetchTasksFromProjects, api, {})
      yield put(MngActions.edittaskSuccess(null))
    } else {
      yield put(MngActions.edittaskFailure())
    }
  } catch (e) {
    yield put(MngActions.edittaskFailure())
  }
}

// Delete Card
export function* deletetaskRequest(api, action) {
  try {
    const { cardInstanceId, mode, after } = action
    const userId = yield select(state => state.app.id)
    const companyId = yield select(state => state.app.company_info.id)
    const response = yield api.updateCardInstance(cardInstanceId, 'delete')

    if (response.ok) {
      toast.success('Your task was successfully deleted!', {
        position: toast.POSITION.TOP_CENTER,
      })
      if (!isNil(after)) yield put({ ...after })
      yield put(MngActions.deletetaskSuccess(response.data))
    } else {
      yield put(MngActions.deletetaskFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  } catch (e) {
    yield put(MngActions.deletetaskFailure())
    toast.error('Oops, Your action cannot be completed!. Please try again', {
      position: toast.POSITION.TOP_CENTER,
    })
  }
}

// Add Comment
export function* addmngcommentRequest(api, action) {
  try {
    const { payload, cardInstanceId } = action
    const finalData = {
      comment: {
        card_instance_id: cardInstanceId,
        data: { body: payload },
      },
    }
    const companyId = yield select(state => state.app.company_info.id)
    const response = yield api.addComment(finalData)

    if (response.ok) {
      yield put(MngActions.addmngcommentSuccess(response.data))
      yield put(MngActions.fetchtaskdetailRequest(cardInstanceId))
      yield put(MngActions.companyprojectsRequest([companyId]))
    } else {
      yield put(MngActions.addmngcommentFailure())
    }
  } catch (e) {
    yield put(MngActions.addmngcommentFailure())
  }
}

// Add Tasks
export function* addtaskRequest(api, action) {
  try {
    const { payload, users, projectId } = action
    const userId = yield select(state => state.app.id)
    const attachment = yield select(state => state.app.learnUploadURL)
    const currentCompanyInfo = yield select(state => state.app.company_info)
    const perPage = 100
    const page = 1
    let userList = yield select(state => state.app.employees)
    let assignedUsers = ''

    for (const user_id of users) {
      if (user_id === userId) {
        assignedUsers += 'you' + ','
      } else {
        const user = userList.filter(user => equals(user.id, user_id))
        assignedUsers += user[0].name + ','
      }
    }
    assignedUsers = assignedUsers.replace(/,\s*$/, '')

    let splitResult = assignedUsers.split(',')
    let toastMessage = ''
    if (users.length === 1) toastMessage = assignedUsers
    else if (users.length === 2) toastMessage = `${splitResult[0] + ' and ' + splitResult[1]}`
    else if (users.length === 3) {
      toastMessage = `${splitResult[0] + ' , ' + splitResult[1] + ' and ' + splitResult[2]}`
    } else if (users.length === 4) {
      toastMessage = `${splitResult[0] + ' , ' + splitResult[1] + ' , ' + splitResult[2] + ' and 1 other'}`
    } else {
      toastMessage = `${splitResult[0] +
        ' , ' +
        splitResult[1] +
        ' , ' +
        splitResult[2] +
        ' and ' +
        (users.length - 3) +
        ' others'}`
    }

    const cardData = {
      card: {
        card_template_id: null,
        card_type_id: 8,
        parent_id: null,
        data: {
          ...payload.data,
          promote_user_id: userId,
          type: 'single',
          company_id: currentCompanyInfo.id,
          attachment: attachment,
        },
        project_id: projectId,
        due_at: payload.due_at,
      },
      user_id: users,
    }
    const response = yield api.createCard(cardData)
    yield put(AppActions.uploadSuccess(''))
    if (response.ok) {
      const currentRoute = yield select(state => state.app.locations[0])
      yield put(AppActions.modalRequest({ type: '', data: null, callBack: null }))
      yield put(MngActions.addtaskSuccess(response.data))

      // refresh daily plan
      if (currentRoute === '/hcm/daily-plan') yield fetchtasksfeedRequest(api, { userId, perPage: 500, page })
      // refresh tasks & projects page
      if (currentRoute === '/hcm/tasks-projects') {
        const currentUsers = yield select(state => state.app.selectedEmployee['individual'])
        const userIds =
          currentUsers[0] === -1 ? userList.filter(item => item.id !== null).map(item => item.id) : currentUsers
        const project = yield select(state => state.manage.selectedProject)
        const payload = { projectId: project.id, users: userIds, project }
        yield put(MngActions.userprojecttaskRequest(payload))
      }
      yield call(fetchTasksFromProjects, api, {})
      if (
        userId !== users[0] ||
        users.length > 1 ||
        !equals(currentRoute, '/hcm/daily-plan' || '/hcm/tasks-projects')
      ) {
        toast.success('Your task has been assigned to ' + toastMessage, {
          position: toast.POSITION.CENTRE_RIGHT,
          autoClose: 2000,
        })
      }
    } else {
      yield put(MngActions.addtaskFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.CENTRE_RIGHT,
        autoClose: 2000,
      })
    }
  } catch (e) {
    yield put(MngActions.addtaskFailure())
  }
}

// retrieve authors
export function* fetchauthorsRequest(api, action) {
  try {
    const { companyId } = action
    const response = yield api.getAuthors(companyId)

    if (response.ok) {
      yield put(MngActions.fetchauthorsSuccess(response.data))
    } else {
      yield put(MngActions.fetchauthorsFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchauthorsFailure())
  }
}

export function* searchmodulesRequest(api, action) {
  try {
    const { payload } = action
    const { author, department, competency, category, type, search } = payload
    let options = 'per_page=100'
    if (!isNil(author)) options = `${options}&author_id[]=${author}`
    if (!isNil(department)) options = `${options}&department_id[]=${department}`
    if (!isNil(competency)) options = `${options}&competency_id[]=${competency}`
    if (!isNil(category)) options = `${options}&category_id[]=${category}`
    if (type === 'habit') options = `${options}&card_type_id[]=8`
    if (!isEmpty(search) && !isNil(search)) options = `${options}&search=${search}`
    const mode = type === 'quota' ? 'quota_templates' : 'modules'
    const response = yield api.getDevLibrarySearchModules(options, mode)
    if (response.ok) {
      const modules = response.data.data.map(course => {
        course.data.thumb_url = convertUrl(course.data.thumb_url)
        return course
      })

      const after = yield select(state => state.app.modalData.after)
      yield put(MngActions.searchmodulesSuccess(modules))
      yield put(
        AppActions.modalRequest({
          type: null,
          data: { before: { type, modules }, after },
        })
      )
    } else {
      yield put(MngActions.searchmodulesFailure())
    }
  } catch (e) {
    yield put(MngActions.searchmodulesFailure())
  }
}

// Assign Trainings
export function* assigntrainingRequest(api, action) {
  try {
    const { payload, after, attendance } = action
    const afterAction = after || payload.after
    const startDate = afterAction
      ? afterAction.startDate
      : moment()
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD')
    const endDate = afterAction
      ? afterAction.endDate
      : moment()
          .subtract(1, 'months')
          .endOf('month')
          .format('YYYY-MM-DD')

    const cardType =
      payload.card_type === 'habitslist'
        ? 'Habit Schedule'
        : payload.card_type === 'program'
        ? 'Program'
        : payload.card_type === 'task'
        ? 'Task'
        : replace(/^./, toUpper(slice(0, 1, payload.card_type)), slice(0, -1, payload.card_type))

    let response = {}
    if (payload.card_type === 'scorecards') {
      if (!isNil(payload.preAssignees)) {
        let scorecard = []
        for (const employee of payload.preAssignees) {
          const { scorecards } = employee.extra
          const scorecardIds = scorecards.map(x => x.id)
          scorecard = concat(scorecard, scorecardIds)
        }
        for (const id of scorecard) {
          yield api.postDeleteScorecard({ scorecard: { id } })
        }
      }
      response = yield api.assignScorecard(payload)
    } else if (payload.card_type === 'program') {
      response = yield api.postProgramEvent('start', payload.data)
    } else {
      response = yield api.assignTraining(payload)
    }
    const userId = yield select(state => state.app.id)
    const companyId = yield select(state => state.app.company_info.id)

    if (response.ok) {
      if (response.data[0]?.original?.message) {
        toast.error(response.data[0]?.original?.message, {
          position: toast.POSITION.CENTRE_RIGHT,
        })
        yield put(MngActions.assigntrainingFailure())
        return
      }
      if (!isNil(attendance)) {
        const { course, users } = attendance
        const cards = filter(propEq('status', 3), course.children)
        const templates = cards.map(x => x.id)
        for (const user of users) {
          const options = `card_template_id[]=${course.id}`
          const res = yield api.getLearnFeeds('training', user, options)
          if (res.ok) {
            const training = res.data.data[0]
            for (const childCard of training.children) {
              if (includes(childCard.card_template_id, templates)) {
                yield api.updateCard('completed', childCard.id)
              }
            }
          }
        }
      }
      if (payload.card_type === 'scorecards') {
        yield call(individualperformancereviewRequest, api, {
          userId: payload.user_id,
          companyId,
          startDate,
          endDate,
        })
      }
      toast.success(cardType + ' is assigned successfully', {
        position: toast.POSITION.CENTRE_RIGHT,
      })
      if (!isNil(afterAction)) {
        const { mode, card } = afterAction
        if (!isNil(mode) && mode === 'reassign') {
          if (payload.card_type === 'program') {
            yield api.postProgramEvent('delete', { program: { id: payload.data.program_id } })
          } else {
            yield api.updateCardInstance(card.id, 'delete')
          }
        }
        yield put({ ...afterAction })
      }
      yield fetchtasksfeedRequest(userId, 100, 1)
      yield put(MngActions.assigntrainingSuccess(response.data))
      yield put(
        AppActions.modalRequest({
          type: '',
          data: { before: null, after: null },
          callBack: null,
        })
      )
    } else {
      yield put(MngActions.assigntrainingFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.CENTRE_RIGHT,
      })
    }
  } catch (e) {
    yield put(MngActions.assigntrainingFailure())
  }
}

export function* assigncoursesRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postLibraryTrackSave(payload)

    if (response.ok) {
      toast.success('Your training schedule has been assigned', {
        position: toast.POSITION.CENTRE_RIGHT,
      })
      yield call(history.push, '/hcm/reports')
      yield put(MngActions.assigntrainingSuccess())
    } else {
      yield put(MngActions.assigntrainingFailure())
    }
  } catch (e) {
    yield put(MngActions.assigntrainingFailure())
  }
}

// Unassign Content
export function* unassigncontentRequest(api, action) {
  try {
    const { data, after } = action.payload
    const response = yield api.postUnassignContent(data)

    if (response.ok) {
      if (!isNil(after)) yield put({ ...after })
      toast.success('Your content was successfully unassigned!', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(MngActions.unassigncontentSuccess())
    } else {
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(MngActions.unassigncontentFailure())
    }
  } catch (e) {
    yield put(MngActions.unassigncontentFailure())
  }
}

// Add project
export function* addprojectRequest(api, action) {
  try {
    const { payload } = action
    const companyId = yield select(state => state.app.company_info.id)
    const response = yield api.postMngProjectsAddNew(payload.data, companyId)

    if (response.ok) {
      yield put(AppActions.modalRequest({ type: '', data: null, callBack: null }))
      yield put(AppActions.postmulticompanydataRequest())
      yield put(MngActions.addprojectSuccess(response.data))
    } else {
      yield put(MngActions.addprojectFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  } catch (e) {
    yield put(MngActions.addprojectFailure())
  }
}

// Update project
export function* updateprojectRequest(api, action) {
  try {
    const { payload } = action
    const currentCompanyInfo = yield select(state => state.app.company_info)
    const response = yield api.postMngProjectsUpdate(payload.data, currentCompanyInfo.id, payload.id)
    if (response.ok) {
      yield put(AppActions.modalRequest({ type: '', data: null, callBack: null }))
      yield put(MngActions.companyprojectsRequest([currentCompanyInfo.id]))
      yield put(MngActions.updateprojectSuccess(response.data))
    } else {
      yield put(MngActions.updateprojectFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  } catch (e) {
    yield put(MngActions.updateprojectFailure())
  }
}

// Delete project
export function* deleteprojectRequest(api, action) {
  try {
    const { projectId } = action
    const currentCompanyInfo = yield select(state => state.app.company_info)
    const response = yield api.postMngProjectsDelete(projectId, currentCompanyInfo.id)
    if (response.ok) {
      yield put(MngActions.deleteprojectSuccess(response.data))
      yield put(MngActions.companyprojectsRequest([currentCompanyInfo.id]))
    } else {
      yield put(MngActions.deleteprojectFailure())
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
      })
    }
  } catch (e) {
    yield put(MngActions.deleteprojectFailure())
  }
}

function* addToTask(api, taskIds) {
  try {
    const currentCompanyInfo = yield select(state => state.app.company_info)
    const data = []
    for (const taskId of taskIds) {
      const response = yield call(api.getProjectTasks, currentCompanyInfo.id, taskId)
      if (response.ok) data.push(response.data[0])
    }
    const currentProject = yield select(state => state.manage.currentProject)
    if (currentProject === '') yield put(MngActions.selectedprojectRequest(data[0].id))
    yield put(MngActions.fetchprojectsdetailSuccess(data))
  } catch (e) {
    yield put(MngActions.fetchprojectsdetailFailure())
  }
}

function* fetchTasksFromProjects(api, action) {
  const projects = yield select(state => state.app.projects)
  const taskIds = projects.map(project => project.id)

  try {
    yield call(addToTask, api, taskIds)
    yield put(MngActions.fetchprojectdetailComplete())
  } catch (e) {
    yield put(MngActions.projectdetailfetchFailure())
  }
}

export function* fetchprojectsdetailRequest(api, action) {
  // yield call(fetchprojectsRequest, api, action) postmulticompanydataRequest
  yield call(fetchTasksFromProjects, api, action)
}

export function* updateProjectCards(api, action) {
  const { event, cardId } = action
  yield put(MngActions.updatetaskRequest(event, cardId))
}

export function* companyindividualRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.getIndividualTasks(payload)

    if (response.ok) {
      let individuals = values(response.data.individuals)
      if (!isNil(payload.user_id)) {
        individuals = filter(item => equals(payload.user_id, item.id), individuals)
      }
      individuals = sortBy(prop('name'), individuals)
      const report = {
        companies: response.data.companies,
        individuals,
        totals: response.data.totals,
      }
      yield put(MngActions.companyindividualSuccess(report))
    } else {
      yield put(MngActions.companyindividualFailure())
    }
  } catch (e) {
    yield put(MngActions.companyindividualFailure())
  }
}

export function* fetchengagementreportRequest(api, action) {
  try {
    const { payload, by = 'company', mode = 'trainings' } = action
    const response = yield api.postMngReportsEngagementReport(payload, by, mode)

    const nameSort = sortWith([ascend(prop('name'))])

    const data = {
      companies: nameSort(values(response.data.companies)),
      individuals: nameSort(values(response.data.individuals)),
      totals: [response.data.totals],
      type: mode,
      by,
    }

    if (response.ok) {
      yield put(MngActions.fetchengagementreportSuccess(data))
    } else {
      yield put(MngActions.fetchengagementreportFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchengagementreportFailure())
  }
}

export function* fetchcompanycareersRequest(api, action) {
  try {
    const { companyId } = action
    const response = yield api.getCompanyCareers(companyId)

    if (response.ok) {
      yield put(MngActions.fetchcompanycareersSuccess(response.data))
    } else {
      yield put(MngActions.fetchcompanycareersFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchcompanycareersFailure())
  }
}

export function* companyperformancereviewsRequest(api, action) {
  try {
    const { companyIds, userIds, perPage, page, startDate, endDate } = action
    const _companyIds = join(
      '&',
      companyIds.map(id => 'company_id[]=' + id)
    )
    const _userIds = userIds
      ? join(
          '&',
          userIds.map(id => 'user_id[]=' + id)
        )
      : null
    const response = yield api.getCompanyPerformanceReviews(_companyIds, _userIds, perPage, page, startDate, endDate)
    const statsResponse = yield api.getCompanyPerformanceReviewStats(_companyIds, _userIds, startDate, endDate)

    if (response.ok) {
      if (response.data.users) {
        response.data.users.forEach(item => {
          item.user.profile.avatar = convertUrl(item.user.profile.avatar, '/images/default.png')
        })
      } else {
        response.data.users = []
      }
      if (statsResponse.ok) {
        response.data.stats = statsResponse.data.totals
        response.data.departments = values(statsResponse.data.departments)
      } else response.data.stats = {}
      yield put(MngActions.companyperformancereviewsSuccess(response.data))
    } else {
      yield put(MngActions.companyperformancereviewsFailure())
    }
  } catch (e) {
    yield put(MngActions.companyperformancereviewsFailure())
  }
}

export function* individualperformancereviewRequest(api, action) {
  try {
    const { userId, companyId, route, startDate, endDate } = action
    const options = `?user_id=${userId}&company_id=${companyId}&date_start=${startDate}&date_end=${endDate}`
    const response = yield api.getIndividualPerformanceReview(options)

    if (response.ok) {
      const scorecards = response.data.scorecards

      for (let i = 0; i < scorecards?.length; i++) {
        const scorecard = scorecards[i]
        const templateIds = scorecard.data.quotas.map(item => item.quota_template_id)
        const _quotas = yield api.postDevLibraryCardTemplates({ quota_templates: templateIds })
        const quotas = _quotas.data.data
        scorecard.data.quotas = scorecard.data.quotas.map(item => {
          const quota = find(propEq('id', item.quota_template_id), quotas)
          return { ...item, ...quota }
        })
        scorecards[i] = scorecard
      }
      response.data.scorecards = scorecards

      yield put(MngActions.individualperformancereviewSuccess(response.data))

      const payload = {
        userId,
        currentId: response.data.performance?.id,
        companyId,
        startDate,
        endDate,
      }
      yield put(MngActions.getpreviousreviewtasksRequest(payload))

      if (route) yield call(history.push, route)
    } else {
      yield put(MngActions.individualperformancereviewFailure())
    }
  } catch (e) {
    yield put(MngActions.individualperformancereviewFailure())
  }
}

export function* postperformancereviewRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postPerformanceReview(payload)
    if (response.ok) {
      if (equals(2, payload.performance.status)) yield call(history.goBack, {})
      yield put(MngActions.postperformancereviewSuccess(response.data))
    } else {
      yield put(MngActions.postperformancereviewFailure())
    }
  } catch (e) {
    yield put(MngActions.postperformancereviewFailure())
  }
}

export function* getperformancereviewsRequest(api, action) {
  try {
    const { id, companyId, current = 1, per = 10, route = null, order = 'date_start', startDate, endDate } = action
    const response = yield api.getPerformanceReviews(id, current, per, order, startDate, endDate, companyId)

    if (response.ok) {
      yield put(MngActions.getperformancereviewsSuccess(response.data))
      if (route) yield call(history.push, route)
    } else {
      yield put(MngActions.getperformancereviewsFailure())
    }
  } catch (e) {
    yield put(MngActions.getperformancereviewsFailure())
  }
}

export function* getpreviousreviewtasksRequest(api, action) {
  try {
    const { userId, currentId, companyId, startDate, endDate } = action.payload
    const response = yield api.getPerformanceReviews(userId, 1, 500, 'date_start', startDate, endDate, companyId)

    if (response.ok) {
      const prevReviews = filter(x => !equals(x.id, currentId), response.data.data)
      let tasks = [],
        trainings = []

      if (prevReviews.length > 0) {
        const options = join(
          '&',
          prevReviews.map(({ id }) => 'performance_id[]=' + id)
        )
        const tasksRes = yield api.getLearnFeeds('tasks', userId, options)
        if (tasksRes.ok) tasks = tasksRes.data.data

        const trainingRes = yield api.getLearnFeeds('training', userId, options)
        if (trainingRes.ok) trainings = trainingRes.data.data
      }

      yield put(MngActions.getpreviousreviewtasksSuccess({ tasks, trainings }))
    } else {
      yield put(MngActions.getpreviousreviewtasksFailure())
    }
  } catch (e) {
    yield put(MngActions.getpreviousreviewtasksFailure())
  }
}

export function* fetchcertificationsreportRequest(api, action) {
  try {
    const { mode, payload } = action
    const isNotNull = (val, key) => !isNil(val)
    const options = queryString.stringify(pickBy(isNotNull, payload))
    const response = yield api.getCertificationReport(mode, options)
    if (response.ok) {
      yield put(MngActions.fetchcertificationsreportSuccess({ type: mode, data: response.data }))
    } else {
      yield put(MngActions.fetchcertificationsreportFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchcertificationsreportFailure())
  }
}

export function* fetchcareerreportsRequest(api, action) {
  try {
    const { mode, payload } = action
    const isNotNull = (val, key) => !isNil(val)
    const options = queryString.stringify(pickBy(isNotNull, payload))
    const response = yield api.getCareerReports(mode, options)
    if (response.ok) {
      yield put(MngActions.fetchcareerreportsSuccess({ type: mode, data: response.data }))
    } else {
      yield put(MngActions.fetchcareerreportsFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchcareerreportsFailure())
  }
}

export function* fetchhireorientationreportRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postHireOrientationReport(payload)

    if (response.ok) {
      yield put(MngActions.fetchhireorientationreportSuccess(response.data))
    } else {
      yield put(MngActions.fetchhireorientationreportFailure())
    }
  } catch (e) {
    yield put(MngActions.fetchhireorientationreportFailure())
  }
}

export function* getmanagerdashboardRequest(api, action) {
  try {
    const { companyId, dateStart, dateEnd } = action
    const response = yield api.getManagerDashboard(companyId, dateStart, dateEnd)

    if (response.ok) {
      yield put(MngActions.getmanagerdashboardSuccess(response.data))
    } else {
      yield put(MngActions.getmanagerdashboardFailure())
    }
  } catch (e) {
    yield put(MngActions.getmanagerdashboardFailure())
  }
}

export function* postquotaactualsRequest(api, action) {
  try {
    const { data, after, scorecards } = action.payload
    const { callback } = action
    const response = yield api.postQuotaActualsSave(data)

    if (response.ok) {
      if (response.data.actuals) {
        if (!isNil(after)) yield put({ ...after })
        const _after = { actuals: response.data.actuals, scorecards }
        yield put(MngActions.postquotaactualsSuccess(_after))
        if (callback && callback.onRefresh) yield callback.onRefresh()

        let modalData = yield select(state => state.app.modalData)
        if (modalData.before && modalData.before.scorecards) {
          let modalCallBack = yield select(state => state.app.modalCallBack)
          let _scorecards = clone(modalData.before.scorecards)
          modalData = clone(modalData)
          response.data.actuals.forEach(actual => {
            _scorecards = _scorecards.map(scorecard => {
              scorecard.quotas = scorecard.quotas.map(item => {
                if (item.actuals && item.actuals.length > 0) {
                  const idx = findIndex(x => x.id == actual.id)(item.actuals)
                  if (idx > -1) {
                    item.actuals[idx] = actual
                  } else {
                    if (actual.quota_id == item.id) item.actuals.push(actual)
                  }
                } else {
                  if (actual.quota_id == item.id) item.actuals.push(actual)
                }
                return item
              })
              return scorecard
            })
          })
          modalData.before.scorecards = _scorecards
          yield put(
            AppActions.modalRequest({
              type: null,
              data: modalData,
              callBack: modalCallBack,
            })
          )
        }
      } else {
        toast.warn("You don't have permission to udpate these quotas", {
          position: toast.POSITION.TOP_RIGHT,
        })
        yield put(MngActions.postquotaactualsFailure())
      }
    } else {
      yield put(MngActions.postquotaactualsFailure())
    }
  } catch (e) {
    yield put(MngActions.postquotaactualsFailure())
  }
}

export function* getanniversarybirthdayRequest(api, action) {
  try {
    const { companyId, base, orderBy, asc, month_start, month_end } = action
    const order = asc ? 'ASC' : 'DESC'
    const response = yield api.getAnniversaryBirthdayReports(companyId, base, orderBy, order, month_start, month_end)

    if (response.ok) {
      for (let active of response.data.active.employees[0]) {
        active.profile.avatar = convertUrl(active.profile.avatar, '/images/default.png')
      }
      for (let prior of response.data.prior.employees[0]) {
        prior.profile.avatar = convertUrl(prior.profile.avatar, '/images/default.png')
      }
      for (let recruit of response.data.recruit.employees[0]) {
        recruit.profile.avatar = convertUrl(recruit.profile.avatar, '/images/default.png')
      }

      const data = {
        active: response.data.active,
        prior: response.data.prior,
        recruit: response.data.recruit,
      }
      yield put(MngActions.getanniversarybirthdaySuccess(data))
    } else {
      yield put(MngActions.getanniversarybirthdayFailure())
    }
  } catch (e) {
    yield put(MngActions.getanniversarybirthdayFailure())
  }
}

export function* posttrainingreportsRequest(api, action) {
  try {
    const { payload, mode } = action
    const response = yield api.postTrainingReport(payload, mode)
    if (response.ok) {
      yield put(MngActions.posttrainingreportsSuccess(response.data, mode))
    } else {
      yield put(MngActions.posttrainingreportsFailure())
    }
  } catch (e) {
    yield put(MngActions.posttrainingreportsFailure())
  }
}

export function* postquotaactualcommentRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postQuotaActualComment(payload)
    if (response.ok) {
      yield put(MngActions.postquotaactualcommentSuccess(response.data))
      let modalData = yield select(state => state.app.modalData)
      let modalCallBack = yield select(state => state.app.modalCallBack)
      modalData = clone(modalData)
      let scorecards = modalData.before.scorecards
      scorecards = scorecards.map(scorecard => {
        scorecard.quotas = scorecard.quotas.map(item => {
          if (item.actuals && item.actuals.length > 0) {
            const idx = findIndex(x => x.id == response.data.id)(item.actuals)
            if (idx > -1) item.actuals[idx] = response.data
          }
          return item
        })
        return scorecard
      })
      modalData.before.scorecards = scorecards
      yield put(
        AppActions.modalRequest({
          type: null,
          data: modalData,
          callBack: modalCallBack,
        })
      )
    } else {
      yield put(MngActions.postquotaactualcommentFailure())
    }
  } catch (e) {
    yield put(MngActions.postquotaactualcommentFailure())
  }
}

export function* postsignoffRequest(api, action) {
  try {
    const { payload, completed, after } = action
    const response = yield api.postSignOff(payload)

    if (response.ok && response.data.status == 'success') {
      yield put(MngActions.postsignoffSuccess(response.data))

      const agreed = response.data.performance.data.agreed
      if (completed || (agreed.supervisor && agreed.employee)) {
        let performance = response.data.performance
        performance = { ...performance, status: 2 }
        const res = yield api.postPerformanceReview({ performance })
        if (res.ok) {
          if (after) yield put({ ...after })
          yield put(MngActions.postperformancereviewSuccess(res.data))
          yield call(history.goBack, {})
          toast.success('Your performance review has been completed!')
        } else {
          toast.error('Your performance review has not been completed!')
        }
      } else {
        toast.success('Your email and password is correct!')
      }
    } else {
      yield put(MngActions.postsignoffFailure())
      toast.error('Oops, Your email or password is incorrect!. Please try again', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  } catch (e) {
    yield put(MngActions.postsignoffFailure())
  }
}

export function* postquotareportRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postQuotaReports(payload)
    if (response.ok) {
      yield put(MngActions.postquotareportSuccess(response.data))
    } else {
      yield put(MngActions.postquotareportFailure())
    }
  } catch (e) {
    yield put(MngActions.postquotareportFailure())
  }
}

export function* posttrainingcompetencyreportRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postTrainingCompetencyReports(payload)
    if (response.ok) {
      yield put(MngActions.posttrainingcompetencyreportSuccess(response.data))
    } else {
      yield put(MngActions.posttrainingcompetencyreportFailure())
    }
  } catch (e) {
    yield put(MngActions.posttrainingcompetencyreportFailure())
  }
}

export function* postterminateemployeeRequest(api, action) {
  try {
    const { companyId, payload } = action
    const response = yield api.postTerminateEmployee(companyId, payload)
    if (response.ok) {
      yield put(MngActions.postterminateemployeeSuccess(response.data))
      yield put(AppActions.postmulticompanydataRequest())
    } else {
      yield put(MngActions.postterminateemployeeFailure())
    }
  } catch (e) {
    yield put(MngActions.postterminateemployeeFailure())
  }
}

export function* postindividualquotareportRequest(api, action) {
  try {
    const { payload, route } = action
    const response = yield api.postIndividualQuotaReport(payload)
    if (response.ok) {
      yield put(MngActions.postindividualquotareportSuccess(response.data))
      if (route) yield call(history.push, route)
    } else {
      yield put(MngActions.postindividualquotareportFailure())
    }
  } catch (e) {
    yield put(MngActions.postindividualquotareportFailure())
  }
}

export function* getquotasactualsRequest(api, action) {
  try {
    const { userId } = action
    const response = yield api.getQuotasActuals(userId)
    if (response.ok) {
      const modalData = yield select(state => state.app.modalData)
      const modalCallBack = yield select(state => state.app.modalCallBack)
      let { before, after } = clone(modalData)
      before.scorecards[0].quotas = response.data
      const payload = { type: null, data: { before, after }, callback: modalCallBack }
      yield put(AppActions.modalRequest(payload))
      yield put(MngActions.getquotasactualsSuccess(response.data))
    } else {
      yield put(MngActions.getquotasactualsFailure())
    }
  } catch (e) {
    yield put(MngActions.getquotasactualsFailure())
  }
}
