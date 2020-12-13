import { createReducer } from 'reduxsauce'
import { produce } from 'immer'
import { find, findIndex, propEq } from 'ramda'
import { DevTypes } from '~/actions/develop'
import { removeStatus } from '~/services/util'
import { InitialNotificationSettings } from '~/services/config'

const TEMPLATES = {
  current_page: 1,
  data: [],
  last_page: 1,
  per_page: 10,
  total: 10,
}

const initialState = {
  status: [],

  templates: {
    trainings: TEMPLATES,
    assignments: TEMPLATES,

    tracks: TEMPLATES,
    courses: TEMPLATES,
    modules: TEMPLATES,

    careers: TEMPLATES,
    certifications: TEMPLATES,
    badges: TEMPLATES,

    powerpoint: TEMPLATES,
    word: TEMPLATES,
    pdf: TEMPLATES,
    esign: TEMPLATES,
    envelope: TEMPLATES,
    packets: TEMPLATES,

    habits: TEMPLATES,
    // habitsschedules
    habitslist: TEMPLATES,
    quotas: TEMPLATES,
    scorecards: TEMPLATES,

    assessment: TEMPLATES,
    survey: TEMPLATES,
    review: TEMPLATES,
  },

  instances: {
    carryOvers: TEMPLATES,
    courses: TEMPLATES,
    habits: TEMPLATES,
    quotas: TEMPLATES,
    scorecards: TEMPLATES,
    programs: TEMPLATES,
    tracks: TEMPLATES,
    performances: TEMPLATES,
    habitslist: TEMPLATES,
    tasks: TEMPLATES,
    assigned: TEMPLATES,
    training: TEMPLATES,
    daily: { today: [], week: [], month: [] },
    dailyTraining: { open: [], completed: [] },
  },

  // Default notificationsSetting data for old/existing users whose notification setting could not be found
  notificationsSettings: InitialNotificationSettings,

  // Deprecated reducers
  learnQuizQuestions: {
    num: 1,
    type: 1,
    options: [],
    title: '',
    completed: false,
    result: {},
    message: '',
  },
  learnQuizAnswers: {
    correct: 1,
    answer: '',
    error: false,
  },
  learnVideoState: {},

  notificationToggle: [],

  libraryQuotaOptions: [],
  libraryCardTemplates: [],

  trainingScheduleDetail: null,

  selfsCoursesReport: [],
  careerCoursesReport: [],
  managerCoursesReport: [],

  teamReports: {
    self: {},
    career: {},
    manager: {},
    overall: {},
    users: {},
    individuals: {},
    companies: {},
  },
  trainingSchedules: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    data: [],
  },

  careerPrograms: [],
  careerRequirements: [],
  careerHabits: [],
  careerDevelopments: [],
  careerGoals: [],
  careerTasks: [],
  careerTrainings: [],
  careerCurJobIndex: 0,
  careerJobs: [],
  careerPromotionCard: {},
  promoteStatus: '',
  careerMessage: '',
}

const fetchfeedsRequest = produce((draft, action) => {
  // draft.status.push('pending-dff')
})
const fetchfeedsSuccess = produce((draft, action) => {
  const { type, data } = action.response
  // draft.status = removeStatus('pending-dff', draft.status)
  draft.instances[type] = data
})
const fetchfeedsFailure = produce((draft, action) => {
  // draft.status = removeStatus('pending-dff', draft.status)
})

const dailytrainingRequest = produce((draft, action) => {
  draft.status.push('pending-ddt')
})
const dailytrainingSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-ddt', draft.status)
  draft.instances.dailyTraining = action.response
})
const dailytrainingFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ddt', draft.status)
})

const updatecardRequest = produce((draft, action) => {
  draft.status.push('pending-duc')
})
const updatecardSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-duc', draft.status)
})
const updatecardFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-duc', draft.status)
})

/**
 * POST Scorecard Save
 * @param {*} draft
 * @param {*} action
 */
