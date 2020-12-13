import { call, put, select } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import { filter } from 'ramda'
import xmljs from 'xml-js'
import { history } from '~/reducers'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import CompanyActions from '~/actions/company'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import VendorActions from '~/actions/vendor'
import { UserRoles } from '~/services/config'

export function* loginRequest(api, action) {
  try {
    const { payload, route, after } = action
    const response = yield api.loginByEmail(payload)

    if (response.ok) {
      const { firebase, token, user } = response.data
      const companyIds = user.companies.map(item => item.id)
      const _cIds = user.primary_role_id === UserRoles.SUPER_ADMIN ? [user.company_info.id] : companyIds
      window.token = token

      yield put(AppActions.loginSuccess({ firebase, token, user }))
      // yield put(AppActions.postmulticompanydataRequest({ company_id: companyIds }))
      yield put(AppActions.getauthorsRequest())
      yield put(AppActions.postcompanyemployeesRequest({ company_id: _cIds }))
      yield put(AppActions.getcompanyRequest(user.company_info.id))
      yield put(AppActions.fetchnotificationsRequest())
      yield put(MngActions.fetchauthorsRequest(user.company_info.id))
      // yield put(MngActions.fetchcompanycareersRequest(user.company_info.id))
      yield put(AppActions.getcommunityusersRequest({ userId: user.community_user_id }))
      yield put(MngActions.selectusersRequest([user.id]))
      yield put(DevActions.careerdevreportsRequest(user.company_info.id, user.id))
      yield put(
        VendorActions.getcategoriesRequest({ isCategory: window.location.pathname !== '/vendor-ratings/by-category' })
      )
      // yield put(
      //   DevActions.teamreportsRequest(
      //     user.company_info.id,
      //     moment()
      //       .startOf('month')
      //       .format('YYYY-MM-DD'),
      //     moment()
      //       .endOf('month')
      //       .format('YYYY-MM-DD')
      //   )
      // )
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'tracks', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'courses', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'modules', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'careers', current: 1, per: 10 }))
      // yield put(
      //   DevActions.librarytemplatesRequest({
      //     filter: '',
      //     mode: 'certifications',
      //     current: 1,
      //     per: 10,
      //   })
      // )
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'badges', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'powerpoint', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'word', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'pdf', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'envelope', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'habits', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'habitslist', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'quotas', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'scorecards', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'assessment', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'survey', current: 1, per: 10 }))
      // yield put(DevActions.librarytemplatesRequest({ filter: '', mode: 'review', current: 1, per: 10 }))

      const { app_role_id } = user
      if (after) yield put({ ...after })
      if (route) {
        yield call(history.push, route)
      } else {
        if (app_role_id > UserRoles.MANAGER) {
          yield call(history.push, '/hcm/daily-plan')
        } else {
          yield call(history.push, '/hcm/tasks-projects')
        }
      }
    } else {
      toast.error('Oops, username or password is wrong!', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(AppActions.loginFailure())
    }
  } catch (e) {
    yield put(AppActions.loginFailure())
  }
}

export function* logoutRequest(api, action) {
  const { payload } = action
  yield put(AppActions.clearRequest())
  yield put(DevActions.clearRequest())
  yield put(MngActions.clearRequest())
  yield put(VendorActions.clearRequest())
  yield put(CommunityActions.clearRequest())
  yield put(CompanyActions.clearRequest())
  yield put(AppActions.logoutSuccess())
  yield call(history.push, '/hcm')
}

export function* getauthorsRequest(api) {
  const response = yield api.getUserAuthors()
  if (response.ok) {
    yield put(AppActions.getauthorsSuccess(response.data))
  } else {
    yield put(AppActions.getauthorsFailure())
  }
}

export function* getuserconnectionsRequest(api) {
  try {
    const communityUser = yield select(state => state.app.user.community_user)
    const response = yield api.getConnections(`user_id=${communityUser.id}`)
    if (response.ok) {
      yield put(AppActions.getuserconnectionsSuccess(response.data))
    } else {
      yield put(AppActions.getuserconnectionsFailure())
    }
  } catch (e) {
    yield put(AppActions.getuserconnectionsFailure())
  }
}

