import { createReducer } from 'reduxsauce'
import { produce } from 'immer'
import {
  clone,
  concat,
  dropLast,
  equals,
  filter,
  findIndex,
  has,
  includes,
  isEmpty,
  isNil,
  merge,
  prepend,
  propEq,
  replace,
  uniqBy,
  prop,
  sortBy,
  toLower,
  compose,
} from 'ramda'
import { AppTypes } from '~/actions/app'
import { convertUrl, removeStatus, version } from '~/services/util'
import { UserRoles } from '~/services/config'

const initialState = {
  status: [],
  version: '1.0.0',

  // User information
  firebase: '',
  token: '',
  user: {},
  created_at: '',
  updated_at: '',
  id: '',
  avatar: '',
  birthday: '',
  career_goal: '',
  first_name: '',
  last_name: '',
  email: '',
  timezone: '',
  job_title: '',
  users: [],
  companies: [], // Companies that I can access
  employees: [], // Employees that I can access
  primary_rold_id: UserRoles.EMPLOYEE, // User role for system admin
  app_role_id: UserRoles.EMPLOYEE, // User role for their company
  company_info: {},
  manager_info: {},

  projects: [],

  allAuthors: {},
  userAuthors: [],
  quotaFeeds: [],

  // All available tags for Advanced Search
  authors: [],
  categories: [],
  departments: [],
  competencies: [],

  // Selected tags Advanced Search
  selectedTags: {
    authors: [],
    categories: [],
    departments: [],
    competencies: [],
  },

  // Library search option
  published: true,

  // Company Vendor
  vendor: [],

  // Selected Company and Employee for Global Filter
  selectedCompany: [-1],
  selectedEmployee: {
    individual: [-1],
    team: [-1],
  },

  // User notification
  notificationsData: {
    total: 0,
    new: 0,
    viewed: 0,
    status: [],
    notifications: {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 1,
      last_page: 2,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 25,
      prev_page_url: null,
      to: 25,
      total: 34,
    },
  },

  //selected Project
  selectedProject: -1,

  // UPLOAD FILE
  learnUploadURL: {},

  // Modals
  modalType: '',
  modalData: {
    before: null,
    after: null,
  },
  modalCallBack: {
    onYes: () => {},
    onNo: () => {},
  },

  // The latest 3 route histories
  locations: ['', '', ''],
}

const loginRequest = produce((draft, action) => {
  draft.status.push('pending-alg')
  draft.version = version()
})
const loginSuccess = produce((draft, action) => {
  const { firebase, token, user } = action.response
  const {
    companies,
    created_at,
    data,
    deleted_at,
     _id,
    email,
    email2,
    app_role_id,
    feed,
    id,
    company_id,
    profile,
    updated_at,
    company_info,
    manager_info,
    primary_role_id,
  } = user
  const { avatar, birthday, career_goal, email_preference, first_name, last_name, job_title, phone, timezone } = profile
  const sortByName = sortBy(compose(toLower, prop('name')))
  let _companies = filter(e => !e.deleted_at, companies)
  _companies = sortByName(_companies)
  draft.status = removeStatus('pending-alg', draft.status)
  draft.firebase = firebase
  draft.token = token
  draft.user = user
  draft.created_at = created_at
  draft.updated_at = updated_at
  draft.id = id
  draft.avatar = convertUrl(avatar, '/images/default.png')
  draft.birthday = birthday
  draft.career_goal = career_goal
  draft.first_name = first_name
  draft.last_name = last_name
  draft.job_title = job_title
  draft.email = email
  draft.timezone = timezone
  draft.companies = _companies
  draft.primary_role_id = primary_role_id
  draft.app_role_id = app_role_id
  draft.company_info = company_info
  draft.manager_info = manager_info
  draft.selectedCompany =
    primary_role_id < UserRoles.USER && primary_role_id > UserRoles.SUPER_ADMIN ? [-1] : [company_id]
  draft.selectedEmployee = {
    individual: [id],
    team: primary_role_id < UserRoles.USER ? [-1] : [id],
  }
})
const loginFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-alg', draft.status)
})

const logoutRequest = produce((draft, action) => {
  draft.status = []
})
const logoutSuccess = produce((draft, action) => {
  draft.status = []
})
const logoutFailure = produce((draft, action) => {
  draft.status = []
})

const getauthorsRequest = produce((draft, action) => {
  draft.status.push('pending-aga')
})
const getauthorsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-aga', draft.status)
  draft.userAuthors = action.response
})
const getauthorsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-aga', draft.status)
})

