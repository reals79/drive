import { createReducer } from 'reduxsauce'
import { produce } from 'immer'
import { concat, equals, filter, findIndex, isNil, prop, propEq, sortBy, values } from 'ramda'
import moment from 'moment'
import { MngTypes } from '~/actions/manage'
import { removeStatus } from '~/services/util'

const initialState = {
  status: [],
  tasksData: {
    tasksCard: { data: [] },
    statsCard: { data: [] },
    habitsCard: [],
  },
  tasksReport: {
    companies: [],
    individuals: [],
    totals: {},
  },
  projects: [],
  companyProjects: [],
  currentUsers: [],
  selectedProject: {},
  selectedProjectTasks: {
    tasks: [],
    habits: [],
  },
  selectedProjectCompletedTasks: {
    tasks: [],
    habits: [],
  },

  projectTasks: [],
  currentProject: null,

  companyCareers: [],

  companyPerformanceReviews: {
    page: 1,
    last_page: 1,
    users: [],
    stats: {
      employees: { count: 0 },
      actuals_saved: { count: 0, percent: 0 },
      reviews_completed: { count: 0, percent: 0 },
      scorecards: { count: 0, percent: 0 },
    },
    departments: [],
  },
  individualPerformanceReview: {
    performance: { trainings: [], tasks: [] },
    scorecards: [],
  },
  performanceReviews: {
    current_page: 1,
    data: [],
    last_page: 1,
    per_page: 10,
    total: 1,
  },
  previousReviews: {
    tasks: [],
    trainings: [],
  },
  engagementReport: {
    trainings: [],
    newhires: [],
    performances: [],
    tasks: [],
    careers: [],
    records: [],
    users: [],
    totals: [],
  },
  certificationsReport: {
    type: 'employees',
    users: [],
    programs: [],
    page: 1,
    per_page: 20,
    last_page: 1,
    total: 1,
  },
  careerReport: {
    type: 'employees',
    users: [],
    programs: [],
    page: 1,
    per_page: 20,
    last_page: 1,
    total: 1,
  },
  newHireReport: {
    companies: {},
    individuals: {},
    totals: {
      certifications_assigned: 0,
      certifications_authored: 0,
      certifications_completed: 0,
      new_hires: 0,
    },
  },
  managerDashboard: {
    user_list: '',
    career: { average_completion: 0, employee_careers: 0, promotions_possible: 0, top_users: [] },
    employee_records: {
      active_signed_documents: 'N/A',
      average_performance: 0,
      employee_careers: 0,
      habit_schedules: 0,
      new_hires: 0,
      scorecards: 0,
      tasks_assigned: 0,
      total_employees: 0,
      training_assigned: 0,
    },
    new_hire: {
      certifications_assigned: 0,
      certifications_completed: 0,
      new_hires: 0,
      top_users: [],
    },
    performance: {
      average_reviews: 0,
      scorecards: 0,
      task_commitments: 0,
      top_users: [],
      training_commitments: 0,
    },
    tasks: {
      active_projects: 0,
      habits_completed: 0,
      popular_projects: [],
      tasks_completed: 0,
      top_users: [],
    },
    training: {
      assignments: 'Yes',
      courses_completed: 0,
      modules_completed: 0,
      top_users: [],
    },
    users: [],
  },
  anniversarybirthdayReport: {
    active: [],
    prior: [],
    recruit: [],
  },

  trainingReports: {
    company: {
      overall: {},
      career: {},
      manager: {},
      self: {},
      companies: [],
      page: 1,
      per_page: 25,
      last_page: 1,
      from: 1,
      to: 1,
      total: 1,
    },
    individual: {
      overall: {},
      career: {},
      manager: {},
      self: {},
      individuals: [],
      page: 1,
      per_page: 25,
      last_page: 1,
      from: 1,
      to: 1,
      total: 1,
    },
  },
  quotaReports: {
    quota_templates: [],
  },
  trainingCompetencyReport: {
    process: {},
    skills: {},
    product_knowledge: {},
    temperament: {},
  },
  individualQuotaReport: {
    current_page: 1,
    employee_name: '',
    quota_data: {},
    per_page: 25,
    last_page: 1,
    from: 1,
    to: 1,
    total: 1,
  },
}

/**
 * GET Career Program
 * @param {*} draft
 * @param {*} action
 */
