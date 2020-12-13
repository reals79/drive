import { createReducer } from 'reduxsauce'
import { produce } from 'immer'
import { findIndex, propEq } from 'ramda'
import { CommunityTypes } from '~/actions/community'
import { removeStatus } from '~/services/util'

const initialState = {
  status: [],
  departments: [],
  individualTopic: {},
  topicComments: [],
  recentBlogs: {},
  communityBlogs: [],
  permissions: [],
  uploaded: {},
  topics: {},
  featuredItems: [],
  featuredProducts: {},
}

const postcreateblogRequest = produce((draft, action) => {
  draft.status.push('pending-fcb')
})
const postcreateblogSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-fcb', draft.status)
})
const postcreateblogFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-fcb', draft.status)
})

const addforumtopicRequest = produce((draft, action) => {
  draft.status.push('pending-aft')
})
const addforumtopicSuccess = produce((draft, action) => {
  draft.forumRecentTopic = action.response.data
  draft.status = removeStatus('pending-aft', draft.status)
})
const addforumtopicFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-aft', draft.status)
})

const getforumindividualtopicRequest = produce((draft, action) => {
  draft.status.push('pending-cfd')
})
const getforumindividualtopicSuccess = produce((draft, action) => {
  draft.individualTopic = action.response
  draft.status = removeStatus('pending-cfd', draft.status)
})
const getforumindividualtopicFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cfd', draft.status)
})

const addtopiccommentRequest = produce((draft, action) => {
  draft.status.push('pending-ctc')
})
const addtopiccommentSuccess = produce((draft, action) => {
  draft.topicComments = action.response
  if (draft.topicComments?.comment[0]) {
    draft.individualTopic.topics.data[0].comments.push(draft.topicComments.comment[0])
  }
  draft.status = removeStatus('pending-ctc', draft.status)
})
const addtopiccommentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ctc', draft.status)
})

const editforumtopicRequest = produce((draft, action) => {
  draft.status.push('pending-cef')
})
const editforumtopicSuccess = produce((draft, action) => {
  draft.forumRecentTopic = action.response.data
  draft.status = removeStatus('pending-cef', draft.status)
})
const editforumtopicFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cef', draft.status)
})

const getcommunityblogRequest = produce((draft, action) => {
  draft.status.push('pending-ccb')
})
const getcommunityblogSuccess = produce((draft, action) => {
  const { user_id } = action.response
  const idx = findIndex(propEq('user_id', user_id), draft.communityBlogs)
  if (idx > -1) {
    draft.communityBlogs[idx] = { ...draft.communityBlogs[idx], ...action.response }
  } else {
    draft.communityBlogs.push(action.response)
  }
  draft.status = removeStatus('pending-ccb', draft.status)
})
const getcommunityblogFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ccb', draft.status)
})

const getcommunityuserRequest = produce((draft, action) => {
  draft.status.push('pending-ccu')
})
const getcommunityuserSuccess = produce((draft, action) => {
  const { user_id } = action.response
  const idx = findIndex(propEq('user_id', user_id), draft.communityBlogs)
  if (idx > -1) {
    draft.communityBlogs[idx] = { ...draft.communityBlogs[idx], ...action.response }
  } else {
    draft.communityBlogs.push(action.response)
  }
  draft.status = removeStatus('pending-ccu', draft.status)
})
const getcommunityuserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ccu', draft.status)
})

const getblogsummaryRequest = produce((draft, action) => {
  draft.status.push('pending-cbs')
})
const getblogsummarySuccess = produce((draft, action) => {
  const { user_id } = action.response
  const idx = findIndex(propEq('user_id', user_id), draft.communityBlogs)
  if (idx > -1) {
    draft.communityBlogs[idx] = { ...draft.communityBlogs[idx], ...action.response }
  } else {
    draft.communityBlogs.push(action.response)
  }
  draft.status = removeStatus('pending-cbs', draft.status)
})
const getblogsummaryFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cbs', draft.status)
})