const postscorecardsaveRequest = produce((draft, action) => {
  draft.status.push('pending-dps')
})
const postscorecardsaveSuccess = produce((draft, action) => {
  const { scorecard } = action.response
  const idx = findIndex(propEq('id', scorecard.id), draft.templates['scorecards'].data)
  if (idx > -1) {
    draft.templates['scorecards'].data[idx] = scorecard
  } else {
    draft.templates['scorecards'].data.push(scorecard)
  }
  draft.status = removeStatus('pending-dps', draft.status)
})
const postscorecardsaveFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dps', draft.status)
})

/**
 * POST Delete Scorecard
 * @param {*} draft
 * @param {*} action
 */
const postdeletescorecardRequest = produce((draft, action) => {
  draft.status.push('pending-dpd')
})
const postdeletescorecardSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dpd', draft.status)
})
const postdeletescorecardFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dpd', draft.status)
})

const questionRequest = produce((draft, action) => {
  draft.status.push('pending-dqq')
  draft.learnQuizQuestions = {
    num: 1,
    type: 1,
    options: [],
    title: '',
    completed: false,
    result: {},
    message: '',
  }
  draft.learnQuizAnswers = { correct: 1, answer: '', error: false }
})
const questionSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dqq', draft.status)
  draft.learnQuizQuestions = action.response
})
const questionFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dqq', draft.status)
})

const answerRequest = produce((draft, action) => {
  draft.status.push('pending-daa')
  draft.learnQuizAnswers = { correct: 1, answer: '', error: false }
})
const answerSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-daa', draft.status)
  draft.learnQuizAnswers = action.response
})
const answerFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-daa', draft.status)
})

const resetquizRequest = produce((draft, action) => {
  draft.status.push('pending-drq')
  draft.learnQuizQuestions = {
    num: 1,
    type: 1,
    options: [],
    title: '',
    completed: false,
    result: {},
    message: '',
  }
  draft.learnQuizAnswers = { correct: 1, answer: '', error: false }
})
const resetquizSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-drq', draft.status)
})
const resetquizFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-drq', draft.status)
})

const updatemoduleRequest = produce((draft, action) => {
  draft.status.push('pending-dum')
})
const updatemoduleSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dum', draft.status)
})
const updatemoduleFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dum', draft.status)
})

const librarytemplatesRequest = produce((draft, action) => {
  draft.status.push('pending-dlt')
})
const librarytemplatesSuccess = produce((draft, action) => {
  const { templates, mode } = action.response
  draft.status = removeStatus('pending-dlt', draft.status)
  draft.templates[mode] = templates
  // this is a temporary implementation
  if (mode == 'pdf') {
    draft.templates.esign = templates
    draft.templates.packets = templates
  }
})
const librarytemplatesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dlt', draft.status)
})

const libraryeventRequest = produce((draft, action) => {
  draft.status.push('pending-dle')
})
const libraryeventSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dle', draft.status)
})
const libraryeventFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dle', draft.status)
})

const librarysaveRequest = produce((draft, action) => {
  draft.status.push('pending-dls')
})
const librarysaveSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dls', draft.status)
})
const librarysaveFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dls', draft.status)
})

const librarytrackdetailRequest = produce((draft, action) => {
  draft.status.push('pending-dld')
})
const librarytrackdetailSuccess = produce((draft, action) => {
  const idx = findIndex(propEq('id', Number(action.response.id)), draft.templates.tracks.data)
  draft.status = removeStatus('pending-dld', draft.status)
  draft.templates.tracks.data[idx] = action.response
})
const librarytrackdetailFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dld', draft.status)
})

const libraryprogramdetailRequest = produce((draft, action) => {
  draft.status.push('pending-dlp')
})
const libraryprogramdetailSuccess = produce((draft, action) => {
  const { response, mode } = action
  const idx = findIndex(propEq('id', response.id), draft.templates[mode].data)
  if (idx > -1) {
    draft.templates[mode].data[idx] = response
  } else {
    draft.templates[mode].data.push(response)
  }
  draft.status = removeStatus('pending-dlp', draft.status)
})
const libraryprogramdetailFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dlp', draft.status)
})