const getcareerprogramRequest = produce((draft, action) => {
  draft.status.push('pending-mgc')
})
const getcareerprogramSuccess = produce((draft, action) => {
  const { program, profile } = action.response

  if (program.type == 1) {
    // program career
    const pindex = findIndex(propEq('id', program.id), draft.careerReport.programs)

    if (pindex > -1) {
      draft.careerReport.programs[pindex] = program
    } else {
      draft.careerReport.programs = concat(draft.careerReport.programs, [program])
    }

    if (!isNil(program.user_id)) {
      const uindex = findIndex(propEq('id', program.user_id), draft.careerReport.users)
      if (uindex > -1) {
        const cindex = findIndex(e => equals(e.id, program.id), draft.careerReport.users[uindex].stats.open_careers)
        if (cindex > -1) {
          draft.careerReport.users[uindex].stats.open_careers[cindex] = program
        } else {
          draft.careerReport.users[uindex].stats.open_careers = concat(
            draft.careerReport.users[uindex].stats.open_careers,
            [program]
          )
        }
      } else {
        draft.careerReport.users = concat(draft.careerReport.users, [
          {
            id: program.user_id,
            profile,
            stats: { open_careers: [program] },
          },
        ])
      }
    }
  } else if (program.type == 2) {
    const pindex = findIndex(propEq('id', program.id), draft.certificationsReport.programs)

    if (pindex > -1) {
      draft.certificationsReport.programs[pindex] = program
    } else {
      draft.certificationsReport.programs = concat(draft.certificationsReport.programs, [program])
    }

    if (!isNil(program.user_id)) {
      const uindex = findIndex(propEq('id', program.user_id), draft.certificationsReport.users)
      if (uindex > -1) {
        const cindex = findIndex(
          e => equals(e.id, program.id),
          draft.certificationsReport.users[uindex].stats.open_certifications
        )
        if (cindex > -1) {
          draft.certificationsReport.users[uindex].stats.open_certifications[cindex] = program
        } else {
          draft.certificationsReport.users[uindex].stats.open_certifications = concat(
            draft.certificationsReport.users[uindex].stats.open_certifications,
            [program]
          )
        }
      } else {
        draft.certificationsReport.users = concat(draft.certificationsReport.users, [
          {
            id: program.user_id,
            profile,
            stats: { open_certifications: [program] },
          },
        ])
      }
    }
  }
  draft.status = removeStatus('pending-mgc', draft.status)
})
const getcareerprogramFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgc', draft.status)
})

const postcareerprogramRequest = produce((draft, action) => {
  draft.status.push('pending-mpc')
})
const postcareerprogramSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mpc', draft.status)
})
const postcareerprogramFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpc', draft.status)
})

const fetchtasksfeedRequest = produce((draft, action) => {
  draft.status.push('pending-mft')
})
const fetchtasksfeedSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mft', draft.status)
  draft.tasksData = action.response
})
const fetchtasksfeedFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mft', draft.status)
})

const companyprojectsRequest = produce((draft, action) => {
  draft.status.push('pending-mcp')
})
const companyprojectsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mcp', draft.status)
  draft.companyProjects = action.response
})
const companyprojectsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mcp', draft.status)
})

const selectprojectRequest = produce((draft, action) => {
  draft.status.push('pending-msp')
})
const selectprojectSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-msp', draft.status)
  draft.selectedProject = action.response
})
const selectprojectFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-msp', draft.status)
})

const userprojecttaskRequest = produce((draft, action) => {
  draft.status.push('pending-mup')
})
const userprojecttaskSuccess = produce((draft, action) => {
  const { completionType, tasks, habits } = action.response
  draft.status = removeStatus('pending-mup', draft.status)
  if (isNil(completionType)) {
    draft.selectedProjectTasks = { tasks, habits }
  } else {
    draft.selectedProjectCompletedTasks = { tasks, habits }
  }
})
const userprojecttaskFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mup', draft.status)
})

// Update Task Card Event
const updatetaskRequest = produce((draft, action) => {
  draft.status.push('pending-mut')
})
const updatetaskSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mut', draft.status)
  const { event, cardId } = action.response
  const tIndex = findIndex(propEq('id', cardId), draft.selectedProjectTasks.tasks)
  const hIndex = findIndex(propEq('id', cardId), draft.selectedProjectTasks.habits)
  const type = tIndex > -1 ? 'tasks' : 'habits'
  if (tIndex > -1 || hIndex > -1) {
    const status = event === 'completed' ? 3 : 0
    const completed_at = event === 'completed' ? moment(new Date()).format('YYYY-MM-DD hh:mm:ss') : null
    const index = tIndex > -1 ? tIndex : hIndex
    draft.selectedProjectTasks[type][index].status = status
    draft.selectedProjectTasks[type][index].completed_at = completed_at
  }
})
const updatetaskFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mut', draft.status)
})

// Edit Card
const edittaskRequest = produce((draft, action) => {
  draft.status.push('pending-met')
})
const edittaskSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-met', draft.status)
})
const edittaskFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-met', draft.status)
})

