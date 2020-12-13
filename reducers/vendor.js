import { createReducer } from 'reduxsauce'
import { produce } from 'immer'
import { find, findIndex, propEq } from 'ramda'
import { VenTypes } from '~/actions/vendor'
import { InitialGlobalSearchResult } from '~/services/config'
import { removeStatus } from '~/services/util'

const initialBlogPosts = {
  appends: {
    blog_categories: [],
    blog_id: [],
    categories: [],
    order: 'id',
    per_page: 10,
    sort: 'DESC',
  },
  posts: {
    data: [],
    current_page: 0,
    last_page: 0,
    per_page: 10,
    from: 0,
    to: 0,
    total: 0,
  },
}

const initialState = {
  status: [],
  categories: {
    all: [],
    popular: [],
  },
  companies: [],
  vendorCompanies: [],
  vendorCompaniesAlphabet: [],
  vendorAwards: [],
  recentProducts: {
    data: [],
    from: 1,
    last_page: 1,
    page: 1,
    per_page: 5,
    to: 1,
    total: 0,
  },
  popularProducts: {
    data: [],
    from: 1,
    last_page: 1,
    page: 1,
    per_page: 5,
    to: 1,
    total: 0,
  },
  blogPosts: initialBlogPosts,
  globalSearchResult: InitialGlobalSearchResult,
}

const getcategoriesRequest = produce((draft, action) => {
  draft.status.push('pending-vgc')
})
const getcategoriesSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vgc', draft.status)
  draft.categories = action.response
})
const getcategoriesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vgc', draft.status)
})

const getcategorypopularproductsRequest = produce((draft, action) => {
  draft.status.push('pending-vgg')
})
const getcategorypopularproductsSuccess = produce((draft, action) => {
  const { category_id, data } = action.response
  const idx = findIndex(propEq('id', category_id), draft.categories.all)
  if (idx > -1) {
    draft.categories.all[idx].popular = data
  }
  draft.status = removeStatus('pending-vgg', draft.status)
})
const getcategorypopularproductsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vgg', draft.status)
})

const getcategoryproductsRequest = produce((draft, action) => {
  draft.status.push('pending-vgp')
})
const getcategoryproductsSuccess = produce((draft, action) => {
  const { categoryId, data } = action.response
  const idx = findIndex(propEq('id', categoryId), draft.categories.all)
  if (idx > -1) {
    draft.categories.all[idx].products = data
  }
  draft.status = removeStatus('pending-vgp', draft.status)
})
const getcategoryproductsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vgp', draft.status)
})

const getvendorcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-vgv')
})
const getvendorcompanySuccess = produce((draft, action) => {
  const { id } = action.response
  const idx = findIndex(propEq('id', id), draft.companies)
  if (idx > -1) {
    draft.companies[idx] = { ...draft.companies[idx], ...action.response }
  } else {
    draft.companies.push(action.response)
  }
  draft.status = removeStatus('pending-vgv', draft.status)
})
const getvendorcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vgv', draft.status)
})

const getcompanyadminsRequest = produce((draft, action) => {
  draft.status.push('pending-vca')
})
const getcompanyadminsSuccess = produce((draft, action) => {
  const { companyId, admins } = action.response
  const idx = findIndex(propEq('id', Number(companyId)), draft.companies)
  if (idx > -1) {
    draft.companies[idx].admins = admins
  }
  draft.status = removeStatus('pending-vca', draft.status)
})
const getcompanyadminsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vca', draft.status)
})

const getvendorcompaniesRequest = produce((draft, action) => {
  draft.status.push('pending-mgo')
})
const getvendorcompaniesSuccess = produce((draft, action) => {
  const { sort, data } = action.response
  if (sort === 'alphabet') {
    draft.vendorCompaniesAlphabet = data
  } else {
    draft.vendorCompanies = data
  }
  draft.status = removeStatus('pending-mgo', draft.status)
})
const getvendorcompaniesFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgo', draft.status)
})

const savevendorratingRequest = produce((draft, action) => {
  draft.status.push('pending-msv')
})
const savevendorratingSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-msv', draft.status)
})
const savevendorratingFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-msv', draft.status)
})

const getvendorawardsRequest = produce((draft, action) => {
  draft.status.push('pending-mva')
})
const getvendorawardsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mva', draft.status)
  draft.vendorAwards = action.response.awards
})
const getvendorawardsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mva', draft.status)
})