const getuserconnectionsRequest = produce((draft, action) => {
  draft.status.push('pending-auc')
})
const getuserconnectionsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-auc', draft.status)
  const user = {
    ...draft.user,
    community_user: {
      ...draft.user.community_user,
      connections: action.response,
    },
  }
  draft.user = user
})
const getuserconnectionsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-auc', draft.status)
})

// Fetch Comopany Vendor
const fetchcompanyvendorRequest = produce((draft, action) => {
  draft.status.push('pending-afc')
})
const fetchcompanyvendorSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-afc', draft.status)
  draft.vendor = action.response
})
const fetchcompanyvendorFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-afc', draft.status)
})

// Library Filters
const libraryfiltersRequest = produce((draft, action) => {
  draft.status.push('pending-alf')
})
const libraryfiltersSuccess = produce((draft, action) => {
  const { authors, categories, competencies, departments } = action.response
  draft.status = removeStatus('pending-alf', draft.status)
  draft.authors = authors
  draft.categories = categories
  draft.competencies = competencies
  draft.departments = departments
})
const libraryfiltersFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-alf', draft.status)
})

// File upload
const uploadRequest = produce((draft, action) => {
  draft.status.push('pending-aul')
})
const uploadSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-aul', draft.status)
  draft.learnUploadURL = action.response
})
const uploadFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-aul', draft.status)
})

const globalcompaniesRequest = produce((draft, action) => {
  draft.status.push('pending-agc')
})
const globalcompaniesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-agc', draft.status)
  draft.companies = action.response
})
const globalcompaniesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-agc', draft.status)
})

const postcompanyemployeesRequest = produce((draft, action) => {
  // draft.status.push('pending-pal')
})
const postcompanyemployeesSuccess = produce((draft, action) => {
  const role = draft.app_role_id
  const userId = draft.id
  let { employees } = action.response
  employees = filter(a => isNil(a.terminated_at), employees || [])
  const users = employees
  if (role === 1) {
  } else if (role === 2 || role === 3) {
    const employees1 = filter(item => item.manager_id === userId || item.id === userId, employees)
    const block = [{ id: null, name: 'BLOCK' }]
    const employees2 = filter(item => item.manager_id !== userId && item.id !== userId, employees)
    employees = concat(employees1, block)
    employees = concat(employees, employees2)
  } else {
    employees = filter(propEq('id', userId), employees)
  }
  // draft.status = removeStatus('pending-pal', draft.status)
  draft.employees = employees
  draft.users = users
})
const postcompanyemployeesFailure = produce((draft, action) => {
  // draft.status = removeStatus('pending-pal', draft.status)
})

const getcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-agm')
})
const getcompanySuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-agm', draft.status)
  draft.companyDetail = action.response
})
const getcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-agm', draft.status)
})

const posteditprofileRequest = produce((draft, action) => {
  draft.status.push('pending-ape')
})
const posteditprofileSuccess = produce((draft, action) => {
  const user = action.response
  const idx = findIndex(propEq('id', user.id), draft.employees)
  if (idx > -1) {
    draft.employees[idx].profile.first_name = user.profile.first_name
    draft.employees[idx].profile.last_name = user.profile.last_name
    draft.employees[idx].profile.phone = user.profile.phone
    draft.employees[idx].profile.about_me = user.profile.about_me
    draft.employees[idx].profile.career_goal = user.profile.career_goal
    draft.employees[idx].name = `${user.profile.first_name} ${user.profile.last_name}`
    draft.employees[idx].email = user.email
    draft.employees[idx].email2 = user.email2
  }
  let _first_name = draft.first_name
  let _last_name = draft.last_name
  let _avatar = draft.avatar
  if (draft.id == user.id) {
    draft.user.profile = user.profile
    draft.user.email = user.email
    draft.user.email2 = user.email2
    draft.user.updated_at = user.updated_at
    _first_name = user.profile.first_name
    _last_name = user.profile.last_name
    _avatar = convertUrl(user.profile.avatar, '/images/default.png')
  }
  draft.status = removeStatus('pending-ape', draft.status)
  draft.first_name = _first_name
  draft.last_name = _last_name
  draft.avatar = _avatar
})
const posteditprofileFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ape', draft.status)
})

const postuploadavatarRequest = produce((draft, action) => {
  draft.status.push('pending-pua')
})
const postuploadavatarSuccess = produce((draft, action) => {
  const { path } = action.response
  draft.avatar = path
  draft.status = removeStatus('pending-pua', draft.status)
})
const postuploadavatarFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-pua', draft.status)
})