// Delete Card
const deletetaskRequest = produce((draft, action) => {
  draft.status.push('pending-mde')
})
const deletetaskSuccess = produce((draft, action) => {
  const task = action.response
  const tasks = filter(x => x.id !== task.id, draft.selectedProjectTasks.tasks)
  const habits = filter(x => x.id !== task.id, draft.selectedProjectTasks.habits)
  draft.selectedProjectTasks = { tasks, habits }
  draft.status = removeStatus('pending-mde', draft.status)
})
const deletetaskFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mde', draft.status)
})

// Retrieving TaskDetail
const fetchtaskdetailRequest = produce((draft, action) => {
  draft.status.push('pending-mfa')
})
const fetchtaskdetailSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mfa', draft.status)
})
const fetchtaskdetailFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfa', draft.status)
})

// Add Comment
const addmngcommentRequest = produce((draft, action) => {
  draft.status.push('pending-mac')
})
const addmngcommentSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mac', draft.status)
})
const addmngcommentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mac', draft.status)
})

// Adding Taks
const addtaskRequest = produce((draft, action) => {
  draft.status.push('pending-maa')
})
const addtaskSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-maa', draft.status)
})
const addtaskFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-maa', draft.status)
})

// Retrieving authors
const fetchauthorsRequest = produce((draft, action) => {
  draft.status.push('pending-mfu')
})
const fetchauthorsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mfu', draft.status)
  draft.authorsList = action.response
})
const fetchauthorsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfu', draft.status)
})

const searchmodulesRequest = produce((draft, action) => {
  draft.status.push('pending-msm')
})
const searchmodulesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-msm', draft.status)
})
const searchmodulesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-msm', draft.status)
})

// Assign Training
const assigntrainingRequest = produce((draft, action) => {
  draft.status.push('pending-mai')
})
const assigntrainingSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mai', draft.status)
})
const assigntrainingFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mai', draft.status)
})

const assigncoursesRequest = produce((draft, action) => {
  draft.status.push('pending-mag')
})
const assigncoursesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mag', draft.status)
})
const assigncoursesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mag', draft.status)
})

// Unassined content
const unassigncontentRequest = produce((draft, action) => {
  draft.status.push('pending-mue')
})
const unassigncontentSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mue', draft.status)
})
const unassigncontentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mue', draft.status)
})

//Add project
const addprojectRequest = produce((draft, action) => {
  draft.status.push('pending-mao')
})
const addprojectSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mao', draft.status)
  const { id, name, company_id, data } = action.response
  const project = {
    company_id,
    id,
    data,
    deleted_at: null,
    users: data?.users?.map(item => ({ id: item, name: '' })),
    name,
    task_stats: { complete: 0, mtd_completion: 0, open: 0, past_due: 0, total: 0 },
  }
  draft.companyProjects.push(project)
})
const addprojectFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mao', draft.status)
})

// Update Project
const updateprojectRequest = produce((draft, action) => {
  draft.status.push('pending-muj')
})
const updateprojectSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-muj', draft.status)
})
const updateprojectFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-muj', draft.status)
})

// Delete Project
const deleteprojectRequest = produce((draft, action) => {
  draft.status.push('pending-mdo')
})
const deleteprojectSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mdo', draft.status)
})
const deleteprojectFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mdo', draft.status)
})

// Projects Page
const fetchprojectsdetailRequest = produce((draft, action) => {
  draft.status.push('pending-mfs')
})
const fetchprojectsdetailSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mfs', draft.status)
  draft.projectTasks = action.response
})
const fetchprojectsdetailFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfs', draft.status)
})
const fetchprojectdetailComplete = produce((draft, action) => {
  draft.status = removeStatus('pending-mfs', draft.status)
})

const companyindividualRequest = produce((draft, action) => {
  draft.status.push('pending-mci')
})
const companyindividualSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mci', draft.status)
  draft.tasksReport = action.response
})
const companyindividualFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mci', draft.status)
})

// Engagement Report
const fetchengagementreportRequest = produce((draft, action) => {
  draft.status.push('pending-mfr')
})
const fetchengagementreportSuccess = produce((draft, action) => {
  const { companies, individuals, by, type, totals } = action.response
  draft.engagementReport[type] = equals('company', by) ? companies : individuals
  draft.engagementReport['totals'] = totals
  draft.status = removeStatus('pending-mfr', draft.status)
})
const fetchengagementreportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfr', draft.status)
})

// Certifications Report
const fetchcertificationsreportRequest = produce((draft, action) => {
  draft.status.push('pending-mfi')
})
const fetchcertificationsreportSuccess = produce((draft, action) => {
  const { type, data } = action.response
  draft.certificationsReport.type = type
  draft.certificationsReport.last_page = data.last_page
  draft.certificationsReport.total = data.total
  if (type == 'employees') {
    draft.certificationsReport.users = data.users
  } else {
    draft.certificationsReport.programs = data.programs
  }
  draft.status = removeStatus('pending-mfi', draft.status)
})
const fetchcertificationsreportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfi', draft.status)
})