const getrecentlyupdatedproductsRequest = produce((draft, action) => {
  draft.status.push('pending-mru')
})
const getrecentlyupdatedproductsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mru', draft.status)
  draft.recentProducts = action.response
})
const getrecentlyupdatedproductsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mru', draft.status)
})

const getpopularproductsRequest = produce((draft, action) => {
  draft.status.push('pending-mpd')
})
const getpopularproductsSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mpd', draft.status)
  draft.popularProducts = action.response
})
const getpopularproductsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mpd', draft.status)
})

const globalsearchRequest = produce((draft, action) => {
  draft.status.push('pending-mgs')
})
const globalsearchSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-mgs', draft.status)
  draft.globalSearchResult = {
    ...draft.globalSearchResult,
    ...action.response,
  }
})
const globalsearchFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-mgs', draft.status)
})

const savevrproductRequest = produce((draft, action) => {
  draft.status.push('pending-vsp')
})
const savevrproductSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vsp', draft.status)
})
const savevrproductFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vsp', draft.status)
})

const savevrcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-vsc')
})
const savevrcompanySuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vsc', draft.status)
})
const savevrcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vsc', draft.status)
})

const savevrphotoRequest = produce((draft, action) => {
  draft.status.push('pending-vph')
})
const savevrphotoSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vph', draft.status)
})
const savevrphotoFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vph', draft.status)
})

const getvrcompanyRequest = produce((draft, action) => {
  draft.status.push('pending-vvc')
})
const getvrcompanySuccess = produce((draft, action) => {
  const { id } = action.response
  const idx = findIndex(propEq('id', id), draft.companies)
  if (idx > -1) {
    draft.companies[idx].products = action.response.products
    draft.companies[idx].ratings_breakdown = action.response.ratings_breakdown
    draft.companies[idx].ratings_by_job = action.response.ratings_by_job
    draft.companies[idx].stats = action.response.stats
  } else {
    draft.companies.push(action.response)
  }
  draft.status = removeStatus('pending-vvc', draft.status)
})
const getvrcompanyFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vvc', draft.status)
})

const postvrcompanyadminRequest = produce((draft, action) => {
  draft.status.push('pending-vpc')
})
const postvrcompanyadminSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vpc', draft.status)
})
const postvrcompanyadminFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vpc', draft.status)
})

const postblogadminRequest = produce((draft, action) => {
  draft.status.push('pending-vba')
})
const postblogadminSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vba', draft.status)
})
const postblogadminFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vba', draft.status)
})

const getblogRequest = produce((draft, action) => {
  draft.status.push('pending-vbr')
})
const getblogSuccess = produce((draft, action) => {
  const { id, blog } = action.response
  const idx = findIndex(propEq('id', id), draft.companies)
  if (idx > -1) {
    draft.companies[idx] = { ...draft.companies[idx], blog }
  }
  draft.status = removeStatus('pending-vbr', draft.status)
})
const getblogFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vbr', draft.status)
})

const saveblogRequest = produce((draft, action) => {
  draft.status.push('pending-vpb')
})
const saveblogSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vpb', draft.status)
})
const saveblogFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vpb', draft.status)
})

const getblogpostsRequest = produce((draft, action) => {
  draft.blogPosts = initialBlogPosts
  draft.status.push('pending-vbp')
})
const getblogpostsSuccess = produce((draft, action) => {
  draft.blogPosts = action.response
  draft.status = removeStatus('pending-vbp', draft.status)
})
const getblogpostsFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vbp', draft.status)
})

const saveblogpostRequest = produce((draft, action) => {
  draft.status.push('pending-vsb')
})
const saveblogpostSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vsb', draft.status)
})
const saveblogpostFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vsb', draft.status)
})

const deleteblogpostRequest = produce((draft, action) => {
  draft.status.push('pending-vdp')
})
const deleteblogpostSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vdp', draft.status)
})
const deleteblogpostFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vdp', draft.status)
})

const postadduserRequest = produce((draft, action) => {
  draft.status.push('pending-vpa')
})
const postadduserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vpa', draft.status)
})
const postadduserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vpa', draft.status)
})

const postremoveuserRequest = produce((draft, action) => {
  draft.status.push('pending-vru')
})
const postremoveuserSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vru', draft.status)
})
const postremoveuserFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vru', draft.status)
})

