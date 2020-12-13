import { put, call, select } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import xmljs from 'xml-js'
import queryString from 'query-string'
import { filter, isEmpty, isNil, propEq } from 'ramda'
import AppActions from '~/actions/app'
import VenActions from '~/actions/vendor'
import { history } from '~/reducers'
import { InitialGlobalSearchResult } from '~/services/config'

// fetch vendor categories
export function* getcategoriesRequest(api, action) {
  try {
    const isCategory = action?.payload?.isCategory
    const response = yield api.getVendorCategories()

    if (response.ok) {
      yield put(VenActions.getcategoriesSuccess(response.data))
      if (!isCategory) {
        for (const category of response.data.all) {
          yield put(VenActions.getcategorypopularproductsRequest({ category_id: category.id }))
        }
      }
    } else {
      yield put(VenActions.getcategoriesFailure())
    }
  } catch (e) {
    yield put(VenActions.getcategoriesFailure())
  }
}

export function* getcategorypopularproductsRequest(api, action) {
  try {
    const { category_id } = action.payload
    const response = yield api.getCategoryPopularProducts(category_id)

    if (response.ok) {
      yield put(VenActions.getcategorypopularproductsSuccess({ category_id, data: response.data }))
    } else {
      yield put(VenActions.getcategorypopularproductsFailure())
    }
  } catch (e) {
    yield put(VenActions.getcategorypopularproductsFailure())
  }
}

/**
 * fetch vender category products
 * @param {*} payload { categoryId, perPage, sort, order, and etc }
 */
export function* getcategoryproductsRequest(api, action) {
  try {
    const { categoryId, payload, after, route, callback } = action.payload
    const options = queryString.stringify(payload)

    const response = yield api.getCategoryProducts(categoryId, options)
    if (response.ok) {
      yield put(VenActions.getcategoryproductsSuccess({ categoryId, data: response.data }))
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback(response.data)
    } else {
      yield put(VenActions.getcategoryproductsFailure())
    }
  } catch (e) {
    yield put(VenActions.getcategoryproductsFailure())
  }
}

/**
 * Get company detail
 * @param {*} payload { companyId, businessId, page, perPage, route, after }
 */
export function* getvendorcompanyRequest(api, action) {
  try {
    const { companyId, businessId, type, page, perPage, route, after } = action.payload
    const token = yield select(state => state.app.token)
    const isAuth = token && token !== ''

    let options = businessId ? `id=${businessId}` : ''
    options = page ? `${options}&page=${page}` : options
    options = perPage ? `${options}&per_page=${perPage}` : options

    const response =
      type === 'hcm'
        ? yield api.getCompany(companyId)
        : isAuth
        ? yield api.getVRCompany(companyId)
        : yield api.getGetCompany(companyId)
    const resBusiness = yield api.getCompanyBusiness(options)
    const resBlogs = yield api.getBlogPosts(`company_id=${companyId}`)
    const resBlog = isAuth ? yield api.getGetBlog('company', companyId) : {}

    if (response.ok) {
      let company = {}
      if (type === 'hcm') {
        company = {
          ...response.data,
          business: resBusiness.ok ? resBusiness.data : {},
          blogs: resBlogs.data?.posts?.data || [],
          blog: resBlog.ok ? resBlog.data : {},
        }
      } else {
        company = {
          ...response.data.company,
          admins: response.data.admins,
          business: resBusiness.ok ? resBusiness.data : {},
          blogs: resBlogs.data?.posts?.data || [],
          blog: resBlog.ok ? resBlog.data : {},
        }
      }
      yield put(VenActions.getvendorcompanySuccess(company))
      if (route && !isEmpty(route)) yield call(history.push, route)
      if (after) yield put({ ...after })
    } else {
      yield put(VenActions.getvendorcompanyFailure())
    }
  } catch (e) {
    yield put(VenActions.getvendorcompanyFailure())
  }
}

