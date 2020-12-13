import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  postcreateblogRequest: ['payload'],
  postcreateblogSuccess: ['response'],
  postcreateblogFailure: null,

  addforumtopicRequest: ['payload'],
  addforumtopicSuccess: ['response'],
  addforumtopicFailure: null,

  getforumindividualtopicRequest: ['payload', 'route'],
  getforumindividualtopicSuccess: ['response'],
  getforumindividualtopicFailure: null,

  addtopiccommentRequest: ['payload'],
  addtopiccommentSuccess: ['response'],
  addtopiccommentFailure: null,

  editforumtopicRequest: ['payload'],
  editforumtopicSuccess: ['response'],
  editforumtopicFailure: null,

  getblogsummaryRequest: ['payload'],
  getblogsummarySuccess: ['response'],
  getblogsummaryFailure: null,

  getblogdetailsRequest: ['payload'],
  getblogdetailsSuccess: ['response'],
  getblogdetailsFailure: null,

  getcommunityblogRequest: ['payload'],
  getcommunityblogSuccess: ['response'],
  getcommunityblogFailure: null,

  getcommunityuserRequest: ['payload'],
  getcommunityuserSuccess: ['response'],
  getcommunityuserFailure: null,

  postcommunityuserRequest: ['payload'],
  postcommunityuserSuccess: ['response'],
  postcommunityuserFailure: null,

  getcommunityconnectionsRequest: ['payload'],
  getcommunityconnectionsSuccess: ['response'],
  getcommunityconnectionsFailure: null,

  postcommunityconnectRequest: ['payload'],
  postcommunityconnectSuccess: ['response'],
  postcommunityconnectFailure: null,

  getuserpermissionsRequest: ['payload'],
  getuserpermissionsSuccess: ['response'],
  getuserpermissionsFailure: null,

  postpasswordchangeRequest: ['payload'],
  postpasswordchangeSuccess: null,
  postpasswordchangeFailure: null,

  postunfollowRequest: ['payload'],
  postunfollowSuccess: ['response'],
  postunfollowFailure: null,

  postconnectionupdateRequest: ['payload'],
  postconnectionupdateSuccess: ['response'],
  postconnectionupdateFailure: null,

  postregisteruserRequest: ['payload', 'route', 'after'],
  postregisteruserSuccess: null,
  postregisteruserFailure: null,

  gettopicsRequest: ['payload'],
  gettopicsSuccess: ['categoryId', 'response'],
  gettopicsFailure: null,

  getcomblogpostsRequest: ['payload'],
  getcomblogpostsSuccess: ['response'],
  getcomblogpostsFailure: null,

  geteditfeatureditemsRequest: ['mode'],
  geteditfeatureditemsSuccess: ['response'],
  geteditfeatureditemsFailure: null,

  getfeatureditemsRequest: null,
  getfeatureditemsSuccess: ['response'],
  getfeatureditemsFailure: null,

  getcategorysponsoredproductsRequest: ['categoryId'],
  getcategorysponsoredproductsSuccess: ['id', 'response'],
  getcategorysponsoredproductsFailure: null,

  postsavecommentRequest: ['payload', 'userId'],
  postsavecommentSuccess: ['response'],
  postsavecommentFailure: null,

  // Clear all caches
  clearRequest: null,
})

export const CommunityTypes = Types
export default Creators
