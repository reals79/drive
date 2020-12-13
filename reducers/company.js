import { createReducer } from 'reduxsauce'
import { produce } from 'immer'
import { concat, findIndex, propEq } from 'ramda'
import { CompanyTypes } from '~/actions/company'
import { removeStatus } from '~/services/util'

const initialState = {
  status: [],
  business: [],
  employees: {},
  businessCompany: {},
  blogCategories: [],
  topicCategories: [],
  companyUsers: [],
}

const getbusinessRequest = produce((draft, action) => {
  draft.status.push('pending-cbs')
})
const getbusinessSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cbs', draft.status)
  const business = action.response[0]
  const idx = findIndex(propEq('id', business.id), draft.business)
  if (idx > -1) {
    draft.business[idx] = business
  } else {
    draft.business = concat(draft.business, action.response)
  }
})
const getbusinessFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cbs', draft.status)
})

const postbusinessRequest = produce((draft, action) => {
  draft.status.push('pending-cpb')
})
const postbusinessSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cpb', draft.status)
})
const postbusinessFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cpb', draft.status)
})

const getbusinessblogRequest = produce((draft, action) => {
  draft.status.push('pending-cbb')
})
const getbusinessblogSuccess = produce((draft, action) => {
  const { businessId, data } = action.response
  const idx = findIndex(propEq('id', businessId), draft.business)
  if (idx > -1) {
    draft.business[idx] = {
      ...draft.business[idx],
      vrs: { ...draft.business[idx]?.vrs, blog: { ...draft.business[idx]?.vrs?.blog, data } },
    }
  }
  draft.status = removeStatus('pending-cbb', draft.status)
})
const getbusinessblogFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cbb', draft.status)
})

const getbzcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-cgc')
})
const getbzcompanySuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cgc', draft.status)
  draft.businessCompany = action.response
})
const getbzcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cgc', draft.status)
})

const savebzcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-csb')
})
const savebzcompanySuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-csb', draft.status)
  draft.business = concat(draft.business, [action.response])
})
const savebzcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-csb', draft.status)
})

const savebusinessRequest = produce((draft, action) => {
  draft.status.push('pending-cscb')
})
const savebusinessSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cscb', draft.status)
  draft.businessCompany = action.response
})
const savebusinessFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cscb', draft.status)
})

const getblogcategoriesRequest = produce((draft, action) => {
  draft.status.push('pending-cbc')
})
const getblogcategoriesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cbc', draft.status)
  draft.blogCategories = action.response
})
const getblogcategoriesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cbc', draft.status)
})

const gettopiccategoriesRequest = produce((draft, action) => {
  draft.status.push('pending-ctc')
})
const gettopiccategoriesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-ctc', draft.status)
  draft.topicCategories = action.response
})
const gettopiccategoriesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ctc', draft.status)
})

const getcompanyusersRequest = produce((draft, action) => {
  draft.status.push('pending-cuc')
})
const getcompanyusersSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cuc', draft.status)
  draft.companyUsers = action.response
})
const getcompanyusersFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cuc', draft.status)
})

const postregisterbusinessuserRequest = produce((draft, action) => {
  draft.status.push('pending-cru')
})
const postregisterbusinessuserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cru', draft.status)
})
const postregisterbusinessuserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cru', draft.status)
})

const postaddeditdepartmentsRequest = produce((draft, action) => {
  draft.status.push('pending-cad')
})
const postaddeditdepartmentsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cad', draft.status)
})
const postaddeditdepartmentsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cad', draft.status)
})

const postaddeditteamsRequest = produce((draft, action) => {
  draft.status.push('pending-cet')
})
const postaddeditteamsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cet', draft.status)
})
const postaddeditteamsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cet', draft.status)
})

const postsavejobrolesRequest = produce((draft, action) => {
  draft.status.push('pending-csj')
})
const postsavejobrolesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cej', draft.status)
})
const postsavejobrolesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cej', draft.status)
})

const postsavehcmcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-csh')
})
const postsavehcmcompanySuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-csh', draft.status)
})
const postsavehcmcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-csh', draft.status)
})

const getcompanyemployeesRequest = produce((draft, action) => {
  draft.status.push('pending-cce')
})
const getcompanyemployeesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cce', draft.status)
  const { response: employees } = action
  draft.employees[employees[0].company_id] = employees
})
const getcompanyemployeesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cce', draft.status)
})

const setbzcompanyRequest = produce((draft, action) => {
  draft.businessCompany = action.company
})
const clearRequest = produce((draft, action) => (draft = initialState))