export function* getcompanyadminsRequest(api, action) {
  try {
    const { companyId, type } = action.payload

    if (type === 'vr') {
      const response = yield api.getVRCompany(companyId)
      if (response.ok) {
        const { admins } = response.data
        yield put(VenActions.getcompanyadminsSuccess({ companyId, admins }))
      } else {
        yield put(VenActions.getcompanyadminsFailure())
      }
    } else if (type === 'hcm') {
      const response = yield api.getCompanyUsers(companyId, 5000)
      if (response.ok) {
        const admins = filter(propEq('app_role_id', 2), response.data)
        yield put(VenActions.getcompanyadminsSuccess({ companyId, admins }))
      } else {
        yield put(VenActions.getcompanyadminsFailure())
      }
    }
  } catch (e) {
    yield put(VenActions.getcompanyadminsFailure())
  }
}

/**
 * Get vendor companies
 * @param {*} payload { sort, letter, search }
 * @param {string} sort
 * @param {string} letter
 * @param {*} query { letter, search, page, per_page }
 */
export function* getvendorcompaniesRequest(api, action) {
  try {
    const { sort, payload, route, after, callback } = action.payload
    const queryOptions = queryString.stringify(payload)
    const options = sort ? `${sort}?${queryOptions}` : queryOptions

    const res =
      sort === 'alphabet' ? yield api.getVendorCompaniesAlphabet(options) : yield api.getVendorCompanies(options)
    if (res.ok) {
      yield put(VenActions.getvendorcompaniesSuccess({ sort, data: res.data }))
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback()
    } else {
      yield put(VenActions.getvendorcompaniesFailure())
    }
  } catch (e) {
    yield put(VenActions.getvendorcompaniesFailure())
  }
}

/**
 * Save Vendor Rating
 * @param {*} payload { product_id, summary, pros, cons, phone, likely, star_rating, product_name }
 */
export function* savevendorratingRequest(api, action) {
  try {
    const response = yield api.postSaveVendorRating(action.payload)
    if (response.ok) {
      toast.success(
        `Thanks for rating ${action.payload.product_name}. Once verified we will publish it. Please expect a call from our verification team.`,
        {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        }
      )
      yield put(VenActions.savevendorratingSuccess())
      yield put(
        AppActions.modalRequest({
          type: '',
          data: { before: null, after: null },
          callBack: null,
        })
      )
    } else {
      toast.error(`Oops, Your action cannot be completed!. Please try later`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.savevendorratingFailure())
    }
  } catch (e) {
    yield put(VenActions.savevendorratingFailure())
  }
}

export function* getvendorawardsRequest(api, action) {
  try {
    const response = yield api.getVendorAwards()

    if (response.ok) {
      yield put(VenActions.getvendorawardsSuccess(response.data))
    } else {
      yield put(VenActions.getvendorawardsFailure())
    }
  } catch (e) {
    yield put(VenActions.getvendorawardsFailure())
  }
}

export function* getrecentlyupdatedproductsRequest(api, action) {
  try {
    const response = yield api.getRecentlyUpdatedProducts()

    if (response.ok) {
      yield put(VenActions.getrecentlyupdatedproductsSuccess(response.data))
    } else {
      yield put(VenActions.getrecentlyupdatedproductsFailure())
    }
  } catch (e) {
    yield put(VenActions.getrecentlyupdatedproductsFailure())
  }
}

export function* getpopularproductsRequest(api, action) {
  const response = yield api.getPopularProducts()

  if (response.ok) {
    yield put(VenActions.getpopularproductsSuccess(response.data))
  } else {
    yield put(VenActions.getpopularproductsFailure())
  }
}

/**
 * Global Search
 * @param {*} payload { data, route, after }
 * @param {*} data { search: "drive", how_to_search: "exact" }
 * @param {*} route
 * @param {*} after
 */
export function* globalsearchRequest(api, action) {
  try {
    const { data, route, after } = action.payload
    if (!data.search || data.search === '') {
      yield put(VenActions.globalsearchSuccess(InitialGlobalSearchResult))
    } else {
      const response = yield api.postGlobalSearch(data)
      if (response.ok) {
        yield put(VenActions.globalsearchSuccess(response.data))
        if (after) yield put({ ...after })
        if (route) yield call(history.push, route)
      } else {
        yield put(VenActions.globalsearchFailure())
      }
    }
  } catch (e) {
    yield put(VenActions.globalsearchFailure())
  }
}

