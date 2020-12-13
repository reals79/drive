import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  /**
   * @param payload required - userId, type; optional - perPage, page, startDate, endDate, and etc
   */
  fetchfeedsRequest: ['payload'],
  fetchfeedsSuccess: ['response'],
  fetchfeedsFailure: null,

  /**
   * @param payload required - userId
   */
  dailytrainingRequest: ['payload'],
  dailytrainingSuccess: ['response'],
  dailytrainingFailure: null,

  // update cards
  updatecardRequest: ['event', 'cardId', 'page', 'perPage', 'after'],
  updatecardSuccess: null,
  updatecardFailure: null,

  /**
   * POST Scorecard Save
   */
  postscorecardsaveRequest: ['payload'],
  postscorecardsaveSuccess: ['response'],
  postscorecardsaveFailure: null,

  /**
   * POST Delete Scorecard
   * @param payload
   * Example: {"scorecard": {"id":5} }
   */
  postdeletescorecardRequest: ['payload'],
  postdeletescorecardSuccess: null,
  postdeletescorecardFailure: null,

  /**
   * card event with card instance id
   * @param payload event, cardId, card, after
   */
  updatecardinstanceRequest: ['payload'],
  updatecardinstanceSuccess: null,
  updatecardinstanceFailure: null,

  // get question in Quiz module
  questionRequest: ['quizId'],
  questionSuccess: ['response'],
  questionFailure: null,

  // post answer in Quiz module
  answerRequest: ['quizId', 'payload'],
  answerSuccess: ['response'],
  answerFailure: null,

  // reset quiz module
  resetquizRequest: ['quizId'],
  resetquizSuccess: null,
  resetquizFailure: null,

  // update module
  updatemoduleRequest: ['payload'],
  updatemoduleSuccess: ['response'],
  updatemoduleFailure: null,

  // get library templates by template id
  librarytemplatesRequest: ['payload'],
  librarytemplatesSuccess: ['response'],
  librarytemplatesFailure: null,

  librarytemplatesaveRequest: ['payload', 'image', 'video', 'pdf', 'file', 'mode', 'after', 'route'],
  librarytemplatesaveSuccess: ['response'],
  librarytemplatesaveFailure: null,

  librarysaveRequest: ['payload', 'image', 'pdf'],
  librarysaveSuccess: ['response'],
  librarysaveFailure: null,

  librarycardtemplatesRequest: ['payload'],
  librarycardtemplatesSuccess: ['response'],
  librarycardtemplatesFailure: null,

  libraryeventRequest: ['payload'],
  libraryeventSuccess: ['response'],
  libraryeventFailure: null,

  librarytrackdetailRequest: ['payload', 'route'],
  librarytrackdetailSuccess: ['response'],
  librarytrackdetailFailure: null,

  // Create Quota
  createquotaRequest: ['payload'],
  createquotaSuccess: ['response'],
  createquotaFailure: null,

  getquotaoptionsRequest: null,
  getquotaoptionsSuccess: ['response'],
  getquotaoptionsFailure: null,

  // Add Document
  adddocumentRequest: ['payload', 'attachment'],
  adddocumentSuccess: ['response'],
  adddocumentFailure: null,

  libraryprogramdetailRequest: ['payload', 'mode', 'route'],
  libraryprogramdetailSuccess: ['response', 'mode'],
  libraryprogramdetailFailure: null,

  programeventRequest: ['payload'],
  programeventSuccess: ['response'],
  programeventFailure: null,

  programpromotionRequest: ['payload'],
  programpromotionSuccess: ['response'],
  programpromotionFailure: null,

  quotatemplatesRequest: ['id', 'mode', 'templateIds'],
  quotatemplatesSuccess: ['id', 'mode', 'quotas'],
  quotatemplatesFailure: null,

  trainingscheduledetailRequest: ['payload'],
  trainingscheduledetailSuccess: ['response'],
  trainingscheduledetailFailure: ['response'],

  // Career Goals
  careergoalsRequest: ['id'],
  careergoalsSuccess: ['response'],
  careergoalsFailure: null,

  careergoalsaveRequest: ['id', 'data'],
  careergoalsaveSuccess: ['response'],
  careergoalsaveFailure: null,

  // Career Reports
  careerdevreportsRequest: ['companyId', 'userId'],
  careerdevreportsSuccess: ['response'],
  careerdevreportsFailure: null,

  // Career Tasks
  careertasksRequest: ['userId', 'perPage', 'page'],
  careertasksSuccess: ['response'],
  careertasksFailure: null,

  careerpromoteRequest: ['companyId'],
  careerpromoteSuccess: ['response'],
  careerpromoteFailure: null,

  careercardRequest: ['payload'],
  careercardSuccess: ['response'],
  careercardFailure: null,

  // Career Trainings
  careertrainingsRequest: ['userId', 'perPage', 'page'],
  careertrainingsSuccess: ['response'],
  careertrainingsFailure: null,

  // Add comment
  adddevcommentRequest: ['payload', 'act'],
  adddevcommentSuccess: null,
  adddevcommentFailure: null,

  // users courses Reports
  userscoursereportRequest: ['userId', 'startDate', 'endDate'],
  userscoursereportSuccess: ['response'],
  userscoursereportFailure: null,

  // Team Development Reports
  teamreportsRequest: ['id', 'startDate', 'endDate'],
  teamreportsSuccess: ['response'],
  teamreportsFailure: null,

  // Training Schedule Reports
  traininglistRequest: ['payload'],
  traininglistSuccess: ['response'],
  traininglistFailure: null,

  postcompanyinfoRequest: ['payload', 'companyId'],
  postcompanyinfoSuccess: ['response'],
  postcompanyinfoFailure: null,

  fetchnotificationssettingsRequest: null,
  fetchnotificationssettingsSuccess: ['response'],
  fetchnotificationssettingsFailure: null,

  updatenotificationssettingsRequest: ['payload'],
  updatenotificationssettingsSuccess: ['response'],
  updatenotificationssettingsFailure: null,

  // Terminate, Unterminate and Delete user
  postterminateuserRequest: ['payload', 'companyId', 'event'],
  postterminateuserSuccess: ['response'],
  postterminateuserFailure: null,

  postdeleteuserRequest: ['userId', 'companyId'],
  postdeleteuserSuccess: ['response'],
  postdeleteuserFailure: null,

  videostateRequest: ['cardState'],

  notificationsetRequest: ['index'],

  // Clearn all caches
  clearRequest: null,
})

export const DevTypes = Types
export default Creators
