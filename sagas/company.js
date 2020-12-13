import { call, put, select } from 'redux-saga/effects'
import { isNil, find, propEq } from 'ramda'
import queryString from 'query-string'
import { history } from '~/reducers'
import { toast } from 'react-toastify'
import AppActions from '~/actions/app'
import CompanyActions from '~/actions/company'

export function* getbusinessRequest(api, action) {
  try {
    const { payload, route = '' } = action
    const options = queryString.stringify(payload)
    const response = yield api.getGetBusiness(options)

    if (response.ok) {
      yield put(CompanyActions.getbusinessSuccess(response.data.data))
      const business = find(propEq('id', payload.id), response.data.data)
      const token = yield select(state => state.app.token)
      if (business?.vrs?.blog?.id && token !== '') {
        yield put(CompanyActions.getbusinessblogRequest({ businessId: payload.id }))
      }
      if (route) yield call(history.push, route)
    } else {
      yield put(CompanyActions.getbusinessFailure())
    }
  } catch (e) {
    yield put(CompanyActions.getbusinessFailure())
  }
}

export function* postbusinessRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postBusinessCompany(payload)
    if (response.ok) {
      yield put(CompanyActions.postbusinessSuccess(response.data))
      const callback = { id: payload.business.id }
      yield put(CompanyActions.getbusinessRequest(callback))
    } else {
      yield put(CompanyActions.postbusinessFailure())
    }
  } catch (e) {
    yield put(CompanyActions.postbusinessFailure())
  }
}

export function* getbusinessblogRequest(api, action) {
  try {
    const { businessId, page } = action.payload
    const options = page ? `page=${page}` : ''
    const response = yield api.getBusinessBlog(businessId, options)
    if (response.ok) {
      yield put(CompanyActions.getbusinessblogSuccess({ businessId, data: response.data }))
    } else {
      yield put(CompanyActions.getbusinessblogFailure())
    }
  } catch (e) {
    yield put(CompanyActions.getbusinessblogFailure())
  }
}

export function* getbzcompanyRequest(api, action) {
  try {
    const { companyId, after, route } = action.payload
    const options = `company_id=${companyId}`
    const resBusiness = yield api.getCompanyBusiness(options)
    if (resBusiness.ok) {
      if (after) yield put({ ...after })
      if (route && route !== '') yield call(history.push, route)
      const companyData = resBusiness.data.data[0]
      yield put(CompanyActions.setbzcompanyRequest(companyData))
    } else {
      yield put(CompanyActions.getbzcompanyFailure())
    }
  } catch (e) {
    yield put(CompanyActions.getbzcompanyFailure())
  }
}

