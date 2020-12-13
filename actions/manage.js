import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  getcareerprogramRequest: ['programId', 'route'],
  getcareerprogramSuccess: ['response'],
  getcareerprogramFailure: null,

  postcareerprogramRequest: ['payload'],
  postcareerprogramSuccess: ['response'],
  postcareerprogramFailure: null,

  fetchtasksfeedRequest: ['userId', 'perPage', 'page', 'startDate', 'endDate'],
  fetchtasksfeedSuccess: ['response'],
  fetchtasksfeedFailure: null,

  companyprojectsRequest: ['companyIds', 'userIds'],
  companyprojectsSuccess: ['response'],
  companyprojectsFailure: null,

  selectprojectRequest: ['project', 'userIds'],
  selectprojectSuccess: ['response'],
  selectprojectFailure: null,

  userprojecttaskRequest: ['payload'],
  userprojecttaskSuccess: ['response'],
  userprojecttaskFailure: null,

  addtaskRequest: ['payload', 'users', 'projectId'],
  addtaskSuccess: ['response'],
  addtaskFailure: null,

  updatetaskRequest: ['event', 'cardId'],
  updatetaskSuccess: ['response'],
  updatetaskFailure: null,

  edittaskRequest: ['payload'],
  edittaskSuccess: ['response'],
  edittaskFailure: null,

  deletetaskRequest: ['cardInstanceId', 'mode', 'after'],
  deletetaskSuccess: ['response'],
  deletetaskFailure: null,

  fetchtaskdetailRequest: ['cardInstanceId', 'mode'],
  fetchtaskdetailSuccess: ['response'],
  fetchtaskdetailFailure: null,

  addmngcommentRequest: ['payload', 'cardInstanceId'],
  addmngcommentSuccess: ['response'],
  addmngcommentFailure: null,

  fetchprojectsdetailRequest: null,
  fetchprojectsdetailSuccess: ['response'],
  fetchprojectsdetailFailure: null,
  fetchprojectdetailComplete: null, // This action is needed, because multiple fetch to different url is done to get all project wise tasks

  fetchauthorsRequest: ['companyId'],
  fetchauthorsSuccess: ['response'],
  fetchauthorsFailure: null,

  searchmodulesRequest: ['payload'],
  searchmodulesSuccess: ['response'],
  searchmodulesFailure: null,

  addprojectRequest: ['payload', 'companyId'],
  addprojectSuccess: ['response'],
  addprojectFailure: null,

  updateprojectRequest: ['payload', 'companyId', 'projectId'],
  updateprojectSuccess: ['response'],
  updateprojectFailure: null,

  deleteprojectRequest: ['projectId', 'companyId'],
  deleteprojectSuccess: ['response'],
  deleteprojectFailure: null,

  assigntrainingRequest: ['payload', 'after', 'attendance'],
  assigntrainingSuccess: ['response'],
  assigntrainingFailure: null,

  assigncoursesRequest: ['payload'],
  assigncoursesSuccess: ['response'],
  assigncoursesFailure: null,

  unassigncontentRequest: ['payload'],
  unassigncontentSuccess: ['response'],
  unassigncontentFailure: null,

  companyindividualRequest: ['payload'],
  companyindividualSuccess: ['response'],
  companyindividualFailure: null,

  fetchengagementreportRequest: ['payload', 'by', 'mode'],
  fetchengagementreportSuccess: ['response'],
  fetchengagementreportFailure: null,

  fetchcompanycareersRequest: ['companyId'],
  fetchcompanycareersSuccess: ['response'],
  fetchcompanycareersFailure: null,

  fetchcertificationsreportRequest: ['mode', 'payload'],
  fetchcertificationsreportSuccess: ['response'],
  fetchcertificationsreportFailure: null,

  fetchcareerreportsRequest: ['mode', 'payload'],
  fetchcareerreportsSuccess: ['response'],
  fetchcareerreportsFailure: null,

  fetchhireorientationreportRequest: ['payload'],
  fetchhireorientationreportSuccess: ['response'],
  fetchhireorientationreportFailure: null,

  // GET Company Performance Reviews
  companyperformancereviewsRequest: ['companyIds', 'userIds', 'perPage', 'page', 'startDate', 'endDate'],
  companyperformancereviewsSuccess: ['response'],
  companyperformancereviewsFailure: null,

  // GET Individual Performance Review
  individualperformancereviewRequest: ['userId', 'companyId', 'route', 'startDate', 'endDate'],
  individualperformancereviewSuccess: ['response'],
  individualperformancereviewFailure: null,

  // POST Performance Review Save
  postperformancereviewRequest: ['payload'],
  postperformancereviewSuccess: ['response'],
  postperformancereviewFailure: null,

  getperformancereviewsRequest: ['id', 'companyId', 'current', 'per', 'startDate', 'endDate', 'route', 'order'],
  getperformancereviewsSuccess: ['response'],
  getperformancereviewsFailure: null,

  getpreviousreviewtasksRequest: ['payload'],
  getpreviousreviewtasksSuccess: ['response'],
  getpreviousreviewtasksFailure: null,

  // GET Manager Dashboard
  getmanagerdashboardRequest: ['companyId', 'dateStart', 'dateEnd'],
  getmanagerdashboardSuccess: ['response'],
  getmanagerdashboardFailure: null,

  // POST Quota Actuals Save
  postquotaactualsRequest: ['payload', 'callback'],
  postquotaactualsSuccess: ['response'],
  postquotaactualsFailure: null,

  //Birthday Report
  getanniversarybirthdayRequest: ['companyId', 'base', 'orderBy', 'asc', 'month_start', 'month_end'],
  getanniversarybirthdaySuccess: ['response'],
  getanniversarybirthdayFailure: null,

  posttrainingreportsRequest: ['payload', 'mode'],
  posttrainingreportsSuccess: ['response', 'mode'],
  posttrainingreportsFailure: null,

  postquotaactualcommentRequest: ['payload'],
  postquotaactualcommentSuccess: ['response'],
  postquotaactualcommentFailure: null,

  postsignoffRequest: ['payload', 'completed', 'after'],
  postsignoffSuccess: ['response'],
  postsignoffFailure: null,

  postquotareportRequest: ['payload'],
  postquotareportSuccess: ['response'],
  postquotareportFailure: null,

  posttrainingcompetencyreportRequest: ['payload'],
  posttrainingcompetencyreportSuccess: ['response'],
  posttrainingcompetencyreportFailure: null,

  postterminateemployeeRequest: ['companyId', 'payload'],
  postterminateemployeeSuccess: ['response'],
  postterminateemployeeFailure: null,

  postindividualquotareportRequest: ['payload', 'route'],
  postindividualquotareportSuccess: ['response'],
  postindividualquotareportFailure: null,

  getquotasactualsRequest: ['userId'],
  getquotasactualsSuccess: ['response'],
  getquotasactualsFailure: null,

  selectusersRequest: ['payload'],
  selectedprojectRequest: ['projectId'],

  // Clear all caches
  clearRequest: null,
})

export const MngTypes = Types
export default Creators