export function* savevrproductRequest(api, action) {
  const { data, companyData, route, after } = action.payload
  try {
    let parent = {}
    if (companyData) {
      const compRes = yield api.postSaveVRCompany(companyData)
      if (compRes.ok) {
        parent = compRes.data.company
      } else {
        toast.error(`Sorry, the company cannot be saved!. Please try later`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        yield put(VenActions.savevrproductFailure())
        return
      }
    }

    const productData = { product: { ...data.product, parent_id: parent.id } }
    const response = yield api.postSaveProduct(companyData ? productData : data)
    if (response.ok) {
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      yield put(VenActions.savevrproductSuccess(response.data))
    } else {
      yield put(VenActions.savevrproductFailure())
    }
  } catch (e) {
    yield put(VenActions.savevrproductFailure())
  }
}

export function* savevrcompanyRequest(api, action) {
  try {
    const { payload, callback } = action
    const { data, image, type, route, after } = payload
    if (image) {
      const resImage = yield api.postSaveVRPhoto(image)
    }
    const response = type === 'hcm' ? yield api.postDevRecordsCompany(data) : yield api.postSaveVRCompany(data)
    if (response.ok) {
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      yield put(VenActions.savevrcompanySuccess(response.data.company))
      if (callback) yield callback()
    } else {
      yield put(VenActions.savevrcompanyFailure())
    }
  } catch (e) {
    yield put(VenActions.savevrcompanyFailure())
  }
}

export function* savevrphotoRequest(api, action) {
  const { data, callback, route, after } = action.payload
  const response = yield api.postSaveVRPhoto(data)
  if (response.ok) {
    if (after) yield put({ ...after })
    if (route) yield call(history.push, route)
    if (callback) yield callback(response.data.path)
    yield put(VenActions.savevrphotoSuccess())
  } else {
    yield put(VenActions.savevrphotoFailure())
  }
}

export function* getvrcompanyRequest(api, action) {
  try {
    const { companyId, dateStart, dateEnd } = action
    const response = yield api.getGetCompanyWithDate(companyId, dateStart, dateEnd)
    if (response.ok) {
      yield put(VenActions.getvrcompanySuccess(response.data.company))
    } else {
      yield put(VenActions.getvrcompanyFailure())
    }
  } catch (e) {
    yield put(VenActions.getvrcompanyFailure())
  }
}

export function* postvrcompanyadminRequest(api, action) {
  try {
    const { mode, data, after } = action.payload
    const response = yield api.postVRCompanyAdmin(mode, data)
    if (response.ok) {
      if (after) yield put({ ...after })
      toast.success(`Successfully ${mode === 'add' ? 'added' : 'removed from'} the admins.`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.postvrcompanyadminSuccess())
    } else {
      toast.error(`Add admin failed.\n Please try it later!`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.postvrcompanyadminFailure())
    }
  } catch (e) {
    yield put(VenActions.postvrcompanyadminFailure())
  }
}

export function* postblogadminRequest(api, action) {
  try {
    const { mode, data, after } = action.payload
    const response = yield api.postBlogCompanyAdmin(mode, data)
    if (response.ok) {
      if (after) yield put({ ...after })
      toast.success(`Successfully ${mode === 'add' ? 'added' : 'removed from'} the admins.`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.postblogadminSuccess())
    } else {
      toast.error(`Add admin failed.\n Please try it later!`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.postblogadminFailure())
    }
  } catch (e) {
    yield put(VenActions.postblogadminFailure())
  }
}

export function* getblogRequest(api, action) {
  try {
    const { companyId } = action
    const response = yield api.getGetBlog('company', companyId)
    if (response.ok) {
      yield put(VenActions.getblogSuccess({ id: companyId, blog: response.data }))
    } else {
      yield put(VenActions.getblogFailure())
    }
  } catch (e) {
    yield put(VenActions.getblogFailure())
  }
}

export function* saveblogRequest(api, action) {
  try {
    const { data, route, after, blog } = action.payload

    let payload = { ...data }
    if (blog) {
      const res = yield api.postCreateBlog(blog)
      if (res.ok) {
        payload = {
          ...data,
          blog: {
            ...data.blog,
            id: res.data?.blog?.id,
            entity_id: res.data?.entity?.id,
            group_id: res.data?.entity?.group_id,
          },
        }
      } else {
        toast.error(`Oops, Your action cannot be completed because you don't have permission to create a blog`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        yield put(VenActions.saveblogFailure())
        return
      }
    }

    const response = yield api.postSaveBlog(payload)
    if (response.ok) {
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      toast.success(`Your action was completed successfully.`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.saveblogSuccess())
      yield put(AppActions.modalRequest({ type: '', data: { before: {}, after: {} }, callBack: null }))
    } else {
      toast.error(`Oops, Your action cannot be completed. Please retry later!`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(VenActions.saveblogFailure())
    }
  } catch (e) {
    yield put(VenActions.saveblogFailure())
  }
}

export function* getblogpostsRequest(api, action) {
  try {
    const { payload } = action
    const options = queryString.stringify(payload)

    const response = yield api.getBlogPosts(options)
    if (response.ok) {
      yield put(VenActions.getblogpostsSuccess(response.data))
    } else {
      yield put(VenActions.getblogpostsFailure())
    }
  } catch (e) {
    yield put(VenActions.getblogpostsFailure())
  }
}

export function* saveblogpostRequest(api, action) {
  const { data, route, after } = action.payload
  try {
    const response = yield api.postSaveBlogPost(data)

    if (response.ok) {
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      yield put(VenActions.saveblogpostSuccess())
    } else {
      yield put(VenActions.saveblogpostFailure())
    }
  } catch (e) {
    yield put(VenActions.saveblogpostFailure())
  }
}

export function* deleteblogpostRequest(api, action) {
  const { data, route, after, callback } = action.payload
  try {
    const response = yield api.postDeleteBlogPost(data)
    if (response.ok) {
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback()
      yield put(VenActions.deleteblogpostSuccess())
    } else {
      yield put(VenActions.deleteblogpostFailure())
    }
  } catch (e) {
    yield put(VenActions.deleteblogpostFailure())
  }
}

export function* postadduserRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postAddUser(payload)
    if (response.ok) {
      yield put(VenActions.postadduserSuccess(response.data))
    } else {
      yield put(VenActions.postadduserFailure())
    }
  } catch (e) {
    yield put(VenActions.postadduserFailure())
  }
}

export function* postremoveuserRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postRemoveUser(payload)
    if (response.ok) {
      yield put(VenActions.postremoveuserSuccess(response.data))
    } else {
      yield put(VenActions.postremoveuserFailure())
    }
  } catch (e) {
    yield put(VenActions.postremoveuserFailure())
  }
}

