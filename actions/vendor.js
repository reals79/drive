import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  // Get Vendor Categories
  getcategoriesRequest: ['payload'],
  getcategoriesSuccess: ['response'],
  getcategoriesFailure: null,

  // GET Vendor Category Popular Products
  getcategorypopularproductsRequest: ['payload'],
  getcategorypopularproductsSuccess: ['response'],
  getcategorypopularproductsFailure: null,

  // Get Category Products
  getcategoryproductsRequest: ['payload'],
  getcategoryproductsSuccess: ['response'],
  getcategoryproductsFailure: null,

  // Save Vendor Rating
  savevendorratingRequest: ['payload'],
  savevendorratingSuccess: ['response'],
  savevendorratingFailure: null,

  getvendorcompanyRequest: ['payload'],
  getvendorcompanySuccess: ['response'],
  getvendorcompanyFailure: null,

  // Get VR company detail
  getcompanyadminsRequest: ['payload'],
  getcompanyadminsSuccess: ['response'],
  getcompanyadminsFailure: null,

  // Get Vendor Companies
  getvendorcompaniesRequest: ['payload'],
  getvendorcompaniesSuccess: ['response'],
  getvendorcompaniesFailure: null,

  // GET Vendor Awards
  getvendorawardsRequest: ['payload'],
  getvendorawardsSuccess: ['response'],
  getvendorawardsFailure: null,

  getrecentlyupdatedproductsRequest: ['payload'],
  getrecentlyupdatedproductsSuccess: ['response'],
  getrecentlyupdatedproductsFailure: null,

  getpopularproductsRequest: null,
  getpopularproductsSuccess: ['response'],
  getpopularproductsFailure: null,

  globalsearchRequest: ['payload'],
  globalsearchSuccess: ['response'],
  globalsearchFailure: null,

  savevrproductRequest: ['payload'],
  savevrproductSuccess: ['response'],
  savevrproductFailure: null,

  savevrcompanyRequest: ['payload', 'callback'],
  savevrcompanySuccess: ['response'],
  savevrcompanyFailure: null,

  savevrphotoRequest: ['payload'],
  savevrphotoSuccess: ['response'],
  savevrphotoFailure: null,

  getvrcompanyRequest: ['companyId', 'dateStart', 'dateEnd'],
  getvrcompanySuccess: ['response'],
  getvrcompanyFailure: null,

  // Post VR company admin
  postvrcompanyadminRequest: ['payload'],
  postvrcompanyadminSuccess: ['response'],
  postvrcompanyadminFailure: null,

  // Post Blog admin
  postblogadminRequest: ['payload'],
  postblogadminSuccess: ['response'],
  postblogadminFailure: null,

  getblogRequest: ['companyId'],
  getblogSuccess: ['response'],
  getblogFailure: null,

  saveblogRequest: ['payload'],
  saveblogSuccess: ['response'],
  saveblogFailure: null,

  getblogpostsRequest: ['payload'],
  getblogpostsSuccess: ['response'],
  getblogpostsFailure: null,

  saveblogpostRequest: ['payload'],
  saveblogpostSuccess: ['response'],
  saveblogpostFailure: null,

  deleteblogpostRequest: ['payload'],
  deleteblogpostSuccess: ['response'],
  deleteblogpostFailure: null,

  postadduserRequest: ['payload'],
  postadduserSuccess: ['response'],
  postadduserFailure: null,

  postremoveuserRequest: ['payload'],
  postremoveuserSuccess: ['response'],
  postremoveuserFailure: null,

  postsaveproductRequest: ['payload', 'callback', 'after'],
  postsaveproductSuccess: ['response'],
  postsaveproductFailure: null,

  postsaveproductmediaRequest: ['payload', 'media', 'after'],
  postsaveproductmediaSuccess: ['response'],
  postsaveproductmediaFailure: null,

  // Clear all caches
  clearRequest: null,
})

export const VenTypes = Types
export default Creators