export function* savebzcompanyRequest(api, action) {
  const { payload, callback } = action

  try {
    const res = yield api.getS3Info()

    if (isNil(payload.business.id)) {
      const hash = yield api.getGenerateHash()
      payload.business.hash = hash.data
    }

    if (res.ok && payload.business.data?.profile?.avatar) {
      // eslint-disable-next-line no-undef
      const formData = new FormData()
      for (const key in res.data.inputs) {
        formData.append(key, res.data.inputs[key])
      }
      formData.set('Content-Type', payload.business.data.profile.avatar.type)
      formData.append('key', `business/${payload.business.data.hash}/${payload.business.data.profile.avatar.name}`)
      formData.append('file', payload.business.data.profile.avatar)
      const response = yield api.fileUpload(formData)

      if (response.ok) {
        const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
        const url = JSON.parse(data).PostResponse.Location._text
        payload.business.data.profile.avatar = url
      }
    }

    const saveCpRes = yield api.postBusinessCompany(payload)
    if (saveCpRes.ok) {
      yield put(CompanyActions.savebzcompanySuccess(saveCpRes.data.business))
      if (callback) yield callback(saveCpRes.data.business)
    } else {
      toast.error(`The business already exists. Visit Profile Try Again!`, {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(
        AppActions.modalRequest({
          type: '',
          data: { before: null, after: null },
          callBack: null,
        })
      )
      yield put(CompanyActions.savebzcompanyFailure())
    }
  } catch (e) {
    yield put(CompanyActions.savebzcompanyFailure())
  }
}

export function* savebusinessRequest(api, action) {
  try {
    const { data, company, route, after } = action.payload
    const response = yield api.postBusinessCompany(data)
    if (response.ok && response.data?.status !== 'error') {
      const { business } = response.data
      if (!data.business?.id) {
        const payload = { business_id: business.id, company_id: company.id }
        const res = yield api.postAddBusiness('vr', payload)
      }
      if (after) yield put({ ...after })
      if (route && route !== '') yield call(history.push, route)
      yield put(CompanyActions.savebusinessSuccess({ ...company, business: business }))
    } else {
      yield put(CompanyActions.savebusinessFailure())
    }
  } catch (e) {
    yield put(CompanyActions.savebusinessFailure())
  }
}

export function* getblogcategoriesRequest(api, action) {
  try {
    const response = yield api.getComBlogCategories()
    if (response.ok) {
      yield put(CompanyActions.getblogcategoriesSuccess(response.data.categories))
    } else {
      yield put(CompanyActions.getblogcategoriesFailure())
    }
  } catch (e) {
    yield put(CompanyActions.getblogcategoriesFailure())
  }
}

export function* gettopiccategoriesRequest(api, action) {
  try {
    const response = yield api.getComTopicCategories()
    if (response.ok) {
      yield put(CompanyActions.gettopiccategoriesSuccess(response.data.categories))
    } else {
      yield put(CompanyActions.gettopiccategoriesFailure())
    }
  } catch (e) {
    yield put(CompanyActions.gettopiccategoriesFailure())
  }
}

export function* getcompanyusersRequest(api, action) {
  try {
    const { companyId } = action.payload
    const response = yield api.getCompanyUsers(companyId)
    if (response.ok) {
      yield put(CompanyActions.getcompanyusersSuccess(response.data.employees))
    } else {
      yield put(CompanyActions.getcompanyusersFailure())
    }
  } catch (e) {
    yield put(CompanyActions.getcompanyusersFailure())
  }
}

export function* postregisterbusinessuserRequest(api, action) {
  try {
    const { payload, companyId } = action
    const response1 = yield api.postCompanyUsers(payload, companyId)
    const business = yield select(state => state.app.modalData)
    const busId = business.after.business.id
    const _payload = { business_id: busId, user_id: response1.data.users[0].id }
    const response2 = yield api.postAddUser(_payload)
    if (response1.ok && response2.ok) {
      yield put(CompanyActions.postregisterbusinessuserSuccess(response.data))
    } else {
      yield put(CompanyActions.postregisterbusinessuserFailure())
    }
  } catch (e) {
    yield put(CompanyActions.postregisterbusinessuserFailure())
  }
}

export function* postaddeditdepartmentsRequest(api, action) {
  try {
    const { companyId, payload, callback } = action
    const response = yield api.postAddEditDepartments(companyId, payload)
    if (response.ok) {
      if (callback) yield put(CompanyActions.getbusinessRequest(callback))
      yield put(CompanyActions.postaddeditdepartmentsSuccess(response.data))
    } else {
      yield put(CompanyActions.postaddeditdepartmentsFailure())
    }
  } catch (e) {
    yield put(CompanyActions.postaddeditdepartmentsFailure())
  }
}

export function* postaddeditteamsRequest(api, action) {
  try {
    const { companyId, payload } = action
    const response = yield api.postAddEditTeams(companyId, payload)
    if (response.ok) {
      yield put(CompanyActions.postaddeditteamsSuccess(response.data))
      toast.success(`Saved successfully!`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
    } else {
      yield put(CompanyActions.postaddeditteamsFailure())
    }
  } catch (e) {
    yield put(CompanyActions.postaddeditteamsFailure())
  }
}

export function* postsavejobrolesRequest(api, action) {
  try {
    const { companyId, payload } = action
    const response = yield api.postSaveJobRoles(companyId, payload)
    if (response.ok) {
      yield put(CompanyActions.postsavejobrolesSuccess(response.data))
    } else {
      yield put(CompanyActions.postsavejobrolesFailure())
    }
  } catch (e) {
    yield put(CompanyActions.postsavejobrolesFailure())
  }
}

export function* postsavehcmcompanyRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postSaveHCMCompany(payload)
    if (response.ok) {
      yield put(AppActions.globalcompaniesRequest())
      yield put(CompanyActions.postsavehcmcompanySuccess(response.data))
    } else {
      yield put(CompanyActions.postsavehcmcompanyFailure())
    }
  } catch (e) {
    yield put(CompanyActions.postsavehcmcompanyFailure())
  }
}

export function* getcompanyemployeesRequest(api, action) {
  try {
    const { companyId } = action
    const response = yield api.getCompanyEmployees(companyId)
    if (response.ok) {
      yield put(CompanyActions.getcompanyemployeesSuccess(response.data.employees))
    } else {
      yield put(CompanyActions.getcompanyemployeesFailure())
    }
  } catch (e) {
    yield put(CompanyActions.getcompanyemployeesFailure())
  }
}