const programpromotionRequest = produce((draft, action) => {
  draft.status.push('pending-dpp')
})
const programpromotionSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dpp', draft.status)
})
const programpromotionFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dpp', draft.status)
})

const quotatemplatesRequest = produce((draft, action) => {
  draft.status.push('pending-dqt')
})
const quotatemplatesSuccess = produce((draft, action) => {
  const { id, mode, quotas } = action
  const idx = findIndex(propEq('id', id), draft.templates[mode].data)
  const newQuotas = quotas.map(item => {
    const quota = find(propEq('quota_template_id', item.id), draft.templates[mode].data[idx].data.quotas)
    return { ...item, ...quota }
  })
  draft.templates[mode].data[idx].data.quotas = newQuotas
  draft.status = removeStatus('pending-dqt', draft.status)
})
const quotatemplatesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dqt', draft.status)
})

const trainingscheduledetailRequest = produce((draft, action) => {
  draft.status.push('pending-dts')
  draft.trainingScheduleDetail = null
})
const trainingscheduledetailSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dts', draft.status)
  draft.trainingScheduleDetail = action.response
})
const trainingscheduledetailFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dts', draft.status)
  draft.trainingScheduleDetail = action.response
})

const traininglistRequest = produce((draft, action) => {
  draft.status.push('pending-dtl')
})
const traininglistSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dtl', draft.status)
  draft.trainingSchedules = action.response
})
const traininglistFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dtl', draft.status)
})

const librarytemplatesaveRequest = produce((draft, action) => {
  draft.status.push('pending-dly')
})
const librarytemplatesaveSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dly', draft.status)
})
const librarytemplatesaveFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dly', draft.status)
})

const librarycardtemplatesRequest = produce((draft, action) =>
  produce((draft, action) => {
    draft.status.push('pending-dla')
    draft.libraryCardTemplates = []
  })
)
const librarycardtemplatesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dla', draft.status)
  draft.libraryCardTemplates = action.response
})
const librarycardtemplatesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dla', draft.status)
})

const createquotaRequest = produce((draft, action) => {
  draft.status.push('pending-dcq')
})
const createquotaSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dcq', draft.status)
})
const createquotaFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dcq', draft.status)
})

const getquotaoptionsRequest = produce((draft, action) => {
  draft.status.push('pending-dga')
})
const getquotaoptionsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dga', draft.status)
  draft.libraryQuotaOptions = action.response
})
const getquotaoptionsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dga', draft.status)
})

const adddocumentRequest = produce((draft, action) => {
  draft.status.push('pending-dad')
})
const adddocumentSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dad', draft.status)
})
const adddocumentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dad', draft.status)
})

const careergoalsRequest = produce((draft, action) => {
  draft.status.push('pending-dcg')
})
const careergoalsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dcg', draft.status)
  draft.careerGoals = action.response
})
const careergoalsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dcg', draft.status)
})

const careergoalsaveRequest = produce((draft, action) => {
  draft.status.push('pending-dcr')
})
const careergoalsaveSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dcr', draft.status)
  draft.careerGoals = action.response
})
const careergoalsaveFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dcr', draft.status)
})

const careerdevreportsRequest = produce((draft, action) => {
  draft.status.push('pending-dcd')
})
const careerdevreportsSuccess = produce((draft, action) => {
  const { programs, requirements, habits, developments, current, jobs, message } = action.response
  draft.status = removeStatus('pending-dcd', draft.status)
  draft.careerMessage = message
  draft.careerJobs = jobs
  draft.careerCurJobIndex = current
  draft.careerPrograms = programs
  draft.careerRequirements = requirements
  draft.careerHabits = habits
  draft.careerDevelopments = developments
})
const careerdevreportsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dcd', draft.status)
})