// Career Report
const fetchcareerreportsRequest = produce((draft, action) => {
  draft.status.push('pending-mfg')
})
const fetchcareerreportsSuccess = produce((draft, action) => {
  const { type, data } = action.response
  draft.careerReport.type = type
  draft.careerReport.from = data.from
  draft.careerReport.last_page = data.last_page
  draft.careerReport.page = data.page
  draft.careerReport.per_page = data.per_page
  draft.careerReport.to = data.to
  draft.careerReport.total = data.total
  if (data.users) draft.careerReport.users = data.users
  if (data.programs) draft.careerReport.programs = data.programs
  draft.status = removeStatus('pending-mfg', draft.status)
})
const fetchcareerreportsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfg', draft.status)
})

const fetchhireorientationreportRequest = produce((draft, action) => {
  draft.status.push('pending-mfz')
})
const fetchhireorientationreportSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mfz', draft.status)
  draft.newHireReport = action.response
})
const fetchhireorientationreportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfz', draft.status)
})

const fetchcompanycareersRequest = produce((draft, action) => {
  draft.status.push('pending-mfq')
})
const fetchcompanycareersSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mfq', draft.status)
  draft.companyCareers = action.response
})
const fetchcompanycareersFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mfq', draft.status)
})

const companyperformancereviewsRequest = produce((draft, action) => {
  draft.status.push('pending-mco')
})
const companyperformancereviewsSuccess = produce((draft, action) => {
  const { page, per_page, last_page, users, total, stats, departments } = action.response
  draft.status = removeStatus('pending-mco', draft.status)
  draft.companyPerformanceReviews.page = page
  draft.companyPerformanceReviews.per_page = per_page
  draft.companyPerformanceReviews.last_page = last_page
  draft.companyPerformanceReviews.users = users
  draft.companyPerformanceReviews.total = total
  draft.companyPerformanceReviews.stats = stats
  draft.companyPerformanceReviews.departments = departments
})
const companyperformancereviewsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mco', draft.status)
})

const individualperformancereviewRequest = produce((draft, action) => {
  draft.status.push('pending-mip')
})
const individualperformancereviewSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mip', draft.status)
  draft.individualPerformanceReview = action.response
})
const individualperformancereviewFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mip', draft.status)
})

const postperformancereviewRequest = produce((draft, action) => {
  draft.status.push('pending-mpp')
})
const postperformancereviewSuccess = produce((draft, action) => {
  const { performance } = action.response
  draft.individualPerformanceReview.performance.data = performance.data
  draft.individualPerformanceReview.performance.updated_at = performance.updated_at
  const index = findIndex(
    e => e.performance && e.performance.id == performance.id,
    draft.companyPerformanceReviews.users
  )
  if (index > -1) {
    draft.companyPerformanceReviews.users[index].performance = {
      ...draft.companyPerformanceReviews.users[index].performance,
      ...performance,
    }
  }
  draft.status = removeStatus('pending-mpp', draft.status)
})
const postperformancereviewFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpp', draft.status)
})

const getperformancereviewsRequest = produce((draft, action) => {
  draft.status.push('pending-mgp')
})
const getperformancereviewsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mgp', draft.status)
  draft.performanceReviews = action.response
})
const getperformancereviewsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgp', draft.status)
})

const getpreviousreviewtasksRequest = produce((draft, action) => {
  draft.status.push('pending-mgr')
})
const getpreviousreviewtasksSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mgr', draft.status)
  draft.previousReviews = action.response
})
const getpreviousreviewtasksFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgr', draft.status)
})

const getmanagerdashboardRequest = produce((draft, action) => {
  draft.status.push('pending-mgm')
})
const getmanagerdashboardSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mgm', draft.status)
  draft.managerDashboard = action.response
})
const getmanagerdashboardFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgm', draft.status)
})