const getblogdetailsRequest = produce((draft, action) => {
  draft.status.push('pending-cbd')
})
const getblogdetailsSuccess = produce((draft, action) => {
  const { user_id } = action.response
  const idx = findIndex(propEq('user_id', user_id), draft.communityBlogs)
  if (idx > -1) {
    draft.communityBlogs[idx] = { ...draft.communityBlogs[idx], ...action.response }
  } else {
    draft.communityBlogs.push(action.response)
  }
  draft.status = removeStatus('pending-cbd', draft.status)
})
const getblogdetailsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cbd', draft.status)
})

const postcommunityuserRequest = produce((draft, action) => {
  draft.status.push('pending-cpu')
})
const postcommunityuserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cpu', draft.status)
})
const postcommunityuserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cpu', draft.status)
})

const postpasswordchangeRequest = produce((draft, action) => {
  draft.status.push('pending-cpp')
})
const postpasswordchangeSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cpp', draft.status)
})
const postpasswordchangeFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cpp', draft.status)
})

const postregisteruserRequest = produce((draft, action) => {
  draft.status.push('pending-cru')
})
const postregisteruserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cru', draft.status)
})
const postregisteruserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cru', draft.status)
})

const postunfollowRequest = produce((draft, action) => {
  draft.status.push('pending-cuc')
})
const postunfollowSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cuc', draft.status)
})
const postunfollowFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cuc', draft.status)
})

const postconnectionupdateRequest = produce((draft, action) => {
  draft.status.push('pending-cac')
})
const postconnectionupdateSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cac', draft.status)
})
const postconnectionupdateFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cac', draft.status)
})

const getcommunityconnectionsRequest = produce((draft, action) => {
  draft.status.push('pending-ccc')
})
const getcommunityconnectionsSuccess = produce((draft, action) => {
  const { userId, connections } = action.response
  const idx = findIndex(propEq('user_id', userId), draft.communityBlogs)
  if (idx > -1) {
    draft.communityBlogs[idx] = { ...draft.communityBlogs[idx], connections }
  } else {
    draft.communityBlogs.push(action.response)
  }
  draft.status = removeStatus('pending-ccc', draft.status)
})
const getcommunityconnectionsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ccc', draft.status)
})

const postcommunityconnectRequest = produce((draft, action) => {
  draft.status.push('pending-cpc')
})
const postcommunityconnectSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cpc', draft.status)
})
const postcommunityconnectFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cpc', draft.status)
})

const getuserpermissionsRequest = produce((draft, action) => {
  draft.status.push('pending-cup')
})
const getuserpermissionsSuccess = produce((draft, action) => {
  const { userId, permissions } = action.response
  const idx = findIndex(propEq('user_id', userId), draft.permissions)
  if (idx > -1) {
    draft.permissions[idx] = { ...draft.permissions[idx], ...permissions, user_id: userId }
  } else {
    draft.permissions.push({ ...permissions, user_id: userId })
  }
  draft.status = removeStatus('pending-cup', draft.status)
})
const getuserpermissionsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cup', draft.status)
})

const gettopicsRequest = produce((draft, action) => {
  draft.status.push('pending-cgt')
})
const gettopicsSuccess = produce((draft, action) => {
  const { categoryId, response } = action
  draft.topics[categoryId] = response
  draft.status = removeStatus('pending-cgt', draft.status)
})
const gettopicsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cgt', draft.status)
})

const getcomblogpostsRequest = produce((draft, action) => {
  draft.status.push('pending-cbp')
})
const getcomblogpostsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cbp', draft.status)
  draft.recentBlogs = action.response
})
const getcomblogpostsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cbp', draft.status)
})

const geteditfeatureditemsRequest = produce((draft, action) => {
  draft.status.push('pending-ceft')
})
const geteditfeatureditemsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-ceft', draft.status)
  draft.featuredItems = action.response
})
const geteditfeatureditemsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ceft', draft.status)
})

const getfeatureditemsRequest = produce((draft, action) => {
  draft.status.push('pending-cft')
})
const getfeatureditemsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-cft', draft.status)
  draft.featuredItems = action.response
})
const getfeatureditemsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-cft', draft.status)
})

const getcategorysponsoredproductsRequest = produce((draft, action) => {
  draft.status.push('pending-ccp')
})
const getcategorysponsoredproductsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-ccp', draft.status)
  const { id, response } = action
  draft.featuredProducts[id] = response
})
const getcategorysponsoredproductsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-ccp', draft.status)
})

