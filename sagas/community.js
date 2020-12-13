import { call, put, select } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import queryString from 'query-string'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import { history } from '~/reducers'

export function* addforumtopicRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postForumTopic(payload)
    if (response.ok) {
      const responseForum = yield api.getForumRecentTopic(1, 10)
      yield call(history.push, '/community/forums')
      yield put(CommunityActions.addforumtopicSuccess(responseForum))
    } else {
      yield put(CommunityActions.addforumtopicFailure())
    }
  } catch (e) {
    yield put(CommunityActions.addforumtopicFailure())
  }
}

export function* postcreateblogRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postCreateBlog(payload)
    if (response.ok) {
      yield put(AppActions.modalRequest({ type: '', data: { before: {}, after: {} }, callBack: null }))
      yield put(CommunityActions.postcreateblogSuccess())
    } else {
      yield put(CommunityActions.postcreateblogFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postcreateblogFailure())
  }
}

export function* getforumindividualtopicRequest(api, action) {
  try {
    const { payload, route } = action
    const options = queryString.stringify(payload)
    const response = yield api.getGetTopics(options)
    if (response.ok) {
      yield put(CommunityActions.getforumindividualtopicSuccess(response.data))
      if (route) yield call(history.push, route)
    } else {
      yield put(CommunityActions.getforumindividualtopicFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getforumindividualtopicFailure())
  }
}

export function* addtopiccommentRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postSaveComment(payload)
    if (response.ok) {
      yield put(CommunityActions.addtopiccommentSuccess(response.data))
    } else {
      yield put(CommunityActions.addtopiccommentFailure())
    }
  } catch (e) {
    yield put(CommunityActions.addtopiccommentFailure())
  }
}

export function* editforumtopicRequest(api, action) {
  try {
    const {
      payload: { data, pagination },
    } = action
    const response = yield api.postSaveComment(data)
    if (response.ok) {
      const responseForum = yield api.getForumRecentTopic(pagination.page, pagination.perPage)
      yield put(CommunityActions.editforumtopicSuccess(responseForum))
    } else {
      yield put(CommunityActions.editforumtopicFailure())
    }
  } catch (e) {
    yield put(CommunityActions.editforumtopicFailure())
  }
}

