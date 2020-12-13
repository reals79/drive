import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  loginRequest: ['payload', 'route', 'after'],
  loginSuccess: ['response'],
  loginFailure: null,

  logoutRequest: ['payload'],
  logoutSuccess: null,
  logoutFailure: null,

  getuserconnectionsRequest: null,
  getuserconnectionsSuccess: ['response'],
  getuserconnectionsFailure: null,

  getauthorsRequest: null,
  getauthorsSuccess: ['response'],
  getauthorsFailure: null,

  libraryfiltersRequest: ['payload'],
  libraryfiltersSuccess: ['response'],
  libraryfiltersFailure: null,

  uploadRequest: ['payload'],
  uploadSuccess: ['response'],
  uploadFailure: null,

  globalcompaniesRequest: null,
  globalcompaniesSuccess: ['response'],
  globalcompaniesFailure: null,

  postcompanyemployeesRequest: ['payload'],
  postcompanyemployeesSuccess: ['response'],
  postcompanyemployeesFailure: null,

  getcompanyRequest: ['companyId'],
  getcompanySuccess: ['response'],
  getcompanyFailure: null,

  posteditprofileRequest: ['userId', 'payload'],
  posteditprofileSuccess: ['response'],
  posteditprofileFailure: null,

  postuploadavatarRequest: ['payload'],
  postuploadavatarSuccess: ['response'],
  postuploadavatarFailure: null,

  postcompanyusersRequest: ['payload', 'companyId', 'after'],
  postcompanyusersSuccess: ['response'],
  postcompanyusersFailure: null,

  // Bell Notifications
  fetchnotificationsRequest: ['page'],
  fetchnotificationsSuccess: ['response'],
  fetchnotificationsFailure: null,

  updatenotificationsRequest: ['id', 'event', 'after', 'route'],
  updatenotificationsSuccess: ['response'],
  updatenotificationsFailure: null,

  fetchcompanyvendorRequest: ['vendorId'],
  fetchcompanyvendorSuccess: ['response'],
  fetchcompanyvendorFailure: null,

  postrecoverypasswordRequest: ['payload'],
  postrecoverypasswordSuccess: ['response'],
  postrecoverypasswordFailure: null,

  postmulticompanydataRequest: ['payload'],
  postmulticompanydataSuccess: ['response'],
  postmulticompanydataFailure: null,

  getallauthorsRequest: ['payload'],
  getallauthorsSuccess: ['response'],
  getallauthorsFailure: null,

  postsaveauthorRequest: ['payload', 'callback'],
  postsaveauthorSuccess: ['response'],
  postsaveauthorFailure: null,

  postsavebusinessauthorRequest: ['payload', 'callback'],
  postsavebusinessauthorSuccess: ['response'],
  postsavebusinessauthorFailure: null,

  postdeleteauthorRequest: ['payload', 'callback'],
  postdeleteauthorSuccess: ['response'],
  postdeleteauthorFailure: null,

  getcommunityusersRequest: ['payload'],
  getcommunityusersSuccess: ['response'],
  getcommunityusersFailure: null,

  modalRequest: ['payload'],
  advancedsearchRequest: ['tags', 'mode', 'published'],
  locationsRequest: ['payload'],
  globalfilterRequest: ['companies', 'employees'],
  selectprojectRequest: ['id'],

  // Clear all caches
  clearRequest: null,
})

export const AppTypes = Types
export default Creators