export function* postsaveproductRequest(api, action) {
  try {
    const { payload, callback, after } = action
    const response = yield api.postSaveProduct(payload)

    if (response.ok) {
      if (!isEmpty(after) && !isNil(after)) yield put({ ...after })
      yield put(VenActions.postsaveproductSuccess(response.data))
      yield callback()
    } else {
      yield put(VenActions.postsaveproductFailure())
    }
  } catch (e) {
    yield put(VenActions.postsaveproductFailure())
  }
}

export function* postsaveproductmediaRequest(api, action) {
  try {
    const { payload, media, after } = action

    if (payload.type === 'video') {
      const res = yield api.getCommunityS3Info()
      const resKey = yield api.getGenerateHash()
      if (res.ok) {
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', payload.video.type)
        formData.append('key', `content/${resKey.data}/${payload.video.name}`)
        formData.append('file', payload.video)
        const _response = yield api.postUploadfile(res.data.url, formData)

        if (_response.ok) {
          const data = xmljs.xml2json(_response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text
          delete payload.video
          payload.video_url = url

          const response = yield api.postSaveProductMedia(payload)

          if (response.ok) {
            if (media) yield api.deleteProductMedia(media)
            if (after) yield put({ ...after })
            yield put(VenActions.postsaveproductmediaSuccess(response.data))
          } else {
            yield put(VenActions.postsaveproductmediaFailure())
          }
        }
      }
    } else {
      const response = yield api.postSaveProductMedia(payload)
      if (response.ok) {
        if (media) yield api.deleteProductMedia(media)
        if (after) yield put({ ...after })
        yield put(VenActions.postsaveproductmediaSuccess(response.data))
      } else {
        yield put(VenActions.postsaveproductmediaFailure())
      }
    }
  } catch (e) {
    yield put(VenActions.postsaveproductmediaFailure())
  }
}
