import apisauce from 'apisauce'
import { includes, isNil, isEmpty } from 'ramda'
import { store } from '~/reducers'
import AppActions from '~/actions/app'

const Config = {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://hcm. .com/api/'
      : 'https://qa.hcm. .com/api/',
  S3_URL: 'https://s3-us-west-2.amazonaws.com/',
  S3_API: process.env.NODE_ENV === 'production' ? 'hcm. .com-assets' : 'hcm-qa. .com-assets',
}

const authenticated = api => {
  api.setHeader('Authorization', 'Bearer ' + window.token)

  return api
}

const naviMonitor = response => {
  if (response.status === 401 && !(response.data.message && includes('Unauthorized access', response.data.message))) {
    store.dispatch(AppActions.logoutRequest())
    console.log('Your token has been expired.', response.config.url)
  }
}

const create = (baseURL = Config.API_URL) => {
  const api = apisauce.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // 50 second timeout...
    timeout: 50000,
  })

  const s3API = apisauce.create({
    baseURL: Config.S3_URL,
    headers: {
      Accept: 'application/xml',
      'Content-Type': 'multipart/form-data',
    },
    // 50 second timeout...
    timeout: 50000,
  })

  const vendorAPI = apisauce.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/https://www. .com/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // 50 second timeout...
    timeout: 50000,
  })

  api.addMonitor(naviMonitor)

  /**
   * POST Quota Actuals Save
   * @param {*} payload
   */
  const postQuotaActualsSave = payload => authenticated(api).post('quota/actuals', payload)
  /**
   * GET Career Program
   * @param {number} programId
   */
  const getCareerProgram = programId => authenticated(api).get(`program/${programId}`)
  /**
   * POST Program Save
   * @param {any} payload
   */
  const postCareerProgram = payload => authenticated(api).post('develop/library/program/save', payload)
  /**
   * POST Check Password
   * @param {number} user_id
   * @param {string} password
   */
  const postCheckPassword = payload => authenticated(api).post('auth/checkpassword', payload)

  /**
   * POST Training Report Companies/Individuals
   * @param {*} payload
   * @param {string} type /* company | individual
   */
  const postTrainingReport = (payload, type) => authenticated(api).post(`reports/${type}/training`, payload)
  /**
   * GET Generate Hash
   * @param {*} payload
   */
  const getGenerateHash = () => authenticated(api).get('media/hash')
  /**
   * POST Presentation Save
   * @param {*} payload
   */
  const postPresentationSave = payload => authenticated(api).post('develop/library/presentation/save', payload)
  /**
   * GET Quota Actuals Count
   * @param {number} userId
   * @param {number} year
   * @param {number} month
   */
  const getActualsCount = (userId, month, year) =>
    authenticated(api).get(`develop/quotastats/${userId}?month=${month}&year=${year}`)
  /**
   * Create a Quota Actual Comment
   * @param {*} payload
   */
  const postQuotaActualComment = payload => authenticated(api).post('quota/actuals/comment', payload)
  /**
   * POST Sign Off
   * @param {number} performance_id
   * @param {number} user_id
   * @param {string} email
   * @param {string} password
   */
  const postSignOff = payload => authenticated(api).post('performance/signoff', payload)
  /**
   * POST Terminate Employee
   * @param {number} company_id
   * @param {any} payload
   */
  const postTerminateEmployee = (companyId, payload) =>
    authenticated(api).post(`company/${companyId}/users/terminate`, payload)
  /**
   * GET Get Company
   * @param {number} companyId
   */
  const getGetCompany = companyId => authenticated(api).get(`vr/companies/${companyId}`)
  /**
   * GET Get VR Company
   * @param {number} companyId
   */
  const getVRCompany = companyId => authenticated(api).get(`vr/company/${companyId}`)
  /**
   * Get Get Company based on Date Range
   */
  const getGetCompanyWithDate = (companyId, dateStart, dateEnd) =>
    authenticated(api).get(`vr/companies/${companyId}?date_start=${dateStart}&date_end=${dateEnd}`)
  /**
   * GET Recently Updated Products
   * @param {*} payload
   */
  const getRecentlyUpdatedProducts = () => authenticated(api).get('vr/products/recent')
  /**
   * GET Popular Products
   * @param {*} payload
   */
  const getPopularProducts = () => authenticated(api).get('vr/products/popular')
  /**
   * POST Multi-Company Employees List
   * @param {*} payload
   */
  const postMultiCompanyEmployees = payload => authenticated(api).post('employees', payload)
  /**
   *
   * @param {*} mode one of company and user
   * @param {*} id company id or user id
   */
  const getGetBlog = (mode, id) => {
    if (mode === 'company') {
      return authenticated(api).get(`com/blog?company_id=${id}`)
    }
    return authenticated(api).get(`com/blog?user_id=${id}`)
  }
  /**
   * POST Create Blog
   * @param {*} payload
   */
  const postCreateBlog = payload => authenticated(api).post('com/blog/create', payload)
  /**
   * POST Add User
   * @param {*} payload
   */
  const postAddUser = payload => authenticated(api).post('business/user/add', payload)
  /**
   * POST Remove User
   * @param {*} payload
   */
  const postRemoveUser = payload => authenticated(api).post('business/user/remove', payload)
  /**
   * POST Save Product
   * @param {*} payload
   */
  const postSaveProduct = payload => authenticated(api).post('vr/product/save', payload)
  /**
   * POST Save Product Media
   * @param {*} payload
   */
  const postSaveProductMedia = payload => authenticated(api).post('vr/product/media/save', payload)
  /**
   * Delete Product Media
   * @param {*} payload
   */
  const deleteProductMedia = payload => authenticated(api).post('vr/product/media/delete', payload)
  /**
   * POST Multi-Company Data
   * @param {*} payload
   */
  const postMultiCompanyData = payload => authenticated(api).post('company/data', payload)
  /**
   * GET All Authors
   * @param {*} payload
   */
  const getAllAuthors = () => authenticated(api).get('content/authors')
  /**
   * POST Add/Save Author
   * @param {*} payload
   */
  const postSaveAuthor = payload => authenticated(api).post('content/authors/save', payload)
  const postSaveBusinessAuthor = payload => authenticated(api).post('business/authors/save', payload)
  /**
   * POST Delete Author
   * @param {*} options
   */
  const postDeleteAuthor = payload => authenticated(api).post('content/authors/delete', payload)
  /**
   * GET Get Business
   * @param {*} payload
   */
  const getGetBusiness = options => authenticated(api).get(`business?${options}`)
  /**
   * POST Add/Edit Departments
   * @param {*} payload
   */
  const postAddEditDepartments = (companyId, payload) =>
    authenticated(api).post(`company/${companyId}/departments/save`, payload)
  /**
   * POST Add/Edit Teams
   * @param {*} payload
   */
  const postAddEditTeams = (companyId, payload) => authenticated(api).post(`company/${companyId}/teams/save`, payload)
  /**
   * POST Save Job Roles & Titles
   * @param {*} payload
   */
  const postSaveJobRoles = (companyId, payload) =>
    authenticated(api).post(`company/${companyId}/jobroles/save`, payload)
  /**
   * POST Save Company
   * @param {*} payload
   */
  const postSaveHCMCompany = payload => authenticated(api).post('company/save', payload)
  /**
   * POST Save Company
   * @param {*} payload
   */
  const postSaveVRCompany = payload => authenticated(api).post('vr/company/save', payload)
  /**
   * GET Company: Employees List
   * @param {*} payload
   */
  const getCompanyEmployees = companyId => authenticated(api).get(`company/${companyId}/employees/list`)
  /**
   * GET Get Topics
   * @param {*} payload
   * @param {string} order // "new"(default), "activity", "popular", or "recent"
   */
  const getGetTopics = (options = 'category_id[]=10&order=new') => authenticated(api).get(`com/topic?${options}`)
  /**
   * GET Edit Featured Items
   * @param {string} type / post, topic, user, company, product
   */
  const getEditFeaturedItems = (type = 'post') => authenticated(api).get(`com/featured/${type}/edit`)
  /**
   * GET Edit Featured Items without authentication
   * @param {string} type / post, topic, user, company, product
   */
  const getFeaturedItems = (type = 'post') => api.get(`com/featured/${type}`)
  /**
   * GET Get Blog Posts
   * @param {*} options filter options based on blog id, category id, company id, user id, blog categories, and search
   * @description Get blog posts filtered by blog_id, category_id, company_id, user_id, blog categories, and search
   * @example /api/com/blogs?company_id=274373
   */
  const getBlogPosts = options => authenticated(api).get(`com/blogs?${options}`)
  /**
   * GET Get Blog Categories
   */
  const getComBlogCategories = () => authenticated(api).get('com/blog/categories')
  /**
   * Get Learn Feeds
   * @param {string} type feed type (one of training, habits, quotas, scorecards, programs, tracks, performances, habitschedules, tasks, assigned)
   * @param {number} userId user ID
   * @param {string} options query string such as per_page, page, assigned, order, sort, date_start, date_end, card_type_id, archived and etc
   */
  const getLearnFeeds = (type, userId, options) => authenticated(api).get(`/develop/${type}/${userId}?${options}`)
  /**
   * GET Category Sponsored Products
   * @param {*} payload
   */
  const getCategorySponsoredProducts = categoryId =>
    authenticated(api).get(`vr/categories/${categoryId}/products/sponsored`)

  /**
   * GET Quotas Actuals Feed
   * @param {*} payload
   */
  const getQuotasActuals = userId => authenticated(api).get(`develop/actuals/${userId}`)

  // Deprecated API Definitions

  //////////////////////////////////////////// App
  // Login API
  const loginByEmail = payload => api.post('auth/login', payload)
  const getLibraryFilters = () => authenticated(api).get(`/develop/library/filters`)
  const fileUpload = payload => s3API.post(Config.S3_API, payload)
  const getUserAuthors = () => authenticated(api).get(`authoring`)
  const getCompanyVendor = vendorId => vendorAPI.get(`/productsByCompany?id=${vendorId}`)

  // Recover Password
  const postRecoveryPassword = payload => api.post('auth/recovery', payload)

  //////////////////////////////////////////// Develop

  // Learn
  const getLearnFeed = (
    userId,
    status,
    perPage = 10,
    page = 1,
    startDate,
    endDate,
    assignType,
    order = 'due_at',
    sort = 'ASC'
  ) =>
    authenticated(api).get(
      `develop/training/${userId}?${status}&per_page=${perPage}&page=${page}&assigned=${assignType}&order=${order}&sort=${sort}&date_start=${startDate}&date_end=${endDate}`
    )
  const getAssignedCards = option => authenticated(api).get(`develop/assigned?${option}`)
  const getQuizQuestion = quizId => authenticated(api).get(`assessments/question/${quizId}`) // get question by quiz(assessment) id
  const submitAnswer = (quizId, payload) => authenticated(api).post(`assessments/answer/${quizId}`, payload)
  const getS3Info = () => authenticated(api).get('media/s3info')
  const resetQuiz = quizId => authenticated(api).post(`assessments/reset/${quizId}`)

  // user avatar upload
  const uploadAvatar = payload => authenticated(api).post('cropper/crop', payload)

  // APIs related to cards, need to refactor these APIs
  const updateCard = (event, cardId) => authenticated(api).post(`cards/${cardId}/event/${event}`)
  const getCardTemplate = templateId => authenticated(api).get(`cards/template/${templateId}`)
  const updateModule = payload => authenticated(api).post(`cards/${payload.id}/update`, payload.data)
  const createCard = payload => authenticated(api).post('cards/create', payload)
  const assignTraining = payload => authenticated(api).post(`/cards/assign`, payload)
  const assignScorecard = payload => authenticated(api).post('scorecard/assign', payload)
  /**
   * update card instance
   * @param {*} cardInstanceId card instance id
   * @param {*} payload updated card data
   * @param {*} event one of 'delete' and 'update'
   */
  const updateCardInstance = (cardInstanceId, event = '', payload = null) => {
    if (isEmpty(event)) {
      return authenticated(api).get(`cards/${cardInstanceId}`)
    }
    return authenticated(api).post(`cards/${cardInstanceId}/${event}`, payload)
  }

  const postUnassignContent = payload => authenticated(api).post('/unassign', payload)

  // Career
  const getCareerMap = companyId => authenticated(api).get(`standards/${companyId}`)
  const getCareerGoals = userId => authenticated(api).get(`users/${userId}/goals`)
  const postCareerGoals = (userId, data) => authenticated(api).post(`users/${userId}/goals/save`, data)
  const getCareerDevReports = (companyId, userId) => authenticated(api).get(`develop/career/${companyId}/${userId}`)
  const requestPromote = (companyId, userId) =>
    authenticated(api).post(`company/${companyId}/user/${userId}/requestpromotion`)

  // Reports
  const getUserReports = (userId, companyId, startDate, endDate) =>
    authenticated(api).get(
      `users/${userId}/user_development_report/${companyId}?date_start=${startDate}&date_end=${endDate}`
    )
  const getUsersCourseRequest = (userId, startDate, endDate) =>
    authenticated(api).get(
      `users/${userId}/course_list?per_page=5000&page=1&date_start=${startDate}&date_end=${endDate}`
    )
  const getTrainingReports = payload => authenticated(api).post('reports/training', payload)
  const getCompanyCareers = companyId => authenticated(api).get(`users/career_report/${companyId}`)
  const getFeedsReports = (userId, sort) =>
    authenticated(api).get(`develop/learn/${userId}?per_page=5000&page=1&assigned=${sort}`)
  const getAnniversaryBirthdayReports = (companyId, base, orderBy, order, month_start, month_end) =>
    authenticated(api).get(
      `reports/company/${companyId}/employees/${base}?order_by=${orderBy}&order=${order}&month_start=${month_start}&month_end=${month_end}`
    )
  // GET Certification Reports
  const getCertificationReport = (type, options) => authenticated(api).get(`reports/certification/${type}?${options}`)
  // get career reports
  const getCareerReports = (type, options) => authenticated(api).get(`reports/career/${type}?${options}`)
  // get company new hire orientation report
  const postHireOrientationReport = payload => authenticated(api).post('reports/individual/newhires', payload)
  // get quota report
  const postQuotaReports = payload => authenticated(api).post('reports/company/quotas', payload)
  // get Competency report
  const postTrainingCompetencyReports = payload => authenticated(api).post('reports/competency', payload)
  // get Individual Quota report
  const postIndividualQuotaReport = payload => authenticated(api).post('reports/individual/quotas', payload)

  // Archive
  const getArchivedFeeds = (userId, perPage = 10, page = 1) =>
    authenticated(api).get(`develop/learn/${userId}?card_type_id=1&archived=1&per_page=${perPage}&page=${page}`)

  // Library
  const postDevLibraryCardTemplates = (templates, options) => {
    if (isNil(options)) {
      return authenticated(api).post(`develop/library`, templates)
    }
    return authenticated(api).post(`develop/library${options}`, templates)
  }
  const getDevLibrarySearch = (type, url, perPage, page) =>
    authenticated(api).get(`develop/library/${type}/search?per_page=${perPage}&page=${page}${url}`)
  const getDevLibraryCourses = () => authenticated(api).get('develop/library/courses?author_id[]=1')
  const getDevLibraryModules = () => authenticated(api).get('develop/library/modules?author_id[]=1')
  const getDevLibraryTracks = () => authenticated(api).get('develop/library/tracks?author_id[]=1')
  const getDevLibraryAssignmentsFeed = (type, userId, curPage) =>
    authenticated(api).get(`/develop/${type}/${userId}?page=${curPage}`)
  // postDevLibraryTemplateSave, postDevLibraryTrackSave
  const postDevLibraryCardSave = (payload, type) => authenticated(api).post(`develop/library/${type}/save`, payload)
  const getDevLibrarySearchModules = (options, type) =>
    authenticated(api).get(`develop/library/${type}/search?${options}`)
  const postLibraryTrackSave = payload => authenticated(api).post('develop/library/track/save', payload)
  const getDevReportTrainingList = ({ options, user_id }) =>
    authenticated(api).post(`develop/library/tracks?type=3&${options}`, { user_id })
  const getDevReportAuthors = () => authenticated(api).get('develop/library/counts')
  const postDevLibraryAddDocument = payload => authenticated(api).post('develop/library/document/save', payload)
  const postDevLibraryCreateQuota = payload => authenticated(api).post('develop/library/quota_template/save', payload)
  const getLibrarySearch = (mode, options) => authenticated(api).get(`develop/library/${mode}?${options}`)
  const getQuotaOptions = () => authenticated(api).get(`quota/filters`)
  const getLibraryList = (companyId, type, options) =>
    authenticated(api).get(`develop/library/${type}/list/${companyId}?${options}`)

  /**
   * @param {string} type library type (required) one of 'track', 'template', 'program', 'quota_template', 'scorecard', 'assessment'
   * @param {string} mode event mode (required) - one of 'delete', 'save'
   * @param {number} cardId template id (optional)
   * @param {object} payload post data (optional)
   */
  const postDevLibraryEvent = (type, mode, cardId = null, payload = null) => {
    if (isNil(cardId)) {
      return authenticated(api).post(`develop/library/${type}/${mode}`, payload)
    }
    return authenticated(api).post(`develop/library/${type}/${mode}/${cardId}`, payload)
  }

  /**
   * program event API
   * @param {*} event one of 'start', 'stop', 'nextlevel', 'delete'
   * @param {*} payload user_id and program_id
   */
  const postProgramEvent = (event, payload) => authenticated(api).post(`program/${event}`, payload)
  const getProgramRequestPromotion = programId => authenticated(api).get(`program/${programId}/requestpromotion`)
  const getProgramStats = programId => authenticated(api).get(`program/${programId}/stats`)
  const getUserPrograms = (userId, options) => authenticated(api).get(`develop/programs/${userId}?${options}`)

  // need to refactor getting develop library list apis below this comment with 'getLibraryList'.
  const getDevLibraryCourseList = companyId =>
    authenticated(api).get(
      `develop/library/courses/list/${companyId}?card_type_id[]=2&card_type_id[]=3&card_type_id[]=4&card_type_id[]=5&card_type_id[]=6&card_type_id[]=7&card_type_id[]=8&card_type_id[]=9&card_type_id[]=12&card_type_id[]=13&card_type_id[]=14&card_type_id[]=15`
    )
  const getDevLibraryModuleList = options => authenticated(api).get(`develop/library/modules/list/${options}`)
  const getDevLibraryTrackList = companyId => authenticated(api).get(`develop/library/tracks/list/${companyId}`)
  const getDevLibraryProgramsList = companyId => authenticated(api).get(`develop/library/programs/list/${companyId}`)
  // GET Manager Dashboard
  const getManagerDashboard = (companyId, dateStart, dateEnd) =>
    authenticated(api).get(
      `reports/manager/dashboard?company_id=${companyId}&date_start=${dateStart}&date_end=${dateEnd}`
    )
  ////////////////////////////////////////////////////

  // Records
  const postDevRecordsCompany = payload => authenticated(api).post('company/save', payload)

  //////////////////////////////////////////// Manage

  const getTasks = (userId, perPage, page, order = 'due_at', sort = 'ASC') =>
    authenticated(api).get(`develop/tasks/${userId}?per_page=${perPage}&page=${page}&order=${order}&sort=${sort}`)
  const getHabits = (userId, perPage, page, options = '', order = 'due_at', sort = 'ASC') =>
    authenticated(api).get(
      `develop/habits/${userId}?per_page=${perPage}&page=${page}&order=${order}&sort=${sort}&${options}`
    )
  const getStats = (userId, options = '') => authenticated(api).get(`users/${userId}/taskcounts${options}`)
  const getUsers = companyId => authenticated(api).get(`company/${companyId}/employees`)
  const addComment = payload => authenticated(api).post(`/comments/create`, payload)
  const getProjectStats = companyIds => authenticated(api).get(`projects?${companyIds}&stats=1`)
  const getEmployees = companyId => authenticated(api).get(`users/manages/list/${companyId}`)

  // Add Project
  const postMngProjectsAddNew = (payload, companyId) =>
    authenticated(api).post(`company/${companyId}/projects/add`, payload)

  // Update Project
  const postMngProjectsUpdate = (payload, companyId, projectId) =>
    authenticated(api).post(`company/${companyId}/projects/${projectId}/update`, payload)

  // Delete Project
  const postMngProjectsDelete = (projectId, companyId) =>
    authenticated(api).post(`company/${companyId}/projects/${projectId}/delete`)

  // get Authors
  const getAuthors = companyId => authenticated(api).get(`develop/library/list/${companyId}`)
  //get Courses
  const getCourses = (payload, perPage) =>
    authenticated(api).post(`develop/library/search?per_page=${perPage}`, payload)

  const searchCourses = payload => authenticated(api).post(`develop/library/search?`, payload)

  const getProjectTasks = (companyId, projectId) =>
    authenticated(api).get(`company/${companyId}/projects/${projectId}/tasks`)

  const getUserProjectTasks = (userId, options) => authenticated(api).get(`develop/tasks/${userId}?${options}`)
  const getUserProjecthabits = (userId, options) =>
    authenticated(api).get(`develop/habits/${userId}?per_page=5000&${options}`)

  // get individual tasks
  const getUsertasks = (userId, startDate, endDate) =>
    authenticated(api).get(`/users/${userId}/taskcounts?date_start=${startDate}&date_end=${endDate}`)
  // get company tasks
  const getCompanytasks = (companyId, startDate, endDate) =>
    authenticated(api).get(`/users/manages/${companyId}/taskcounts?date_start=${startDate}&date_end=${endDate}`)

  // POST Engagement: Tasks Report Individuals
  const getIndividualTasks = payload => authenticated(api).post('reports/individual/tasks', payload)

  // GET Company Performance Reviews
  const getCompanyPerformanceReviews = (companyId, userId, perPage, page, startDate, endDate) => {
    if (isNil(userId)) {
      return authenticated(api).get(
        `/performance/users?${companyId}&per_page=${perPage}&page=${page}&date_start=${startDate}&date_end=${endDate}`
      )
    }
    return authenticated(api).get(
      `/performance/users?${companyId}&${userId}&per_page=${perPage}&page=${page}&date_start=${startDate}&date_end=${endDate}`
    )
  }

  //GET Company Performance Reviews Stats
  const getCompanyPerformanceReviewStats = (companyId, userId, startDate, endDate) => {
    if (isNil(userId)) {
      return authenticated(api).get(`/performance/report?${companyId}&date_start=${startDate}&date_end=${endDate}`)
    }
    return authenticated(api).get(
      `/performance/report?${companyId}&${userId}&date_start=${startDate}&date_end=${endDate}`
    )
  }

  // GET Individual Performance Review
  const getIndividualPerformanceReview = options => authenticated(api).get(`performance${options}`)
  // POST Performance Review Save
  const postPerformanceReview = payload => authenticated(api).post('performance/save', payload)
  /**
   * GET Performance Reviews Feed
   * @param {number} id
   */
  const getPerformanceReviews = (id, page, per, order, startDate, endDate, companyId) => {
    if (companyId) {
      return authenticated(api).get(
        `/develop/performances/${id}?page=${page}&per_page=${per}&order=${order}&date_start=${startDate}&date_end=${endDate}&company_id=${companyId}`
      )
    }
    return authenticated(api).get(
      `/develop/performances/${id}?page=${page}&per_page=${per}&order=${order}&date_start=${startDate}&date_end=${endDate}`
    )
  }

  /**
   * POST Engagement: <...> Reports
   * @param {*} payload
   * @param {*} by company | individual
   * @param {*} type trainings | newhires | performances | tasks | careers | records | users
   */
  const postMngReportsEngagementReport = (payload, by, type) =>
    authenticated(api).post(`/reports/${by}/${type}`, payload)

  // POST Edit Profile
  const postEditProfile = (userId, payload) => authenticated(api).post(`/users/${userId}/profile/save`, payload)
  /**
   * POST Scorecard Save
   */
  const postScorecardSave = payload => authenticated(api).post('develop/library/scorecard/save', payload)
  /**
   * POST Delete Scorecard
   * @param {*} payload
   * Example: {"scorecard": {"id":5} }
   */
  const postDeleteScorecard = payload => authenticated(api).post('scorecard/delete', payload)
  /**
   * GET Scorecard instance
   * @param {number} scorecardId
   */
  const getScorecard = scorecardId => authenticated(api).get(`scorecard/${scorecardId}`)

  /**
   * Endpoints to get company info such as users, departments, job roles, etc.
   */
  const getCompanies = () => authenticated(api).get('company')
  const getCompany = companyId => authenticated(api).get(`company/${companyId}`)
  const getCompanyUsers = (companyId, perPage = 50, currentPage = 1) =>
    authenticated(api).get(`company/${companyId}/users?per_page=${perPage}&page=${currentPage}`)
  const postCompanyUsers = (payload, companyId) => authenticated(api).post(`company/${companyId}/users/save`, payload)

  // Notifications
  const getNotifications = options => authenticated(api).get(`notifications${options}`)
  const updateNotifications = (id, type) => authenticated(api).post(`notifications/${id}/${type}`)

  // Notifications Settings
  const getDevRecordsNotificationsSettings = () => authenticated(api).get('notification-settings')
  const postDevRecordsNotificationsSettings = payload => authenticated(api).post('notification-settings/save', payload)

  // Terminate, Unterminate and Delete user
  const postTerminateUser = (payload, companyId, event) =>
    authenticated(api).post(`company/${companyId}/users/${event}`, payload)
  const postDeleteUser = userId => authenticated(api).post(`users/${userId}/delete`)

  // Vendor
  const getVendorCategories = () => authenticated(api).get('vr/categories')
  const getCategoryPopularProducts = categoryId =>
    authenticated(api).get(`vr/categories/${categoryId}/products/popular`)
  const getCategoryProducts = (category_id, options = '') =>
    authenticated(api).get(`vr/categories/${category_id}/products?${options}`)

  // Get vendor company detail
  const postBusinessCompany = payload => authenticated(api).post('business/save', payload)
  const getVendorCompaniesAlphabet = (options = 'alphabet') => authenticated(api).get(`vr/company/${options}`)
  const getCompanyBusiness = options => authenticated(api).get(`business?${options}`)
  const getVendorCompanies = (options = '') => authenticated(api).get(`vr/companies?${options}`)

  // add/remove company admin
  /**
   *
   * @param {*} type one of "add" and "remove"
   * @param {*} payload {"user_id":[42473],"company_id":195011}
   */
  const postVRCompanyAdmin = (type, payload) => authenticated(api).post(`vr/company/admin/${type}`, payload)

  /**
   *
   * @param {*} type one of "add" and "remove"
   * @param {*} payload {"blog_id": 1111, "user_id":9999}
   */
  const postBlogCompanyAdmin = (type, payload) => authenticated(api).post(`com/blog/admin/${type}`, payload)

  /**
   * @description add a business into company
   * @param {string} type one of vr and hcm
   * @param {*} payload { "business_id": 1, "company_id": 5 }
   */
  const postAddBusiness = (type, payload) => authenticated(api).post(`business/${type}/add`, payload)

  // Save vendor rating
  const postSaveVendorRating = payload => authenticated(api).post('vr/rating/save', payload)

  // Save vendor avatar/cover photo
  const postSaveVRPhoto = payload => authenticated(api).post('cropper/com/crop', payload)

  // GET awards
  const getVendorAwards = () => authenticated(api).get('vr/awards')

  // Search
  const postGlobalSearch = payload => authenticated(api).post('/vr/globalsearch', payload)

  // Company profile blog
  const getComTopicCategories = () => authenticated(api).get('com/topic/categories')

  /**
   * @param payload {"blog": { "id": 1463, "entity_id": 37257, "meta": null, "data": { "categories": ["Fruits", "Colors", "Nukes"] }, "group_id": 2196 }}
   * @description endpoint to save blog and blog category
   */
  const postSaveBlog = payload => authenticated(api).post('com/blog/save', payload)

  /**
   *
   * @param {*} payload {"post": { "id": 234, "name": "post name", "entity_id": 36732, "status": 2, "data": { "body": "Post body message" } }}
   */
  const postSaveBlogPost = payload => authenticated(api).post('com/blog/post/save', payload)

  /**
   *
   * @param {*} payload { "post":{ "id":123, "blog_id": 4188, "user_id": 80821 } }
   * @description 3 fields post.id, post.user_id(community User), and either the post.blog_id or post.entity_id are required
   */
  const postDeleteBlogPost = payload => authenticated(api).post('com/blog/post/delete', payload)

  // Community
  const postForumTopic = payload => authenticated(api).post('com/topic/save', payload)
  const postSaveComment = payload => authenticated(api).post('com/comment/save', payload)
  const getUserPermissions = userId => authenticated(api).get(`users/${userId}/business/permissions`)

  // GET Community user
  const getcommunityUser = userId => authenticated(api).get(`com/user?user_id=${userId}`)
  const getCommunityUserView = userId => authenticated(api).get(`com/user/view?user_id=${userId}`)
  const getCommunityBlog = userId => authenticated(api).get(`com/blog?user_id=${userId}`)
  const getBlogSummary = options => authenticated(api).get(`com/blog/summary?${options}`)
  const getBlogDetail = (blogId, options = '') => authenticated(api).get(`com/blog?blog_id=${blogId}&${options}`)
  const getBusinessBlog = (businessId, options = '') =>
    authenticated(api).get(`com/blog?business_id=${businessId}&${options}`)

  // Save community user
  const postCommunityUser = payload => authenticated(api).post('com/user/save', payload)

  // Get connections
  const getConnections = options => authenticated(api).get(`com/entity/connections?${options}`)
  const postConnectRequest = payload => authenticated(api).post('com/entity/connect', payload)
  /**
   * POST unfollow request
   * @param {*} payload {"company_id":44, "connect_company_id":195011}
   */
  const postUnfollowRequest = payload => authenticated(api).post('com/entity/unfollow', payload)
  /**
   * POST follow request
   * @param {*} payload {"company_id":446859, "connect_user_id":42701}
   */
  const postFollowRequest = payload => authenticated(api).post('com/entity/follow', payload)
  /**
   * POST connection update
   * @param {*} action one of active, rejected, delete
   * @param {*} payload {"connection_id":1200}
   */
  const postConnectionUpdate = ({ action, payload }) =>
    authenticated(api).post(`com/entity/connection/${action}`, payload)

  // Upload file
  const getCommunityS3Info = () => authenticated(api).get('media/s3com')
  const postUploadfile = (url, payload) => s3API.post(url, payload)

  // Register community user
  const postRegisterUser = payload => authenticated(api).post('com/user/register', payload)

  return {
    postQuotaActualsSave,
    getCareerProgram,
    postCareerProgram,
    postCheckPassword,
    postTrainingReport,
    getGenerateHash,
    postPresentationSave,
    getActualsCount,
    getQuotasActuals,
    postQuotaActualComment,
    postSignOff,
    postTerminateEmployee,
    getVRCompany,
    getGetCompany,
    getGetCompanyWithDate,
    getRecentlyUpdatedProducts,
    getPopularProducts,
    postMultiCompanyEmployees,
    getGetBlog,
    postCreateBlog,
    postAddUser,
    postRemoveUser,
    postMultiCompanyData,
    postSaveProductMedia,
    deleteProductMedia,
    getAllAuthors,
    postSaveAuthor,
    postSaveBusinessAuthor,
    postDeleteAuthor,
    getGetBusiness,
    postAddEditDepartments,
    postAddEditTeams,
    postSaveJobRoles,
    postSaveHCMCompany,
    getCompanyEmployees,
    getGetTopics,
    getEditFeaturedItems,
    getFeaturedItems,
    getLearnFeeds,
    getCategorySponsoredProducts,

    // Deprecated API Definitions

    //////// App
    loginByEmail,
    getUserAuthors,
    getCompanyVendor,
    getLibraryFilters,
    getCompanies,
    getCompany,
    getCompanyUsers,
    getNotifications,
    updateNotifications,
    postRecoveryPassword,

    //////// Develop

    // Learn
    getLearnFeed,
    updateCard,
    updateCardInstance,
    getCardTemplate,
    getAssignedCards,
    getQuizQuestion,
    submitAnswer,
    resetQuiz,
    updateModule,
    createCard,

    // Career
    getCareerMap,
    getCareerGoals,
    postCareerGoals,
    getCareerDevReports,
    getCareerReports,
    getCompanyCareers,
    requestPromote,

    // Reports
    getUserReports,
    getUsersCourseRequest,
    getTrainingReports,
    getFeedsReports,
    getCertificationReport,
    postHireOrientationReport,
    getAnniversaryBirthdayReports,
    postQuotaReports,
    postTrainingCompetencyReports,
    postIndividualQuotaReport,

    // Library
    postDevLibraryCardTemplates,
    getDevLibrarySearch,
    getDevLibraryCourses,
    getDevLibraryModules,
    getDevLibraryAssignmentsFeed,
    getDevLibraryTracks,
    getDevLibraryCourseList,
    getDevLibraryModuleList,
    getDevLibraryTrackList,
    getDevLibrarySearchModules,
    postDevLibraryCardSave,
    postLibraryTrackSave,
    getDevReportTrainingList,
    getDevReportAuthors,
    postDevLibraryCreateQuota,
    postDevLibraryAddDocument,
    getDevLibraryProgramsList,
    getLibrarySearch,
    getQuotaOptions,
    getLibraryList,
    postDevLibraryEvent,
    postScorecardSave,
    postDeleteScorecard,
    getScorecard,

    // Records
    postCompanyUsers,
    postDevRecordsCompany,
    getDevRecordsNotificationsSettings,
    postDevRecordsNotificationsSettings,
    postEditProfile,

    //////// Manage
    getTasks,
    getHabits,
    getStats,
    getUsers,
    addComment,
    getProjectStats,
    getEmployees,
    getProjectTasks,
    getUserProjectTasks,
    getUserProjecthabits,
    getCompanyPerformanceReviews,
    getCompanyPerformanceReviewStats,
    getIndividualPerformanceReview,
    postPerformanceReview,
    getPerformanceReviews,
    getIndividualTasks,
    getManagerDashboard,

    //Vendor
    getVendorCategories,
    getCategoryPopularProducts,
    getCategoryProducts,

    // Company
    postBusinessCompany,
    getCompanyBusiness,
    postSaveVendorRating,
    postSaveProduct,
    postSaveVRCompany,
    postSaveVRPhoto,
    getVendorCompanies,
    getVendorCompaniesAlphabet,
    getVendorAwards,
    postGlobalSearch,
    postVRCompanyAdmin,
    postBlogCompanyAdmin,

    // add business
    postAddBusiness,

    // add business
    postAddBusiness,

    //Community
    postForumTopic,
    postRegisterUser,
    postSaveComment,

    // Get Community user
    getcommunityUser,
    getCommunityUserView,
    getCommunityBlog,
    getBlogSummary,
    getBlogDetail,
    getBusinessBlog,
    postCommunityUser,
    getCommunityS3Info,
    postUploadfile,
    getConnections,
    postConnectRequest,
    postFollowRequest,
    postUnfollowRequest,
    postConnectionUpdate,

    // Company profile blog
    getComBlogCategories,
    getComTopicCategories,
    getBlogPosts,
    postSaveBlog,
    postSaveBlogPost,
    postDeleteBlogPost,

    //Add Training
    getAuthors,
    getCourses,
    searchCourses,

    //Assign Training
    assignTraining,

    // assign scorecard
    assignScorecard,

    // unassign content
    postUnassignContent,

    // Add Project
    postMngProjectsAddNew,

    // Update Project
    postMngProjectsUpdate,

    // Delete Project
    postMngProjectsDelete,

    // File upload
    fileUpload,
    getS3Info,
    uploadAvatar,

    // Archived
    getArchivedFeeds,

    // Reports
    getUsertasks,
    getCompanytasks,
    postMngReportsEngagementReport,

    // Program
    postProgramEvent,
    getProgramRequestPromotion,
    getProgramStats,
    getUserPrograms,

    // Terminate, Unterminate and Delete user
    postTerminateUser,
    postDeleteUser,
    getUserPermissions,
  }
}

export default {
  create,
}