const careertasksRequest = produce((draft, action) => {
  draft.status.push('pending-dct')
})
const careertasksSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dct', draft.status)
  draft.careerTasks = action.response.data
})
const careertasksFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dct', draft.status)
})

const careertrainingsRequest = produce((draft, action) => {
  draft.status.push('pending-dca')
})
const careertrainingsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dca', draft.status)
  draft.careerTrainings = action.response.data
})
const careertrainingsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dca', draft.status)
})

const careerpromoteRequest = produce((draft, action) => {
  draft.careerPromotionCard = {}
  career.promoteStatus = 'requested'
})
const careerpromoteSuccess = produce((draft, action) => {
  draft.careerPromotionCard = action.response
  draft.promoteStatus = 'promoted'
})
const careerpromoteFailure = produce((draft, action) => {
  draft.promoteStatus = 'error'
})

const userscoursereportRequest = produce((draft, action) => {
  draft.status.push('pending-dus')
})
const userscoursereportSuccess = produce((draft, action) => {
  const { response } = action
  const selfsCoursesReport = []
  const careerCoursesReport = []
  const managerCoursesReport = []
  response.map(item => {
    if (item.category == 'self') {
      selfsCoursesReport.push(item)
    } else if (item.category == 'manager') {
      managerCoursesReport.push(item)
    } else {
      careerCoursesReport.push(item)
    }
  })
  draft.status = removeStatus('pending-dus', draft.status)
  draft.selfsCoursesReport = selfsCoursesReport
  draft.careerCoursesReport = careerCoursesReport
  draft.managerCoursesReport = managerCoursesReport
})
const userscoursereportFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dus', draft.status)
})

const teamreportsRequest = produce((draft, action) => {
  draft.status.push('pending-dtr')
})
const teamreportsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dtr', draft.status)
  draft.teamReports = action.response
})
const teamreportsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dtr', draft.status)
})

const adddevcommentRequest = produce((draft, action) => {
  draft.status.push('pending-dae')
})
const adddevcommentSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dae', draft.status)
})
const adddevcommentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dae', draft.status)
})

const postcompanyinfoRequest = produce((draft, action) => {
  draft.status.push('pending-dpc')
})
const postcompanyinfoSuccess = produce((draft, action) => {
  draft.status.push('pending-dpc')
})
const postcompanyinfoFailure = produce((draft, action) => {
  draft.status.push('pending-dpc')
})

const fetchnotificationssettingsRequest = produce((draft, action) => {
  draft.status.push('pending-dfn')
})
const fetchnotificationssettingsSuccess = produce((draft, action) => {
  const { message } = action.response
  draft.status = removeStatus('pending-dfn', draft.status)
  if (message !== 'User notification setting not found!!') {
    draft.notificationsSettings = action.response
  }
})
const fetchnotificationssettingsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dfn', draft.status)
})

const updatenotificationssettingsRequest = produce((draft, action) => {
  draft.status.push('pending-dun')
})
const updatenotificationssettingsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dun', draft.status)
})
const updatenotificationssettingsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dun', draft.status)
})

const postterminateuserRequest = produce((draft, action) => {
  draft.status.push('pending-dpu')
})
const postterminateuserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dpu', draft.status)
})
const postterminateuserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dpu', draft.status)
})

const postdeleteuserRequest = produce((draft, action) => {
  draft.status.push('pending-dpr')
})
const postdeleteuserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-dpr', draft.status)
})
const postdeleteuserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-dpr', draft.status)
})

const videostateRequest = produce((draft, action) => {
  draft.learnVideoState = action.cardState
})

const notificationsetRequest = produce((draft, action) => {
  const notificationArray = action.index
  if (notificationArray && notificationArray.length > 0) {
    draft.notificationToggle = notificationArray
  } else {
    draft.notificationToggle = []
  }
})

const clearRequest = produce((draft, action) => (draft = initialState))