const postsavecommentRequest = produce((draft, action) => {
  draft.status.push('pending-csc')
})
const postsavecommentSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-csc', draft.status)
})
const postsavecommentFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-csc', draft.status)
})

const clearRequest = produce(draft => (draft = initialState))

export const reducer = createReducer(initialState, {
  [CommunityTypes.ADDFORUMTOPIC_REQUEST]: addforumtopicRequest,
  [CommunityTypes.ADDFORUMTOPIC_SUCCESS]: addforumtopicSuccess,
  [CommunityTypes.ADDFORUMTOPIC_FAILURE]: addforumtopicFailure,

  [CommunityTypes.POSTCREATEBLOG_REQUEST]: postcreateblogRequest,
  [CommunityTypes.POSTCREATEBLOG_SUCCESS]: postcreateblogSuccess,
  [CommunityTypes.POSTCREATEBLOG_FAILURE]: postcreateblogFailure,

  [CommunityTypes.GETFORUMINDIVIDUALTOPIC_REQUEST]: getforumindividualtopicRequest,
  [CommunityTypes.GETFORUMINDIVIDUALTOPIC_SUCCESS]: getforumindividualtopicSuccess,
  [CommunityTypes.GETFORUMINDIVIDUALTOPIC_FAILURE]: getforumindividualtopicFailure,

  [CommunityTypes.ADDTOPICCOMMENT_REQUEST]: addtopiccommentRequest,
  [CommunityTypes.ADDTOPICCOMMENT_SUCCESS]: addtopiccommentSuccess,
  [CommunityTypes.ADDTOPICCOMMENT_FAILURE]: addtopiccommentFailure,

  [CommunityTypes.EDITFORUMTOPIC_REQUEST]: editforumtopicRequest,
  [CommunityTypes.EDITFORUMTOPIC_SUCCESS]: editforumtopicSuccess,
  [CommunityTypes.EDITFORUMTOPIC_FAILURE]: editforumtopicFailure,

  [CommunityTypes.GETCOMMUNITYBLOG_REQUEST]: getcommunityblogRequest,
  [CommunityTypes.GETCOMMUNITYBLOG_SUCCESS]: getcommunityblogSuccess,
  [CommunityTypes.GETCOMMUNITYBLOG_FAILURE]: getcommunityblogFailure,

  [CommunityTypes.GETBLOGSUMMARY_REQUEST]: getblogsummaryRequest,
  [CommunityTypes.GETBLOGSUMMARY_SUCCESS]: getblogsummarySuccess,
  [CommunityTypes.GETBLOGSUMMARY_FAILURE]: getblogsummaryFailure,

  [CommunityTypes.GETBLOGDETAILS_REQUEST]: getblogdetailsRequest,
  [CommunityTypes.GETBLOGDETAILS_SUCCESS]: getblogdetailsSuccess,
  [CommunityTypes.GETBLOGDETAILS_FAILURE]: getblogdetailsFailure,

  [CommunityTypes.GETCOMMUNITYUSER_REQUEST]: getcommunityuserRequest,
  [CommunityTypes.GETCOMMUNITYUSER_SUCCESS]: getcommunityuserSuccess,
  [CommunityTypes.GETCOMMUNITYUSER_FAILURE]: getcommunityuserFailure,

  [CommunityTypes.POSTCOMMUNITYUSER_REQUEST]: postcommunityuserRequest,
  [CommunityTypes.POSTCOMMUNITYUSER_SUCCESS]: postcommunityuserSuccess,
  [CommunityTypes.POSTCOMMUNITYUSER_FAILURE]: postcommunityuserFailure,

  [CommunityTypes.POSTPASSWORDCHANGE_REQUEST]: postpasswordchangeRequest,
  [CommunityTypes.POSTPASSWORDCHANGE_SUCCESS]: postpasswordchangeSuccess,
  [CommunityTypes.POSTPASSWORDCHANGE_FAILURE]: postpasswordchangeFailure,

  [CommunityTypes.POSTREGISTERUSER_REQUEST]: postregisteruserRequest,
  [CommunityTypes.POSTREGISTERUSER_SUCCESS]: postregisteruserSuccess,
  [CommunityTypes.POSTREGISTERUSER_FAILURE]: postregisteruserFailure,

  [CommunityTypes.POSTUNFOLLOW_REQUEST]: postunfollowRequest,
  [CommunityTypes.POSTUNFOLLOW_SUCCESS]: postunfollowSuccess,
  [CommunityTypes.POSTUNFOLLOW_FAILURE]: postunfollowFailure,

  [CommunityTypes.POSTCONNECTIONUPDATE_REQUEST]: postconnectionupdateRequest,
  [CommunityTypes.POSTCONNECTIONUPDATE_SUCCESS]: postconnectionupdateSuccess,
  [CommunityTypes.POSTCONNECTIONUPDATE_FAILURE]: postconnectionupdateFailure,

  [CommunityTypes.GETCOMMUNITYCONNECTIONS_REQUEST]: getcommunityconnectionsRequest,
  [CommunityTypes.GETCOMMUNITYCONNECTIONS_SUCCESS]: getcommunityconnectionsSuccess,
  [CommunityTypes.GETCOMMUNITYCONNECTIONS_FAILURE]: getcommunityconnectionsFailure,

  [CommunityTypes.POSTCOMMUNITYCONNECT_REQUEST]: postcommunityconnectRequest,
  [CommunityTypes.POSTCOMMUNITYCONNECT_SUCCESS]: postcommunityconnectSuccess,
  [CommunityTypes.POSTCOMMUNITYCONNECT_FAILURE]: postcommunityconnectFailure,

  [CommunityTypes.GETUSERPERMISSIONS_REQUEST]: getuserpermissionsRequest,
  [CommunityTypes.GETUSERPERMISSIONS_SUCCESS]: getuserpermissionsSuccess,
  [CommunityTypes.GETUSERPERMISSIONS_FAILURE]: getuserpermissionsFailure,

  [CommunityTypes.GETTOPICS_REQUEST]: gettopicsRequest,
  [CommunityTypes.GETTOPICS_SUCCESS]: gettopicsSuccess,
  [CommunityTypes.GETTOPICS_FAILURE]: gettopicsFailure,

  [CommunityTypes.GETCOMBLOGPOSTS_REQUEST]: getcomblogpostsRequest,
  [CommunityTypes.GETCOMBLOGPOSTS_SUCCESS]: getcomblogpostsSuccess,
  [CommunityTypes.GETCOMBLOGPOSTS_FAILURE]: getcomblogpostsFailure,

  [CommunityTypes.GETEDITFEATUREDITEMS_REQUEST]: geteditfeatureditemsRequest,
  [CommunityTypes.GETEDITFEATUREDITEMS_SUCCESS]: geteditfeatureditemsSuccess,
  [CommunityTypes.GETEDITFEATUREDITEMS_FAILURE]: geteditfeatureditemsFailure,

  [CommunityTypes.GETFEATUREDITEMS_REQUEST]: getfeatureditemsRequest,
  [CommunityTypes.GETFEATUREDITEMS_SUCCESS]: getfeatureditemsSuccess,
  [CommunityTypes.GETFEATUREDITEMS_FAILURE]: getfeatureditemsFailure,

  [CommunityTypes.GETCATEGORYSPONSOREDPRODUCTS_REQUEST]: getcategorysponsoredproductsRequest,
  [CommunityTypes.GETCATEGORYSPONSOREDPRODUCTS_SUCCESS]: getcategorysponsoredproductsSuccess,
  [CommunityTypes.GETCATEGORYSPONSOREDPRODUCTS_FAILURE]: getcategorysponsoredproductsFailure,

  [CommunityTypes.POSTSAVECOMMENT_REQUEST]: postsavecommentRequest,
  [CommunityTypes.POSTSAVECOMMENT_SUCCESS]: postsavecommentSuccess,
  [CommunityTypes.POSTSAVECOMMENT_FAILURE]: postsavecommentFailure,

  [CommunityTypes.CLEAR_REQUEST]: clearRequest,
})