const postquotaactualsRequest = produce((draft, action) => {
  draft.status.push('pending-mpq')
})
const postquotaactualsSuccess = produce((draft, action) => {
  const { actuals, scorecards } = action.response
  const idx = findIndex(
    e =>
      equals(
        e.scorecards.map(item => item.id),
        scorecards.map(item => item.id)
      ),
    draft.companyPerformanceReviews.users
  )

  if (idx > -1) {
    draft.companyPerformanceReviews.users[idx].scorecards = draft.companyPerformanceReviews.users[idx].scorecards.map(
      sd => {
        sd.quotas.map(quota => {
          actuals.forEach(ac => {
            const index = findIndex(e => e.id == ac.id, quota.actuals)
            if (index > -1) quota.actuals[index] = ac
          })
          return quota
        })
        return sd
      }
    )
  }
  draft.individualPerformanceReview.scorecards = draft.individualPerformanceReview.scorecards.map(sd => {
    sd.quotas = sd.quotas.map(quota => {
      quota.actuals = quota.actuals.map(ac => {
        const index = findIndex(e => e.quota_id == ac.quota_id, actuals)
        if (index > -1) return { ...ac, ...actuals[index] }
        return ac
      })
      return quota
    })
    return sd
  })
  draft.status = removeStatus('pending-mpq', draft.status)
})
const postquotaactualsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpq', draft.status)
})

const getanniversarybirthdayRequest = produce((draft, action) => {
  draft.status.push('pending-mgv')
})
const getanniversarybirthdaySuccess = produce((draft, action) => {
  const { active, prior, recruit } = action.response
  draft.status = removeStatus('pending-mgv', draft.status)
  draft.anniversarybirthdayReport.active = active
  draft.anniversarybirthdayReport.prior = prior
  draft.anniversarybirthdayReport.recruit = recruit
})
const getanniversarybirthdayFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgv', draft.status)
})

const posttrainingreportsRequest = produce((draft, action) => {
  draft.status.push('pending-mtt')
})
const posttrainingreportsSuccess = produce((draft, action) => {
  const { response, mode } = action
  if (equals('company', mode)) {
    const companies = sortBy(prop('name'), values(response.companies))
    draft.trainingReports.company = { ...response, companies }
  } else {
    const individuals = sortBy(prop('name'), values(response.individuals))
    draft.trainingReports.individual = { ...response, individuals }
  }
  draft.status = removeStatus('pending-mtt', draft.status)
})
const posttrainingreportsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mtt', draft.status)
})

const postquotaactualcommentRequest = produce((draft, action) => {
  draft.status.push('pending-mqc')
})
const postquotaactualcommentSuccess = produce((draft, action) => {
  const { response } = action
  draft.individualPerformanceReview.scorecards = draft.individualPerformanceReview.scorecards.map(scorecard => {
    scorecard.quotas = scorecard.quotas.map(item => {
      if (item.actuals && item.actuals.length > 0) {
        const idx = findIndex(x => x.id == response.id)(item.actuals)
        if (idx > -1) item.actuals[idx] = response
      }
      return item
    })
    return scorecard
  })
  draft.status = removeStatus('pending-mqc', draft.status)
})
const postquotaactualcommentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mqc', draft.status)
})

const postsignoffRequest = produce((draft, action) => {
  draft.status.push('pending-mps')
})
const postsignoffSuccess = produce((draft, action) => {
  const { performance } = action.response
  draft.status = removeStatus('pending-mps', draft.status)
  draft.individualPerformanceReview.performance.data.agreed = performance.data.agreed
})
const postsignoffFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mps', draft.status)
})

const postquotareportRequest = produce((draft, action) => {
  draft.status.push('pending-mpr')
})
const postquotareportSuccess = produce((draft, action) => {
  draft.quotaReports = action.response
  draft.status = removeStatus('pending-mpr', draft.status)
})
const postquotareportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpr', draft.status)
})

const posttrainingcompetencyreportRequest = produce((draft, action) => {
  draft.status.push('pending-mpm')
})
const posttrainingcompetencyreportSuccess = produce((draft, action) => {
  draft.trainingCompetencyReport = action.response
  draft.status = removeStatus('pending-mpm', draft.status)
})
const posttrainingcompetencyreportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpm', draft.status)
})

const postterminateemployeeRequest = produce((draft, action) => {
  draft.status.push('pending-mpn')
})
const postterminateemployeeSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mpn', draft.status)
})
const postterminateemployeeFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpn', draft.status)
})

const postindividualquotareportRequest = produce((draft, action) => {
  draft.status.push('pending-mph')
})
const postindividualquotareportSuccess = produce((draft, action) => {
  draft.individualQuotaReport = action.response
  draft.status = removeStatus('pending-mph', draft.status)
})
const postindividualquotareportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mph', draft.status)
})

const getquotasactualsRequest = produce((draft, action) => {
  draft.status.push('pending-mqa')
})
const getquotasactualsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mqa', draft.status)
})
const getquotasactualsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mqa', draft.status)
})

const selectusersRequest = produce((draft, action) => {
  draft.currentUsers = action.payload
})
const selectedprojectRequest = produce((draft, action) => {
  draft.currentProject = action.projectId
})
const clearRequest = produce((draft, action) => (draft = initialState))