const postsaveproductRequest = produce((draft, action) => {
  draft.status.push('pending-vps')
})
const postsaveproductSuccess = produce((draft, action) => {
  const product = action.response.product
  draft.status = removeStatus('pending-vps', draft.status)
  const cId = findIndex(propEq('id', product.parent_id), draft.companies)
  if (cId > -1) {
    const pId = findIndex(propEq('id', product.id), draft.companies[cId].products)
    draft.companies[cId].products[pId] = {
      ...draft.companies[cId].products[pId],
      ...product,
    }
  }
})
const postsaveproductFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vps', draft.status)
})

const postsaveproductmediaRequest = produce((draft, action) => {
  draft.status.push('pending-vmp')
})
const postsaveproductmediaSuccess = produce((draft, action) => {
  draft.status = removeStatus('pending-vmp', draft.status)
})
const postsaveproductmediaFailure = produce((draft, action) => {
  draft.status = removeStatus('pending-vmp', draft.status)
})

const clearRequest = produce((draft, action) => (draft = initialState))

export const reducer = createReducer(initialState, {
  [VenTypes.GETCATEGORIES_REQUEST]: getcategoriesRequest,
  [VenTypes.GETCATEGORIES_FAILURE]: getcategoriesFailure,
  [VenTypes.GETCATEGORIES_SUCCESS]: getcategoriesSuccess,

  [VenTypes.GETCATEGORYPOPULARPRODUCTS_REQUEST]: getcategorypopularproductsRequest,
  [VenTypes.GETCATEGORYPOPULARPRODUCTS_FAILURE]: getcategorypopularproductsFailure,
  [VenTypes.GETCATEGORYPOPULARPRODUCTS_SUCCESS]: getcategorypopularproductsSuccess,

  [VenTypes.GETCATEGORYPRODUCTS_REQUEST]: getcategoryproductsRequest,
  [VenTypes.GETCATEGORYPRODUCTS_FAILURE]: getcategoryproductsFailure,
  [VenTypes.GETCATEGORYPRODUCTS_SUCCESS]: getcategoryproductsSuccess,

  [VenTypes.GETVENDORCOMPANY_REQUEST]: getvendorcompanyRequest,
  [VenTypes.GETVENDORCOMPANY_SUCCESS]: getvendorcompanySuccess,
  [VenTypes.GETVENDORCOMPANY_FAILURE]: getvendorcompanyFailure,

  [VenTypes.GETCOMPANYADMINS_REQUEST]: getcompanyadminsRequest,
  [VenTypes.GETCOMPANYADMINS_SUCCESS]: getcompanyadminsSuccess,
  [VenTypes.GETCOMPANYADMINS_FAILURE]: getcompanyadminsFailure,

  [VenTypes.GETVENDORCOMPANIES_REQUEST]: getvendorcompaniesRequest,
  [VenTypes.GETVENDORCOMPANIES_SUCCESS]: getvendorcompaniesSuccess,
  [VenTypes.GETVENDORCOMPANIES_FAILURE]: getvendorcompaniesFailure,

  [VenTypes.SAVEVENDORRATING_REQUEST]: savevendorratingRequest,
  [VenTypes.SAVEVENDORRATING_SUCCESS]: savevendorratingSuccess,
  [VenTypes.SAVEVENDORRATING_FAILURE]: savevendorratingFailure,

  [VenTypes.GETVENDORAWARDS_REQUEST]: getvendorawardsRequest,
  [VenTypes.GETVENDORAWARDS_SUCCESS]: getvendorawardsSuccess,
  [VenTypes.GETVENDORAWARDS_FAILURE]: getvendorawardsFailure,

  [VenTypes.GETRECENTLYUPDATEDPRODUCTS_REQUEST]: getrecentlyupdatedproductsRequest,
  [VenTypes.GETRECENTLYUPDATEDPRODUCTS_SUCCESS]: getrecentlyupdatedproductsSuccess,
  [VenTypes.GETRECENTLYUPDATEDPRODUCTS_FAILURE]: getrecentlyupdatedproductsFailure,

  [VenTypes.GETPOPULARPRODUCTS_REQUEST]: getpopularproductsRequest,
  [VenTypes.GETPOPULARPRODUCTS_SUCCESS]: getpopularproductsSuccess,
  [VenTypes.GETPOPULARPRODUCTS_FAILURE]: getpopularproductsFailure,

  [VenTypes.GLOBALSEARCH_REQUEST]: globalsearchRequest,
  [VenTypes.GLOBALSEARCH_SUCCESS]: globalsearchSuccess,
  [VenTypes.GLOBALSEARCH_FAILURE]: globalsearchFailure,

  [VenTypes.SAVEVRPRODUCT_REQUEST]: savevrproductRequest,
  [VenTypes.SAVEVRPRODUCT_SUCCESS]: savevrproductSuccess,
  [VenTypes.SAVEVRPRODUCT_FAILURE]: savevrproductFailure,

  [VenTypes.SAVEVRCOMPANY_REQUEST]: savevrcompanyRequest,
  [VenTypes.SAVEVRCOMPANY_SUCCESS]: savevrcompanySuccess,
  [VenTypes.SAVEVRCOMPANY_FAILURE]: savevrcompanyFailure,

  [VenTypes.SAVEVRPHOTO_REQUEST]: savevrphotoRequest,
  [VenTypes.SAVEVRPHOTO_SUCCESS]: savevrphotoSuccess,
  [VenTypes.SAVEVRPHOTO_FAILURE]: savevrphotoFailure,

  [VenTypes.GETVRCOMPANY_REQUEST]: getvrcompanyRequest,
  [VenTypes.GETVRCOMPANY_SUCCESS]: getvrcompanySuccess,
  [VenTypes.GETVRCOMPANY_FAILURE]: getvrcompanyFailure,

  [VenTypes.POSTVRCOMPANYADMIN_REQUEST]: postvrcompanyadminRequest,
  [VenTypes.POSTVRCOMPANYADMIN_SUCCESS]: postvrcompanyadminSuccess,
  [VenTypes.POSTVRCOMPANYADMIN_FAILURE]: postvrcompanyadminFailure,

  [VenTypes.POSTBLOGADMIN_REQUEST]: postblogadminRequest,
  [VenTypes.POSTBLOGADMIN_SUCCESS]: postblogadminSuccess,
  [VenTypes.POSTBLOGADMIN_FAILURE]: postblogadminFailure,

  [VenTypes.GETBLOG_REQUEST]: getblogRequest,
  [VenTypes.GETBLOG_SUCCESS]: getblogSuccess,
  [VenTypes.GETBLOG_FAILURE]: getblogFailure,

  [VenTypes.SAVEBLOG_REQUEST]: saveblogRequest,
  [VenTypes.SAVEBLOG_SUCCESS]: saveblogSuccess,
  [VenTypes.SAVEBLOG_FAILURE]: saveblogFailure,

  [VenTypes.GETBLOGPOSTS_REQUEST]: getblogpostsRequest,
  [VenTypes.GETBLOGPOSTS_SUCCESS]: getblogpostsSuccess,
  [VenTypes.GETBLOGPOSTS_FAILURE]: getblogpostsFailure,

  [VenTypes.SAVEBLOGPOST_REQUEST]: saveblogpostRequest,
  [VenTypes.SAVEBLOGPOST_SUCCESS]: saveblogpostSuccess,
  [VenTypes.SAVEBLOGPOST_FAILURE]: saveblogpostFailure,

  [VenTypes.DELETEBLOGPOST_REQUEST]: deleteblogpostRequest,
  [VenTypes.DELETEBLOGPOST_SUCCESS]: deleteblogpostSuccess,
  [VenTypes.DELETEBLOGPOST_FAILURE]: deleteblogpostFailure,

  [VenTypes.POSTADDUSER_REQUEST]: postadduserRequest,
  [VenTypes.POSTADDUSER_SUCCESS]: postadduserSuccess,
  [VenTypes.POSTADDUSER_FAILURE]: postadduserFailure,

  [VenTypes.POSTREMOVEUSER_REQUEST]: postremoveuserRequest,
  [VenTypes.POSTREMOVEUSER_SUCCESS]: postremoveuserSuccess,
  [VenTypes.POSTREMOVEUSER_FAILURE]: postremoveuserFailure,

  [VenTypes.POSTSAVEPRODUCT_REQUEST]: postsaveproductRequest,
  [VenTypes.POSTSAVEPRODUCT_SUCCESS]: postsaveproductSuccess,
  [VenTypes.POSTSAVEPRODUCT_FAILURE]: postsaveproductFailure,

  [VenTypes.POSTSAVEPRODUCTMEDIA_REQUEST]: postsaveproductmediaRequest,
  [VenTypes.POSTSAVEPRODUCTMEDIA_SUCCESS]: postsaveproductmediaSuccess,
  [VenTypes.POSTSAVEPRODUCTMEDIA_FAILURE]: postsaveproductmediaFailure,

  [VenTypes.CLEAR_REQUEST]: clearRequest,
})