// Fetch Company Vendor
export function* fetchcompanyvendorRequest(api, action) {
  try {
    const { vendorId } = action
    const response = yield api.getCompanyVendor(vendorId)

    if (response.ok) {
      yield put(AppActions.fetchcompanyvendorSuccess(response.data))
    } else {
      yield put(AppActions.fetchcompanyvendorFailure())
    }
  } catch (e) {
    yield put(AppActions.fetchcompanyvendorFailure())
  }
}

// Library Filters
export function* libraryfiltersRequest(api) {
  const response = yield api.getLibraryFilters()
  if (response.ok) {
    yield put(AppActions.libraryfiltersSuccess(response.data))
  } else {
    yield put(AppActions.libraryfiltersFailure())
  }
}

// UPLOAD FILEs
export function* uploadRequest(api, action) {
  try {
    const { payload } = action
    const res = yield api.getS3Info()

    if (res.ok) {
      // eslint-disable-next-line no-undef
      const formData = new FormData()
      for (const key in res.data.inputs) {
        formData.append(key, res.data.inputs[key])
      }
      formData.set('Content-Type', payload.file.type)
      formData.append('key', `attachments/${payload.attachment_hash}/${payload.file.name}`)
      formData.append('file', payload.file)
      const response = yield api.fileUpload(formData)

      if (response.ok) {
        const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
        const url = {
          location: JSON.parse(data).PostResponse.Location._text,
          name: JSON.parse(data).PostResponse.Key._text,
        }
        yield put(AppActions.uploadSuccess(url))
        toast.info(`file uploaded successfully`, { position: toast.POSITION.TOP_CENTER })
      } else {
        yield put(AppActions.uploadFailure())
      }
    } else {
      yield put(AppActions.uploadFailure())
    }
  } catch (e) {
    yield put(AppActions.uploadFailure())
  }
}

export function* globalcompaniesRequest(api, action) {
  const response = yield api.getCompanies()

  if (response.ok) {
    yield put(AppActions.globalcompaniesSuccess(response.data))
  } else {
    yield put(AppActions.globalcompaniesFailure())
  }
}

export function* postcompanyemployeesRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postMultiCompanyEmployees(payload)

    if (response.ok) {
      yield put(AppActions.postcompanyemployeesSuccess(response.data))
    } else {
      yield put(AppActions.postcompanyemployeesFailure())
    }
  } catch (e) {
    yield put(AppActions.postcompanyemployeesFailure())
  }
}

export function* getcompanyRequest(api, action) {
  try {
    const { companyId } = action
    const response = yield api.getCompany(companyId)

    if (response.ok) {
      yield put(AppActions.getcompanySuccess(response.data))
    } else {
      yield put(AppActions.getcompanyFailure())
    }
  } catch (e) {
    yield put(AppActions.getcompanyFailure())
  }
}

export function* postuploadavatarRequest(api, action) {
  try {
    const { data, route, after } = action.payload
    const response = yield api.uploadAvatar(data)
    if (response.ok) {
      yield put(AppActions.postuploadavatarSuccess(response.data))
      if (route && route !== '') yield call(history.push, route)
      if (after) yield put({ ...after })
    } else {
      yield put(AppActions.postuploadavatarFailure())
    }
  } catch (e) {
    yield put(AppActions.postuploadavatarFailure())
  }
}

export function* posteditprofileRequest(api, action) {
  try {
    const { userId, payload } = action
    const response = yield api.postEditProfile(userId, payload)

    if (response.ok) {
      yield put(AppActions.posteditprofileSuccess(response.data))
      yield put(AppActions.getcommunityusersRequest({ userId: response.data?.community_user_id }))
    } else {
      yield put(AppActions.posteditprofileFailure())
    }
  } catch (e) {
    yield put(AppActions.posteditprofileFailure())
  }
}