const postcompanyusersRequest = produce((draft, action) => {
  draft.status.push('pending-apu')
})
const postcompanyusersSuccess = produce((draft, action) => {
  const users = action.response
  users.forEach(user => {
    const idx = findIndex(propEq('id', user.id), draft.employees)
    if (idx > -1) {
      draft.employees[idx].profile.first_name = user.profile.first_name
      draft.employees[idx].profile.last_name = user.profile.last_name
      draft.employees[idx].profile.phone = user.profile.phone
      draft.employees[idx].profile.about_me = user.profile.about_me
      draft.employees[idx].profile.career_goal = user.profile.career_goal
      draft.employees[idx].name = `${user.profile.first_name} ${user.profile.last_name}`
      draft.employees[idx].email = user.email
      draft.employees[idx].email2 = user.email2
    }
    let _first_name = draft.first_name
    let _last_name = draft.last_name
    let _avatar = draft.avatar
    if (draft.id == user.id) {
      draft.user.profile = user.profile
      draft.user.email = user.email
      draft.user.email2 = user.email2
      draft.user.updated_at = user.updated_at
      _first_name = user.profile.first_name
      _last_name = user.profile.last_name
      _avatar = convertUrl(user.profile.avatar, '/images/default.png')
    }
    draft.first_name = _first_name
    draft.last_name = _last_name
    draft.avatar = _avatar
  })
  draft.status = removeStatus('pending-apu', draft.status)
})
const postcompanyusersFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-apu', draft.status)
})

// Notifications Bell
const fetchnotificationsRequest = produce((draft, action) => {
  // draft.status.push('pending-afn')
})
const fetchnotificationsSuccess = produce((draft, action) => {
  const { notifications, total } = action.response
  let data = clone(draft.notificationsData.notifications.data)
  let notificationsData

  if (total == 0) {
    notificationsData = {
      ...action.response,
      notifications: {
        ...draft.notificationsData.notifications,
        data: [],
      },
    }
  } else {
    const { current_page, per_page } = notifications
    const from = (current_page - 1) * Number(per_page)
    data.splice(from, Number(per_page), ...notifications.data)
    data = uniqBy(prop('id'), data)
    notificationsData = {
      ...action.response,
      notifications: {
        ...notifications,
        data,
      },
    }
  }
  // draft.status = removeStatus('pending-afn', draft.status)
  draft.notificationsData = notificationsData
})
const fetchnotificationsFailure = produce((draft, action) => {
  // draft.status = removeStatus('pending-afn', draft.status)
})

const updatenotificationsRequest = produce((draft, action) => {
  draft.status.push('pending-aun')
})
const updatenotificationsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-aun', draft.status)
})
const updatenotificationsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-aun', draft.status)
})

const postrecoverypasswordRequest = produce((draft, action) => {
  draft.status.push('pending-apr')
})
const postrecoverypasswordSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-apr', draft.status)
})
const postrecoverypasswordFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-apr', draft.status)
})

const postmulticompanydataRequest = produce((draft, action) => {
  draft.status.push('pending-apd')
})
const postmulticompanydataSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-apd', draft.status)
  draft.companies = action.response
  let projects = []
  action.response.forEach(item => {
    item.projects.forEach(project => {
      projects.push({ ...project, company_name: item.name })
    })
  })
  draft.projects = projects
})
const postmulticompanydataFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-apd', draft.status)
})

const getallauthorsRequest = produce((draft, action) => {
  draft.status.push('pending-aat')
})
const getallauthorsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-aat', draft.status)
  draft.allAuthors = action.response
})
const getallauthorsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-aat', draft.status)
})

const postsaveauthorRequest = produce((draft, action) => {
  draft.status.push('pending-vsa')
})
const postsaveauthorSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vsa', draft.status)
})
const postsaveauthorFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vsa', draft.status)
})

const postsavebusinessauthorRequest = produce((draft, action) => {
  draft.status.push('pending-vsbs')
})
const postsavebusinessauthorSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vsbs', draft.status)
})
const postsavebusinessauthorFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vsbs', draft.status)
})

const postdeleteauthorRequest = produce((draft, action) => {
  draft.status.push('pending-ada')
})
const postdeleteauthorSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-ada', draft.status)
})
const postdeleteauthorFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ada', draft.status)
})