export const reducer = createReducer(initialState, {
  [DevTypes.FETCHFEEDS_REQUEST]: fetchfeedsRequest,
  [DevTypes.FETCHFEEDS_SUCCESS]: fetchfeedsSuccess,
  [DevTypes.FETCHFEEDS_FAILURE]: fetchfeedsFailure,

  [DevTypes.DAILYTRAINING_REQUEST]: dailytrainingRequest,
  [DevTypes.DAILYTRAINING_SUCCESS]: dailytrainingSuccess,
  [DevTypes.DAILYTRAINING_FAILURE]: dailytrainingFailure,

  [DevTypes.UPDATECARD_REQUEST]: updatecardRequest,
  [DevTypes.UPDATECARD_SUCCESS]: updatecardSuccess,
  [DevTypes.UPDATECARD_FAILURE]: updatecardFailure,

  [DevTypes.POSTSCORECARDSAVE_REQUEST]: postscorecardsaveRequest,
  [DevTypes.POSTSCORECARDSAVE_SUCCESS]: postscorecardsaveSuccess,
  [DevTypes.POSTSCORECARDSAVE_FAILURE]: postscorecardsaveFailure,

  [DevTypes.POSTDELETESCORECARD_REQUEST]: postdeletescorecardRequest,
  [DevTypes.POSTDELETESCORECARD_SUCCESS]: postdeletescorecardSuccess,
  [DevTypes.POSTDELETESCORECARD_FAILURE]: postdeletescorecardFailure,

  [DevTypes.QUESTION_REQUEST]: questionRequest,
  [DevTypes.QUESTION_SUCCESS]: questionSuccess,
  [DevTypes.QUESTION_FAILURE]: questionFailure,

  [DevTypes.ANSWER_REQUEST]: answerRequest,
  [DevTypes.ANSWER_SUCCESS]: answerSuccess,
  [DevTypes.ANSWER_FAILURE]: answerFailure,

  [DevTypes.RESETQUIZ_REQUEST]: resetquizRequest,
  [DevTypes.RESETQUIZ_SUCCESS]: resetquizSuccess,
  [DevTypes.RESETQUIZ_FAILURE]: resetquizFailure,

  // update module
  [DevTypes.UPDATEMODULE_REQUEST]: updatemoduleRequest,
  [DevTypes.UPDATEMODULE_SUCCESS]: updatemoduleSuccess,
  [DevTypes.UPDATEMODULE_FAILURE]: updatemoduleFailure,

  // get courses detail
  [DevTypes.LIBRARYTEMPLATES_REQUEST]: librarytemplatesRequest,
  [DevTypes.LIBRARYTEMPLATES_SUCCESS]: librarytemplatesSuccess,
  [DevTypes.LIBRARYTEMPLATES_FAILURE]: librarytemplatesFailure,

  // get training schedule
  [DevTypes.TRAININGLIST_REQUEST]: traininglistRequest,
  [DevTypes.TRAININGLIST_SUCCESS]: traininglistSuccess,
  [DevTypes.TRAININGLIST_FAILURE]: traininglistFailure,

  // create/update library templates
  [DevTypes.LIBRARYTEMPLATESAVE_REQUEST]: librarytemplatesaveRequest,
  [DevTypes.LIBRARYTEMPLATESAVE_SUCCESS]: librarytemplatesaveSuccess,
  [DevTypes.LIBRARYTEMPLATESAVE_FAILURE]: librarytemplatesaveFailure,

  // save/delete template
  [DevTypes.LIBRARYEVENT_REQUEST]: libraryeventRequest,
  [DevTypes.LIBRARYEVENT_SUCCESS]: libraryeventSuccess,
  [DevTypes.LIBRARYEVENT_FAILURE]: libraryeventFailure,

  // create/update library modules
  [DevTypes.LIBRARYSAVE_REQUEST]: librarysaveRequest,
  [DevTypes.LIBRARYSAVE_SUCCESS]: librarysaveSuccess,
  [DevTypes.LIBRARYSAVE_FAILURE]: librarysaveFailure,

  // get card templates
  [DevTypes.LIBRARYCARDTEMPLATES_REQUEST]: librarycardtemplatesRequest,
  [DevTypes.LIBRARYCARDTEMPLATES_SUCCESS]: librarycardtemplatesSuccess,
  [DevTypes.LIBRARYCARDTEMPLATES_FAILURE]: librarycardtemplatesFailure,

  // get library track detail
  [DevTypes.LIBRARYTRACKDETAIL_REQUEST]: librarytrackdetailRequest,
  [DevTypes.LIBRARYTRACKDETAIL_SUCCESS]: librarytrackdetailSuccess,
  [DevTypes.LIBRARYTRACKDETAIL_FAILURE]: librarytrackdetailFailure,

  // get program detail
  [DevTypes.LIBRARYPROGRAMDETAIL_REQUEST]: libraryprogramdetailRequest,
  [DevTypes.LIBRARYPROGRAMDETAIL_SUCCESS]: libraryprogramdetailSuccess,
  [DevTypes.LIBRARYPROGRAMDETAIL_FAILURE]: libraryprogramdetailFailure,

  // program request promotion
  [DevTypes.PROGRAMPROMOTION_REQUEST]: programpromotionRequest,
  [DevTypes.PROGRAMPROMOTION_SUCCESS]: programpromotionSuccess,
  [DevTypes.PROGRAMPROMOTION_FAILURE]: programpromotionFailure,

  // get quota detail
  [DevTypes.QUOTATEMPLATES_REQUEST]: quotatemplatesRequest,
  [DevTypes.QUOTATEMPLATES_SUCCESS]: quotatemplatesSuccess,
  [DevTypes.QUOTATEMPLATES_FAILURE]: quotatemplatesFailure,

  // get training schedule detail
  [DevTypes.TRAININGSCHEDULEDETAIL_REQUEST]: trainingscheduledetailRequest,
  [DevTypes.TRAININGSCHEDULEDETAIL_SUCCESS]: trainingscheduledetailSuccess,
  [DevTypes.TRAININGSCHEDULEDETAIL_FAILURE]: trainingscheduledetailFailure,

  // create Quota
  [DevTypes.CREATEQUOTA_REQUEST]: createquotaRequest,
  [DevTypes.CREATEQUOTA_SUCCESS]: createquotaSuccess,
  [DevTypes.CREATEQUOTA_FAILURE]: createquotaFailure,

  [DevTypes.GETQUOTAOPTIONS_REQUEST]: getquotaoptionsRequest,
  [DevTypes.GETQUOTAOPTIONS_SUCCESS]: getquotaoptionsSuccess,
  [DevTypes.GETQUOTAOPTIONS_FAILURE]: getquotaoptionsFailure,

  // add Document
  [DevTypes.ADDDOCUMENT_REQUEST]: adddocumentRequest,
  [DevTypes.ADDDOCUMENT_SUCCESS]: adddocumentSuccess,
  [DevTypes.ADDDOCUMENT_FAILURE]: adddocumentFailure,

  // Career Page
  // Career Goals
  [DevTypes.CAREERGOALS_REQUEST]: careergoalsRequest,
  [DevTypes.CAREERGOALS_SUCCESS]: careergoalsSuccess,
  [DevTypes.CAREERGOALS_FAILURE]: careergoalsFailure,

  [DevTypes.CAREERGOALSAVE_REQUEST]: careergoalsaveRequest,
  [DevTypes.CAREERGOALSAVE_SUCCESS]: careergoalsaveSuccess,
  [DevTypes.CAREERGOALSAVE_FAILURE]: careergoalsaveFailure,

  // Career Reports
  [DevTypes.CAREERDEVREPORTS_REQUEST]: careerdevreportsRequest,
  [DevTypes.CAREERDEVREPORTS_SUCCESS]: careerdevreportsSuccess,
  [DevTypes.CAREERDEVREPORTS_FAILURE]: careerdevreportsFailure,

  // Career Tasks
  [DevTypes.CAREERTASKS_REQUEST]: careertasksRequest,
  [DevTypes.CAREERTASKS_SUCCESS]: careertasksSuccess,
  [DevTypes.CAREERTASKS_FAILURE]: careertasksFailure,

  // Career Training
  [DevTypes.CAREERTRAININGS_REQUEST]: careertrainingsRequest,
  [DevTypes.CAREERTRAININGS_SUCCESS]: careertrainingsSuccess,
  [DevTypes.CAREERTRAININGS_FAILURE]: careertrainingsFailure,

  // Career Promotion
  [DevTypes.CAREERPROMOTE_REQUEST]: careerpromoteRequest,
  [DevTypes.CAREERPROMOTE_SUCCESS]: careerpromoteSuccess,
  [DevTypes.CAREERPROMOTE_FAILURE]: careerpromoteFailure,

  // Add Comment
  [DevTypes.ADDDEVCOMMENT_REQUEST]: adddevcommentRequest,
  [DevTypes.ADDDEVCOMMENT_SUCCESS]: adddevcommentSuccess,
  [DevTypes.ADDDEVCOMMENT_FAILURE]: adddevcommentFailure,

  // Users courses Reports
  [DevTypes.USERSCOURSEREPORT_REQUEST]: userscoursereportRequest,
  [DevTypes.USERSCOURSEREPORT_SUCCESS]: userscoursereportSuccess,
  [DevTypes.USERSCOURSEREPORT_FAILURE]: userscoursereportFailure,

  // Team Development Reports
  [DevTypes.TEAMREPORTS_REQUEST]: teamreportsRequest,
  [DevTypes.TEAMREPORTS_SUCCESS]: teamreportsSuccess,
  [DevTypes.TEAMREPORTS_FAILURE]: teamreportsFailure,

  // Notifications settings
  [DevTypes.FETCHNOTIFICATIONSSETTINGS_REQUEST]: fetchnotificationssettingsRequest,
  [DevTypes.FETCHNOTIFICATIONSSETTINGS_SUCCESS]: fetchnotificationssettingsSuccess,
  [DevTypes.FETCHNOTIFICATIONSSETTINGS_FAILURE]: fetchnotificationssettingsFailure,

  [DevTypes.UPDATENOTIFICATIONSSETTINGS_REQUEST]: updatenotificationssettingsRequest,
  [DevTypes.UPDATENOTIFICATIONSSETTINGS_SUCCESS]: updatenotificationssettingsSuccess,
  [DevTypes.UPDATENOTIFICATIONSSETTINGS_FAILURE]: updatenotificationssettingsFailure,

  [DevTypes.POSTCOMPANYINFO_REQUEST]: postcompanyinfoRequest,
  [DevTypes.POSTCOMPANYINFO_SUCCESS]: postcompanyinfoSuccess,
  [DevTypes.POSTCOMPANYINFO_FAILURE]: postcompanyinfoFailure,

  [DevTypes.POSTTERMINATEUSER_REQUEST]: postterminateuserRequest,
  [DevTypes.POSTTERMINATEUSER_SUCCESS]: postterminateuserSuccess,
  [DevTypes.POSTTERMINATEUSER_FAILURE]: postterminateuserFailure,

  [DevTypes.POSTDELETEUSER_REQUEST]: postdeleteuserRequest,
  [DevTypes.POSTDELETEUSER_SUCCESS]: postdeleteuserSuccess,
  [DevTypes.POSTDELETEUSER_FAILURE]: postdeleteuserFailure,

  [DevTypes.VIDEOSTATE_REQUEST]: videostateRequest,
  [DevTypes.NOTIFICATIONSET_REQUEST]: notificationsetRequest,
  [DevTypes.CLEAR_REQUEST]: clearRequest,
})
