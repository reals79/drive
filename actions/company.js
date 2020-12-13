import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  getbusinessRequest: ['payload', 'route'],
  getbusinessSuccess: ['response'],
  getbusinessFailure: null,

  postbusinessRequest: ['payload'],
  postbusinessSuccess: ['response'],
  postbusinessFailure: null,

  getbzcompanyRequest: ['payload'],
  getbzcompanySuccess: ['response'],
  getbzcompanyFailure: null,

  getbusinessblogRequest: ['payload'],
  getbusinessblogSuccess: ['response'],
  getbusinessblogFailure: null,

  savebzcompanyRequest: ['payload', 'callback'],
  savebzcompanySuccess: ['response'],
  savebzcompanyFailure: null,

  savebusinessRequest: ['payload'],
  savebusinessSuccess: ['response'],
  savebusinessFailure: null,

  getblogcategoriesRequest: null,
  getblogcategoriesSuccess: ['response'],
  getblogcategoriesFailure: null,

  gettopiccategoriesRequest: null,
  gettopiccategoriesSuccess: ['response'],
  gettopiccategoriesFailure: null,

  getcompanyusersRequest: ['payload'],
  getcompanyusersSuccess: ['response'],
  getcompanyusersFailure: null,

  postregisterbusinessuserRequest: ['companyId', 'payload'],
  postregisterbusinessuserSuccess: ['response'],
  postregisterbusinessuserFailure: null,

  postaddeditdepartmentsRequest: ['companyId', 'payload', 'callback'],
  postaddeditdepartmentsSuccess: ['response'],
  postaddeditdepartmentsFailure: null,

  postaddeditteamsRequest: ['companyId', 'payload'],
  postaddeditteamsSuccess: ['response'],
  postaddeditteamsFailure: null,

  postsavejobrolesRequest: ['companyId', 'payload'],
  postsavejobrolesSuccess: ['response'],
  postsavejobrolesFailure: null,

  postsavehcmcompanyRequest: ['payload'],
  postsavehcmcompanySuccess: ['response'],
  postsavehcmcompanyFailure: null,

  getcompanyemployeesRequest: ['companyId'],
  getcompanyemployeesSuccess: ['response'],
  getcompanyemployeesFailure: null,

  setbzcompanyRequest: ['company'],
  // Clear all caches
  clearRequest: null,
})

export const CompanyTypes = Types
export default Creators