// Show Modals
const modalRequest = produce((draft, action) => {
  const { type, data, callBack } = action.payload
  let before = {},
    after = {}
  if (!isNil(data)) {
    if (has('before', data)) before = data.before
    if (has('after', data)) after = data.after
  }

  // When modal type is null, we just update only modal data
  if (isNil(type)) {
    draft.modalData = { before, after }
    return
  }

  // Confirmation modal
  if (equals(type, 'Confirm')) {
    // Show only confirmation modal
    if (isEmpty(draft.modalType) || isNil(draft.modalType)) {
      draft.modalType = type
      draft.modalData = { before, after }
      draft.modalCallBack = callBack
      return
    }

    // Show two modals at the same time
    draft.modalType = includes('Confirm', draft.modalType)
      ? replace(' - Confirm', '', draft.modalType)
      : draft.modalType + ' - ' + type
    draft.modalData = {
      before: merge(draft.modalData.before, {
        __title: before.title,
        __body: before.body,
        __description: before.description,
      }),
      after: draft.modalData.after,
    }
    draft.modalCallBack = callBack
    return
  }

  // Close modal or show the other modal normally
  draft.modalType = equals(draft.modalType, type) ? '' : type
  draft.modalData = { before, after }
  draft.modalCallBack = callBack
})

const getcommunityusersRequest = produce((draft, action) => {
  draft.status.push('pending-aga')
})
const getcommunityusersSuccess = produce((draft, action) => {
  draft.avatar = action.response.user?.avatar
  draft.status = removeStatus('pending-aga', draft.status)
})
const getcommunityusersFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-aga', draft.status)
})

const advancedsearchRequest = produce((draft, action) => {
  draft.selectedTags = action.tags
  draft.published = action.published
})

const locationsRequest = produce((draft, action) => {
  draft.locations = prepend(action.payload.route, draft.locations)
  draft.locations = dropLast(1, draft.locations)
})

const globalfilterRequest = produce((draft, action) => {
  const { companies, employees } = action
  draft.selectedCompany = companies
  draft.selectedEmployee = employees
})

const selectprojectRequest = produce((draft, action) => {
  draft.selectedProject = action.id
})

const clearRequest = produce((draft, action) => (draft = initialState))