export const reducer = createReducer(initialState, {
  [CompanyTypes.GETBUSINESS_REQUEST]: getbusinessRequest,
  [CompanyTypes.GETBUSINESS_SUCCESS]: getbusinessSuccess,
  [CompanyTypes.GETBUSINESS_FAILURE]: getbusinessFailure,

  [CompanyTypes.POSTBUSINESS_REQUEST]: postbusinessRequest,
  [CompanyTypes.POSTBUSINESS_SUCCESS]: postbusinessSuccess,
  [CompanyTypes.POSTBUSINESS_FAILURE]: postbusinessFailure,

  [CompanyTypes.GETBUSINESSBLOG_REQUEST]: getbusinessblogRequest,
  [CompanyTypes.GETBUSINESSBLOG_SUCCESS]: getbusinessblogSuccess,
  [CompanyTypes.GETBUSINESSBLOG_FAILURE]: getbusinessblogFailure,

  [CompanyTypes.GETBZCOMPANY_REQUEST]: getbzcompanyRequest,
  [CompanyTypes.GETBZCOMPANY_SUCCESS]: getbzcompanySuccess,
  [CompanyTypes.GETBZCOMPANY_FAILURE]: getbzcompanyFailure,

  [CompanyTypes.SAVEBZCOMPANY_REQUEST]: savebzcompanyRequest,
  [CompanyTypes.SAVEBZCOMPANY_SUCCESS]: savebzcompanySuccess,
  [CompanyTypes.SAVEBZCOMPANY_FAILURE]: savebzcompanyFailure,

  [CompanyTypes.SAVEBUSINESS_REQUEST]: savebusinessRequest,
  [CompanyTypes.SAVEBUSINESS_SUCCESS]: savebusinessSuccess,
  [CompanyTypes.SAVEBUSINESS_FAILURE]: savebusinessFailure,

  [CompanyTypes.GETBLOGCATEGORIES_REQUEST]: getblogcategoriesRequest,
  [CompanyTypes.GETBLOGCATEGORIES_SUCCESS]: getblogcategoriesSuccess,
  [CompanyTypes.GETBLOGCATEGORIES_FAILURE]: getblogcategoriesFailure,

  [CompanyTypes.GETTOPICCATEGORIES_REQUEST]: gettopiccategoriesRequest,
  [CompanyTypes.GETTOPICCATEGORIES_SUCCESS]: gettopiccategoriesSuccess,
  [CompanyTypes.GETTOPICCATEGORIES_FAILURE]: gettopiccategoriesFailure,

  [CompanyTypes.GETCOMPANYUSERS_REQUEST]: getcompanyusersRequest,
  [CompanyTypes.GETCOMPANYUSERS_SUCCESS]: getcompanyusersSuccess,
  [CompanyTypes.GETCOMPANYUSERS_FAILURE]: getcompanyusersFailure,

  [CompanyTypes.POSTREGISTERBUSINESSUSER_REQUEST]: postregisterbusinessuserRequest,
  [CompanyTypes.POSTREGISTERBUSINESSUSER_SUCCESS]: postregisterbusinessuserSuccess,
  [CompanyTypes.POSTREGISTERBUSINESSUSER_FAILURE]: postregisterbusinessuserFailure,

  [CompanyTypes.POSTADDEDITDEPARTMENTS_REQUEST]: postaddeditdepartmentsRequest,
  [CompanyTypes.POSTADDEDITDEPARTMENTS_SUCCESS]: postaddeditdepartmentsSuccess,
  [CompanyTypes.POSTADDEDITDEPARTMENTS_FAILURE]: postaddeditdepartmentsFailure,

  [CompanyTypes.POSTADDEDITTEAMS_REQUEST]: postaddeditteamsRequest,
  [CompanyTypes.POSTADDEDITTEAMS_SUCCESS]: postaddeditteamsSuccess,
  [CompanyTypes.POSTADDEDITTEAMS_FAILURE]: postaddeditteamsFailure,

  [CompanyTypes.POSTSAVEJOBROLES_REQUEST]: postsavejobrolesRequest,
  [CompanyTypes.POSTSAVEJOBROLES_SUCCESS]: postsavejobrolesSuccess,
  [CompanyTypes.POSTSAVEJOBROLES_FAILURE]: postsavejobrolesFailure,

  [CompanyTypes.POSTSAVEHCMCOMPANY_REQUEST]: postsavehcmcompanyRequest,
  [CompanyTypes.POSTSAVEHCMCOMPANY_SUCCESS]: postsavehcmcompanySuccess,
  [CompanyTypes.POSTSAVEHCMCOMPANY_FAILURE]: postsavehcmcompanyFailure,

  [CompanyTypes.GETCOMPANYEMPLOYEES_REQUEST]: getcompanyemployeesRequest,
  [CompanyTypes.GETCOMPANYEMPLOYEES_SUCCESS]: getcompanyemployeesSuccess,
  [CompanyTypes.GETCOMPANYEMPLOYEES_FAILURE]: getcompanyemployeesFailure,

  [CompanyTypes.SETBZCOMPANY_REQUEST]: setbzcompanyRequest,
  [CompanyTypes.CLEAR_REQUEST]: clearRequest,
})