export function* postcompanyusersRequest(api, action) {
  try {
    const { payload, companyId, after } = action
    const response = yield api.postCompanyUsers(payload, companyId)

    if (response.ok) {
      if (after) yield put({ ...after })
      toast.success('Successfully added a user', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(AppActions.postcompanyusersSuccess(response.data.users))
      yield put(AppActions.postmulticompanydataRequest())
      yield put(CompanyActions.getcompanyemployeesRequest(companyId))
    } else {
      toast.error('Oops, failed to add a user!', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(AppActions.postcompanyusersFailure())
    }
  } catch (e) {
    yield put(AppActions.postcompanyusersFailure())
  }
}

export function* fetchnotificationsRequest(api, action) {
  try {
    const { page } = action
    const options = page ? `?page=${page}` : ''

    const response = yield api.getNotifications(options)

    if (response.ok) {
      yield put(AppActions.fetchnotificationsSuccess(response.data))
    } else {
      yield put(AppActions.fetchnotificationsFailure())
    }
  } catch (e) {
    yield put(AppActions.fetchnotificationsFailure())
  }
}

export function* updatenotificationsRequest(api, action) {
  try {
    const { id, event, after, route } = action
    const response = yield api.updateNotifications(id, event)

    if (response.ok) {
      yield put(AppActions.fetchnotificationsRequest())
      if (after) yield put({ ...after })
      if (route) yield call(history.push, route)
      yield put(AppActions.updatenotificationsSuccess())
    } else {
      yield put(AppActions.updatenotificationsfailure())
    }
  } catch (e) {
    yield put(AppActions.updatenotificationsfailure())
  }
}

export function* postrecoverypasswordRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postRecoveryPassword(payload)

    if (response.ok) {
      toast.success('Email sent successfully', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(AppActions.postrecoverypasswordSuccess(response.data))
    } else {
      toast.error('Oops, failed to Sent the Email!', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(AppActions.postrecoverypasswordFailure())
    }
  } catch (e) {
    yield put(AppActions.postrecoverypasswordFailure())
  }
}

export function* postmulticompanydataRequest(api, action) {
  try {
    const companies = yield select(state => state.app.companies)
    const companyIds = companies.map(item => item.id)
    const response = yield api.postMultiCompanyData({ company_id: companyIds })

    if (response.ok) {
      yield put(AppActions.postmulticompanydataSuccess(response.data.companies))
    } else {
      yield put(AppActions.postmulticompanydataFailure())
    }
  } catch (e) {
    yield put(AppActions.postmulticompanydataFailure())
  }
}

export function* getallauthorsRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.getAllAuthors()

    if (response.ok) {
      const companyAuthors = filter(e => e.type === 1, response.data.authors)
      const groupAuthors = filter(e => e.type === 2, response.data.authors)
      const globalAuthors = filter(e => e.type === 3, response.data.authors)
      yield put(AppActions.getallauthorsSuccess({ globalAuthors, groupAuthors, companyAuthors }))
    } else {
      yield put(AppActions.getallauthorsFailure())
    }
  } catch (e) {
    yield put(AppActions.getallauthorsFailure())
  }
}

export function* postsaveauthorRequest(api, action) {
  try {
    const { payload, callback } = action
    const response = yield api.postSaveAuthor(payload)

    if (response.ok) {
      if (callback) yield put(CompanyActions.getbusinessRequest(callback))
      yield put(AppActions.postsaveauthorSuccess(response.data))
    } else {
      yield put(AppActions.postsaveauthorFailure())
    }
  } catch (e) {
    yield put(AppActions.postsaveauthorFailure())
  }
}

export function* postsavebusinessauthorRequest(api, action) {
  try {
    const { payload, callback } = action
    const response = yield api.postSaveBusinessAuthor(payload)

    if (response.ok) {
      if (callback) yield put(CompanyActions.getbusinessRequest(callback))
      yield put(AppActions.postsavebusinessauthorSuccess(response.data))
    } else {
      yield put(AppActions.postsavebusinessauthorFailure())
    }
  } catch (e) {
    yield put(AppActions.postsavebusinessauthorFailure())
  }
}

export function* postdeleteauthorRequest(api, action) {
  try {
    const { payload, callback } = action
    const response = yield api.postDeleteAuthor(payload)

    if (response.ok) {
      if (callback) yield put(CompanyActions.getbusinessRequest(callback))
      yield put(AppActions.postdeleteauthorSuccess(response.data))
    } else {
      yield put(AppActions.postdeleteauthorFailure())
    }
  } catch (e) {
    yield put(AppActions.postdeleteauthorFailure())
  }
}

export function* getcommunityusersRequest(api, action) {
  const { userId } = action.payload
  const response = yield api.getcommunityUser(userId)
  if (response.ok) {
    yield put(AppActions.getcommunityusersSuccess(response.data))
  } else {
    yield put(AppActions.getcommunityusersFailure())
  }
}

export function* advancedsearchRequest(api, action) {
  const { tags, mode, published } = action
  const filter = ''
  const current = 1
  const per = 25
  yield put(DevActions.librarytemplatesRequest({ filter, mode, current, per, tags, published }))
}