export const reducer = createReducer(initialState, {
  [AppTypes.LOGIN_REQUEST]: loginRequest,
  [AppTypes.LOGIN_SUCCESS]: loginSuccess,
  [AppTypes.LOGIN_FAILURE]: loginFailure,

  [AppTypes.LOGOUT_REQUEST]: logoutRequest,
  [AppTypes.LOGOUT_SUCCESS]: logoutSuccess,
  [AppTypes.LOGOUT_FAILURE]: logoutFailure,

  [AppTypes.GETAUTHORS_REQUEST]: getauthorsRequest,
  [AppTypes.GETAUTHORS_SUCCESS]: getauthorsSuccess,
  [AppTypes.GETAUTHORS_FAILURE]: getauthorsFailure,

  [AppTypes.GETUSERCONNECTIONS_REQUEST]: getuserconnectionsRequest,
  [AppTypes.GETUSERCONNECTIONS_SUCCESS]: getuserconnectionsSuccess,
  [AppTypes.GETUSERCONNECTIONS_FAILURE]: getuserconnectionsFailure,

  [AppTypes.LIBRARYFILTERS_REQUEST]: libraryfiltersRequest,
  [AppTypes.LIBRARYFILTERS_SUCCESS]: libraryfiltersSuccess,
  [AppTypes.LIBRARYFILTERS_FAILURE]: libraryfiltersFailure,

  [AppTypes.UPLOAD_REQUEST]: uploadRequest,
  [AppTypes.UPLOAD_SUCCESS]: uploadSuccess,
  [AppTypes.UPLOAD_FAILURE]: uploadFailure,

  [AppTypes.GLOBALCOMPANIES_REQUEST]: globalcompaniesRequest,
  [AppTypes.GLOBALCOMPANIES_SUCCESS]: globalcompaniesSuccess,
  [AppTypes.GLOBALCOMPANIES_FAILURE]: globalcompaniesFailure,

  [AppTypes.POSTCOMPANYEMPLOYEES_REQUEST]: postcompanyemployeesRequest,
  [AppTypes.POSTCOMPANYEMPLOYEES_SUCCESS]: postcompanyemployeesSuccess,
  [AppTypes.POSTCOMPANYEMPLOYEES_FAILURE]: postcompanyemployeesFailure,

  [AppTypes.GETCOMPANY_REQUEST]: getcompanyRequest,
  [AppTypes.GETCOMPANY_SUCCESS]: getcompanySuccess,
  [AppTypes.GETCOMPANY_FAILURE]: getcompanyFailure,

  [AppTypes.POSTEDITPROFILE_REQUEST]: posteditprofileRequest,
  [AppTypes.POSTEDITPROFILE_SUCCESS]: posteditprofileSuccess,
  [AppTypes.POSTEDITPROFILE_FAILURE]: posteditprofileFailure,

  [AppTypes.POSTUPLOADAVATAR_REQUEST]: postuploadavatarRequest,
  [AppTypes.POSTUPLOADAVATAR_SUCCESS]: postuploadavatarSuccess,
  [AppTypes.POSTUPLOADAVATAR_FAILURE]: postuploadavatarFailure,

  [AppTypes.POSTCOMPANYUSERS_REQUEST]: postcompanyusersRequest,
  [AppTypes.POSTCOMPANYUSERS_SUCCESS]: postcompanyusersSuccess,
  [AppTypes.POSTCOMPANYUSERS_FAILURE]: postcompanyusersFailure,

  //Notifications
  [AppTypes.FETCHNOTIFICATIONS_REQUEST]: fetchnotificationsRequest,
  [AppTypes.FETCHNOTIFICATIONS_SUCCESS]: fetchnotificationsSuccess,
  [AppTypes.FETCHNOTIFICATIONS_FAILURE]: fetchnotificationsFailure,

  [AppTypes.UPDATENOTIFICATIONS_REQUEST]: updatenotificationsRequest,
  [AppTypes.UPDATENOTIFICATIONS_SUCCESS]: updatenotificationsSuccess,
  [AppTypes.UPDATENOTIFICATIONS_FAILURE]: updatenotificationsFailure,

  [AppTypes.FETCHCOMPANYVENDOR_REQUEST]: fetchcompanyvendorRequest,
  [AppTypes.FETCHCOMPANYVENDOR_SUCCESS]: fetchcompanyvendorSuccess,
  [AppTypes.FETCHCOMPANYVENDOR_FAILURE]: fetchcompanyvendorFailure,

  [AppTypes.POSTRECOVERYPASSWORD_REQUEST]: postrecoverypasswordRequest,
  [AppTypes.POSTRECOVERYPASSWORD_SUCCESS]: postrecoverypasswordSuccess,
  [AppTypes.POSTRECOVERYPASSWORD_FAILURE]: postrecoverypasswordFailure,

  [AppTypes.POSTMULTICOMPANYDATA_REQUEST]: postmulticompanydataRequest,
  [AppTypes.POSTMULTICOMPANYDATA_SUCCESS]: postmulticompanydataSuccess,
  [AppTypes.POSTMULTICOMPANYDATA_FAILURE]: postmulticompanydataFailure,

  [AppTypes.GETALLAUTHORS_REQUEST]: getallauthorsRequest,
  [AppTypes.GETALLAUTHORS_SUCCESS]: getallauthorsSuccess,
  [AppTypes.GETALLAUTHORS_FAILURE]: getallauthorsFailure,

  [AppTypes.POSTSAVEAUTHOR_REQUEST]: postsaveauthorRequest,
  [AppTypes.POSTSAVEAUTHOR_SUCCESS]: postsaveauthorSuccess,
  [AppTypes.POSTSAVEAUTHOR_FAILURE]: postsaveauthorFailure,

  [AppTypes.POSTSAVEBUSINESSAUTHOR_REQUEST]: postsavebusinessauthorRequest,
  [AppTypes.POSTSAVEBUSINESSAUTHOR_SUCCESS]: postsavebusinessauthorSuccess,
  [AppTypes.POSTSAVEBUSINESSAUTHOR_FAILURE]: postsavebusinessauthorFailure,

  [AppTypes.POSTDELETEAUTHOR_REQUEST]: postdeleteauthorRequest,
  [AppTypes.POSTDELETEAUTHOR_SUCCESS]: postdeleteauthorSuccess,
  [AppTypes.POSTDELETEAUTHOR_FAILURE]: postdeleteauthorFailure,

  [AppTypes.GETCOMMUNITYUSERS_REQUEST]: getcommunityusersRequest,
  [AppTypes.GETCOMMUNITYUSERS_SUCCESS]: getcommunityusersSuccess,
  [AppTypes.GETCOMMUNITYUSERS_FAILURE]: getcommunityusersFailure,

  [AppTypes.MODAL_REQUEST]: modalRequest,
  [AppTypes.ADVANCEDSEARCH_REQUEST]: advancedsearchRequest,
  [AppTypes.LOCATIONS_REQUEST]: locationsRequest,
  [AppTypes.GLOBALFILTER_REQUEST]: globalfilterRequest,
  [AppTypes.SELECTPROJECT_REQUEST]: selectprojectRequest,

  [AppTypes.CLEAR_REQUEST]: clearRequest,
})