export function* postsavecommentRequest(api, action) {
  try {
    const { payload, userId } = action
    const response = yield api.postSaveComment(payload)
    if (response.ok) {
      yield put(CommunityActions.postsavecommentSuccess(response.data))
      if (userId) yield put(CommunityActions.getcommunityblogRequest({ userId }))
    } else {
      yield put(CommunityActions.postsavecommentFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postsavecommentFailure())
  }
}

export function* getcommunityblogRequest(api, action) {
  try {
    const { userId } = action.payload
    const response = yield api.getCommunityBlog(userId)
    if (response.ok) {
      yield put(CommunityActions.getcommunityblogSuccess({ ...response.data, user_id: userId }))
    } else {
      yield put(CommunityActions.getcommunityblogFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getcommunityblogFailure())
  }
}

export function* getcommunityuserRequest(api, action) {
  try {
    const { userId, callback, route, after, type = 'me' } = action.payload
    const options = `user_id=${userId}`
    const response = type === 'me' ? yield api.getcommunityUser(userId) : yield api.getCommunityUserView(userId)
    const resBlog = yield api.getBlogSummary(options)
    if (response.ok) {
      const { full_user, user } = response.data
      const data = {
        ...resBlog.data,
        entity: {
          ...resBlog.data?.entity,
          user: { ...full_user, ...user },
        },
        user_id: userId,
      }
      yield put(CommunityActions.getcommunityuserSuccess(data))

      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback()
      if (resBlog.ok && resBlog.data?.has_blog) {
        const token = yield select(state => state.app.token)
        const auth = token && token !== ''
        const resBlogPosts = auth
          ? yield api.getBlogDetail(resBlog.data?.blog?.id)
          : yield api.getBlogPosts(`blog_id=${resBlog.data?.blog?.id}`)
        if (resBlogPosts.ok) {
          const userData = auth
            ? {
                ...data,
                admins: resBlogPosts.data?.admins,
                appends: resBlogPosts.data?.appends,
                blog: resBlogPosts.data?.blog,
                can_edit_blog: resBlogPosts.data?.can_edit_blog,
                drafts: resBlogPosts.data?.drafts,
                has_blog: resBlogPosts.data?.has_blog,
                posts: resBlogPosts.data?.posts,
              }
            : {
                ...data,
                posts: resBlogPosts.data?.posts,
              }
          yield put(CommunityActions.getcommunityuserSuccess(userData))
        }
      }
    } else {
      yield put(CommunityActions.getcommunityuserFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getcommunityuserFailure())
  }
}

export function* getblogsummaryRequest(api, action) {
  try {
    const { userId, callback, route, after } = action.payload
    const options = `user_id=${userId}`
    const response = yield api.getBlogSummary(options)
    if (response.ok) {
      const data = {
        ...response.data,
        user_id: userId,
      }
      yield put(CommunityActions.getblogsummarySuccess(data))
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback()
    } else {
      yield put(CommunityActions.getblogsummaryFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getblogsummaryFailure())
  }
}

export function* getblogdetailsRequest(api, action) {
  try {
    const { userId, blogId, page = 1, categoryId, blogCategory, search, callback, route, after } = action.payload
    let options = `page=${page}&`
    options = search ? `${options}search=${search}&` : options
    options = categoryId ? `${options}category_id[]=${categoryId}&` : options
    options = blogCategory ? `${options}blog_category[]=${blogCategory}` : options
    const response = yield api.getBlogDetail(blogId, options)
    if (response.ok) {
      const data = {
        user_id: userId,
        admins: response.data?.admins,
        appends: response.data?.appends,
        blog: response.data?.blog,
        can_edit_blog: response.data?.can_edit_blog,
        drafts: response.data?.drafts,
        has_blog: response.data?.has_blog,
        posts: response.data?.posts,
        title: response.data?.title,
      }
      yield put(CommunityActions.getblogdetailsSuccess(data))
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback()
    } else {
      yield put(CommunityActions.getblogdetailsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getblogdetailsFailure())
  }
}

export function* getcommunityconnectionsRequest(api, action) {
  try {
    const { userId } = action.payload
    const options = `user_id=${userId}`
    const response = yield api.getConnections(options)
    if (response.ok) {
      yield put(CommunityActions.getcommunityconnectionsSuccess({ userId, connections: response.data }))
    } else {
      yield put(CommunityActions.getcommunityconnectionsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getcommunityconnectionsFailure())
  }
}

export function* postcommunityconnectRequest(api, action) {
  try {
    const { data, callback, route, after } = action.payload
    const response = yield api.postConnectRequest(data)
    if (response.ok) {
      yield put(CommunityActions.postcommunityconnectSuccess())
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      if (callback) yield callback()
    } else {
      yield put(CommunityActions.postcommunityconnectFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postcommunityconnectFailure())
  }
}

export function* getuserpermissionsRequest(api, action) {
  try {
    const { userId } = action.payload
    const response = yield api.getUserPermissions(userId)
    if (response.ok) {
      yield put(CommunityActions.getuserpermissionsSuccess({ userId, permissions: response.data }))
    } else {
      yield put(CommunityActions.getuserpermissionsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getuserpermissionsFailure())
  }
}

export function* postcommunityuserRequest(api, action) {
  const { data, callback, route, after } = action.payload
  const response = yield api.postCommunityUser(data)

  if (response.ok) {
    if (after) yield put({ ...after })
    if (route) yield call(history.push, route)
    if (callback) yield callback()
    yield put(CommunityActions.postcommunityuserSuccess())
  } else {
    yield put(CommunityActions.postcommunityuserFailure())
  }
}

export function* postpasswordchangeRequest(api, action) {
  try {
    const { verfiyPassword, userId, changePassword } = action.payload
    const response = yield api.postCheckPassword(verfiyPassword)

    if (response.ok && response.data.status === 'success') {
      yield put(AppActions.posteditprofileRequest(userId, changePassword))
      toast.success('Your Password has be updated Successfully', {
        position: toast.POSITION.CENTRE_RIGHT,
      })
      yield put(CommunityActions.postpasswordchangeSuccess())
    } else {
      toast.error('Oops, Your current password is incorrect! ', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(CommunityActions.postpasswordchangeFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postpasswordchangeFailure())
  }
}

export function* postunfollowRequest(api, action) {
  try {
    const { data, after } = action.payload
    const response = yield api.postUnfollowRequest(data)
    if (response.ok && response.data.status === 'success') {
      if (after) yield put({ ...after })
      yield put(CommunityActions.postunfollowSuccess())
    } else {
      yield put(CommunityActions.postunfollowFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postunfollowFailure())
  }
}

export function* postconnectionupdateRequest(api, action) {
  try {
    const { data, after } = action.payload
    const response = yield api.postConnectionUpdate(data)
    if (response.ok) {
      if (after) yield put({ ...after })
      yield put(CommunityActions.postconnectionupdateSuccess())
    } else {
      yield put(CommunityActions.postconnectionupdateFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postconnectionupdateFailure())
  }
}

export function* postregisteruserRequest(api, action) {
  try {
    const { payload, route, after } = action
    const response = yield api.postRegisterUser(payload)

    if (response.ok) {
      yield put(
        AppActions.loginRequest({ email: payload.email, password: payload.password, rememberMe: true }, route, after)
      )
      yield put(CommunityActions.postregisteruserSuccess())
    } else {
      toast.error(`Oops, ${response.data.message} `, {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(
        AppActions.modalRequest({
          type: '',
          data: { before: null, after: null },
          callBack: null,
        })
      )
      yield put(CommunityActions.postregisteruserFailure())
    }
  } catch (e) {
    yield put(CommunityActions.postregisteruserFailure())
  }
}

export function* gettopicsRequest(api, action) {
  try {
    const { payload } = action
    const options = queryString.stringify(payload)
    const response = yield api.getGetTopics(options)
    if (response.ok) {
      yield put(CommunityActions.gettopicsSuccess(payload.category_id, response.data))
    } else {
      yield put(CommunityActions.gettopicsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.gettopicsFailure())
  }
}

export function* getcomblogpostsRequest(api, action) {
  try {
    const { payload } = action
    const options = queryString.stringify(payload)
    const response = yield api.getBlogPosts(options)

    if (response.ok) {
      yield put(CommunityActions.getcomblogpostsSuccess(response.data))
    } else {
      yield put(CommunityActions.getcomblogpostsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getcomblogpostsFailure())
  }
}

export function* geteditfeatureditemsRequest(api, action) {
  try {
    const response = yield api.getEditFeaturedItems()

    if (response.ok) {
      yield put(CommunityActions.geteditfeatureditemsSuccess(response.data.featured))
    } else {
      yield put(CommunityActions.geteditfeatureditemsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.geteditfeatureditemsFailure())
  }
}

export function* getfeatureditemsRequest(api, action) {
  try {
    const response = yield api.getFeaturedItems()
    if (response.ok) {
      yield put(CommunityActions.getfeatureditemsSuccess(response.data.featured))
    } else {
      yield put(CommunityActions.getfeatureditemsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getfeatureditemsFailure())
  }
}

export function* getcategorysponsoredproductsRequest(api, action) {
  try {
    const { categoryId } = action
    const response = yield api.getCategorySponsoredProducts(categoryId)

    if (response.ok) {
      yield put(CommunityActions.getcategorysponsoredproductsSuccess(categoryId, response.data.data))
    } else {
      yield put(CommunityActions.getcategorysponsoredproductsFailure())
    }
  } catch (e) {
    yield put(CommunityActions.getcategorysponsoredproductsFailure())
  }
}