export const reducer = createReducer(initialState, {
  [MngTypes.GETCAREERPROGRAM_REQUEST]: getcareerprogramRequest,
  [MngTypes.GETCAREERPROGRAM_SUCCESS]: getcareerprogramSuccess,
  [MngTypes.GETCAREERPROGRAM_FAILURE]: getcareerprogramFailure,

  [MngTypes.POSTCAREERPROGRAM_REQUEST]: postcareerprogramRequest,
  [MngTypes.POSTCAREERPROGRAM_SUCCESS]: postcareerprogramSuccess,
  [MngTypes.POSTCAREERPROGRAM_FAILURE]: postcareerprogramFailure,

  [MngTypes.FETCHTASKSFEED_REQUEST]: fetchtasksfeedRequest,
  [MngTypes.FETCHTASKSFEED_SUCCESS]: fetchtasksfeedSuccess,
  [MngTypes.FETCHTASKSFEED_FAILURE]: fetchtasksfeedFailure,

  [MngTypes.COMPANYPROJECTS_REQUEST]: companyprojectsRequest,
  [MngTypes.COMPANYPROJECTS_SUCCESS]: companyprojectsSuccess,
  [MngTypes.COMPANYPROJECTS_FAILURE]: companyprojectsFailure,

  [MngTypes.SELECTPROJECT_REQUEST]: selectprojectRequest,
  [MngTypes.SELECTPROJECT_SUCCESS]: selectprojectSuccess,
  [MngTypes.SELECTPROJECT_FAILURE]: selectprojectFailure,

  [MngTypes.USERPROJECTTASK_REQUEST]: userprojecttaskRequest,
  [MngTypes.USERPROJECTTASK_SUCCESS]: userprojecttaskSuccess,
  [MngTypes.USERPROJECTTASK_FAILURE]: userprojecttaskFailure,

  // Add project
  [MngTypes.ADDPROJECT_REQUEST]: addprojectRequest,
  [MngTypes.ADDPROJECT_SUCCESS]: addprojectSuccess,
  [MngTypes.ADDPROJECT_FAILURE]: addprojectFailure,

  [MngTypes.ADDTASK_REQUEST]: addtaskRequest,
  [MngTypes.ADDTASK_SUCCESS]: addtaskSuccess,
  [MngTypes.ADDTASK_FAILURE]: addtaskFailure,

  // Update project
  [MngTypes.UPDATEPROJECT_REQUEST]: updateprojectRequest,
  [MngTypes.UPDATEPROJECT_SUCCESS]: updateprojectSuccess,
  [MngTypes.UPDATEPROJECT_FAILURE]: updateprojectFailure,

  //Delete Project
  [MngTypes.DELETEPROJECT_REQUEST]: deleteprojectRequest,
  [MngTypes.DELETEPROJECT_SUCCESS]: deleteprojectSuccess,
  [MngTypes.DELETEPROJECT_FAILURE]: deleteprojectFailure,

  [MngTypes.UPDATETASK_REQUEST]: updatetaskRequest,
  [MngTypes.UPDATETASK_SUCCESS]: updatetaskSuccess,
  [MngTypes.UPDATETASK_FAILURE]: updatetaskFailure,

  [MngTypes.EDITTASK_REQUEST]: edittaskRequest,
  [MngTypes.EDITTASK_SUCCESS]: edittaskSuccess,
  [MngTypes.EDITTASK_FAILURE]: edittaskFailure,

  [MngTypes.DELETETASK_REQUEST]: deletetaskRequest,
  [MngTypes.DELETETASK_SUCCESS]: deletetaskSuccess,
  [MngTypes.DELETETASK_FAILURE]: deletetaskFailure,

  [MngTypes.FETCHTASKDETAIL_REQUEST]: fetchtaskdetailRequest,
  [MngTypes.FETCHTASKDETAIL_SUCCESS]: fetchtaskdetailSuccess,
  [MngTypes.FETCHTASKDETAIL_FAILURE]: fetchtaskdetailFailure,

  [MngTypes.ADDMNGCOMMENT_REQUEST]: addmngcommentRequest,
  [MngTypes.ADDMNGCOMMENT_SUCCESS]: addmngcommentSuccess,
  [MngTypes.ADDMNGCOMMENT_FAILURE]: addmngcommentFailure,

  [MngTypes.FETCHPROJECTSDETAIL_REQUEST]: fetchprojectsdetailRequest,
  [MngTypes.FETCHPROJECTSDETAIL_SUCCESS]: fetchprojectsdetailSuccess,
  [MngTypes.FETCHPROJECTSDETAIL_FAILURE]: fetchprojectsdetailFailure,
  [MngTypes.FETCHPROJECTDETAIL_COMPLETE]: fetchprojectdetailComplete,

  [MngTypes.FETCHAUTHORS_REQUEST]: fetchauthorsRequest,
  [MngTypes.FETCHAUTHORS_SUCCESS]: fetchauthorsSuccess,
  [MngTypes.FETCHAUTHORS_FAILURE]: fetchauthorsFailure,

  [MngTypes.SEARCHMODULES_REQUEST]: searchmodulesRequest,
  [MngTypes.SEARCHMODULES_SUCCESS]: searchmodulesSuccess,
  [MngTypes.SEARCHMODULES_FAILURE]: searchmodulesFailure,

  [MngTypes.ASSIGNTRAINING_REQUEST]: assigntrainingRequest,
  [MngTypes.ASSIGNTRAINING_SUCCESS]: assigntrainingSuccess,
  [MngTypes.ASSIGNTRAINING_FAILURE]: assigntrainingFailure,

  [MngTypes.ASSIGNCOURSES_REQUEST]: assigncoursesRequest,
  [MngTypes.ASSIGNCOURSES_SUCCESS]: assigncoursesSuccess,
  [MngTypes.ASSIGNCOURSES_FAILURE]: assigncoursesFailure,

  [MngTypes.UNASSIGNCONTENT_REQUEST]: unassigncontentRequest,
  [MngTypes.UNASSIGNCONTENT_SUCCESS]: unassigncontentSuccess,
  [MngTypes.UNASSIGNCONTENT_FAILURE]: unassigncontentFailure,

  [MngTypes.COMPANYINDIVIDUAL_REQUEST]: companyindividualRequest,
  [MngTypes.COMPANYINDIVIDUAL_SUCCESS]: companyindividualSuccess,
  [MngTypes.COMPANYINDIVIDUAL_FAILURE]: companyindividualFailure,

  [MngTypes.FETCHENGAGEMENTREPORT_REQUEST]: fetchengagementreportRequest,
  [MngTypes.FETCHENGAGEMENTREPORT_SUCCESS]: fetchengagementreportSuccess,
  [MngTypes.FETCHENGAGEMENTREPORT_FAILURE]: fetchengagementreportFailure,

  [MngTypes.FETCHCOMPANYCAREERS_REQUEST]: fetchcompanycareersRequest,
  [MngTypes.FETCHCOMPANYCAREERS_SUCCESS]: fetchcompanycareersSuccess,
  [MngTypes.FETCHCOMPANYCAREERS_FAILURE]: fetchcompanycareersFailure,

  [MngTypes.FETCHCERTIFICATIONSREPORT_REQUEST]: fetchcertificationsreportRequest,
  [MngTypes.FETCHCERTIFICATIONSREPORT_SUCCESS]: fetchcertificationsreportSuccess,
  [MngTypes.FETCHCERTIFICATIONSREPORT_FAILURE]: fetchcertificationsreportFailure,

  [MngTypes.FETCHCAREERREPORTS_REQUEST]: fetchcareerreportsRequest,
  [MngTypes.FETCHCAREERREPORTS_SUCCESS]: fetchcareerreportsSuccess,
  [MngTypes.FETCHCAREERREPORTS_FAILURE]: fetchcareerreportsFailure,

  [MngTypes.GETANNIVERSARYBIRTHDAY_REQUEST]: getanniversarybirthdayRequest,
  [MngTypes.GETANNIVERSARYBIRTHDAY_SUCCESS]: getanniversarybirthdaySuccess,
  [MngTypes.GETANNIVERSARYBIRTHDAY_FAILURE]: getanniversarybirthdayFailure,

  // New Hire Orientation Report
  [MngTypes.FETCHHIREORIENTATIONREPORT_REQUEST]: fetchhireorientationreportRequest,
  [MngTypes.FETCHHIREORIENTATIONREPORT_SUCCESS]: fetchhireorientationreportSuccess,
  [MngTypes.FETCHHIREORIENTATIONREPORT_FAILURE]: fetchhireorientationreportFailure,

  // Company Performance Reviews
  [MngTypes.COMPANYPERFORMANCEREVIEWS_REQUEST]: companyperformancereviewsRequest,
  [MngTypes.COMPANYPERFORMANCEREVIEWS_SUCCESS]: companyperformancereviewsSuccess,
  [MngTypes.COMPANYPERFORMANCEREVIEWS_FAILURE]: companyperformancereviewsFailure,

  // Individual Performance Reviews
  [MngTypes.INDIVIDUALPERFORMANCEREVIEW_REQUEST]: individualperformancereviewRequest,
  [MngTypes.INDIVIDUALPERFORMANCEREVIEW_SUCCESS]: individualperformancereviewSuccess,
  [MngTypes.INDIVIDUALPERFORMANCEREVIEW_FAILURE]: individualperformancereviewFailure,

  // POST Performance Review Save
  [MngTypes.POSTPERFORMANCEREVIEW_REQUEST]: postperformancereviewRequest,
  [MngTypes.POSTPERFORMANCEREVIEW_SUCCESS]: postperformancereviewSuccess,
  [MngTypes.POSTPERFORMANCEREVIEW_FAILURE]: postperformancereviewFailure,

  [MngTypes.GETPERFORMANCEREVIEWS_REQUEST]: getperformancereviewsRequest,
  [MngTypes.GETPERFORMANCEREVIEWS_SUCCESS]: getperformancereviewsSuccess,
  [MngTypes.GETPERFORMANCEREVIEWS_FAILURE]: getperformancereviewsFailure,

  [MngTypes.GETPREVIOUSREVIEWTASKS_REQUEST]: getpreviousreviewtasksRequest,
  [MngTypes.GETPREVIOUSREVIEWTASKS_SUCCESS]: getpreviousreviewtasksSuccess,
  [MngTypes.GETPREVIOUSREVIEWTASKS_FAILURE]: getpreviousreviewtasksFailure,

  [MngTypes.GETMANAGERDASHBOARD_REQUEST]: getmanagerdashboardRequest,
  [MngTypes.GETMANAGERDASHBOARD_SUCCESS]: getmanagerdashboardSuccess,
  [MngTypes.GETMANAGERDASHBOARD_FAILURE]: getmanagerdashboardFailure,

  [MngTypes.POSTQUOTAACTUALS_REQUEST]: postquotaactualsRequest,
  [MngTypes.POSTQUOTAACTUALS_SUCCESS]: postquotaactualsSuccess,
  [MngTypes.POSTQUOTAACTUALS_FAILURE]: postquotaactualsFailure,

  [MngTypes.POSTTRAININGREPORTS_REQUEST]: posttrainingreportsRequest,
  [MngTypes.POSTTRAININGREPORTS_SUCCESS]: posttrainingreportsSuccess,
  [MngTypes.POSTTRAININGREPORTS_FAILURE]: posttrainingreportsFailure,

  [MngTypes.POSTQUOTAACTUALCOMMENT_REQUEST]: postquotaactualcommentRequest,
  [MngTypes.POSTQUOTAACTUALCOMMENT_SUCCESS]: postquotaactualcommentSuccess,
  [MngTypes.POSTQUOTAACTUALCOMMENT_FAILURE]: postquotaactualcommentFailure,

  [MngTypes.POSTSIGNOFF_REQUEST]: postsignoffRequest,
  [MngTypes.POSTSIGNOFF_SUCCESS]: postsignoffSuccess,
  [MngTypes.POSTSIGNOFF_FAILURE]: postsignoffFailure,

  [MngTypes.SELECTUSERS_REQUEST]: selectusersRequest,
  [MngTypes.SELECTEDPROJECT_REQUEST]: selectedprojectRequest,

  [MngTypes.POSTQUOTAREPORT_REQUEST]: postquotareportRequest,
  [MngTypes.POSTQUOTAREPORT_SUCCESS]: postquotareportSuccess,
  [MngTypes.POSTQUOTAREPORT_FAILURE]: postquotareportFailure,

  [MngTypes.POSTTRAININGCOMPETENCYREPORT_REQUEST]: posttrainingcompetencyreportRequest,
  [MngTypes.POSTTRAININGCOMPETENCYREPORT_SUCCESS]: posttrainingcompetencyreportSuccess,
  [MngTypes.POSTTRAININGCOMPETENCYREPORT_FAILURE]: posttrainingcompetencyreportFailure,

  [MngTypes.POSTTERMINATEEMPLOYEE_REQUEST]: postterminateemployeeRequest,
  [MngTypes.POSTTERMINATEEMPLOYEE_SUCCESS]: postterminateemployeeSuccess,
  [MngTypes.POSTTERMINATEEMPLOYEE_FAILURE]: postterminateemployeeFailure,

  [MngTypes.POSTINDIVIDUALQUOTAREPORT_REQUEST]: postindividualquotareportRequest,
  [MngTypes.POSTINDIVIDUALQUOTAREPORT_SUCCESS]: postindividualquotareportSuccess,
  [MngTypes.POSTINDIVIDUALQUOTAREPORT_FAILURE]: postindividualquotareportFailure,

  [MngTypes.GETQUOTASACTUALS_REQUEST]: getquotasactualsRequest,
  [MngTypes.GETQUOTASACTUALS_SUCCESS]: getquotasactualsSuccess,
  [MngTypes.GETQUOTASACTUALS_FAILURE]: getquotasactualsFailure,

  [MngTypes.CLEAR_REQUEST]: clearRequest,
})
