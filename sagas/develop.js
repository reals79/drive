import { call, put, select } from 'redux-saga/effects'
import xmljs from 'xml-js'
import moment from 'moment'
import {
  clone,
  concat,
  drop,
  equals,
  filter,
  find,
  includes,
  is,
  isNil,
  isEmpty,
  join,
  keysIn,
  length,
  propEq,
  split,
  values,
  path,
} from 'ramda'
import { toast } from 'react-toastify'
import { history } from '~/reducers'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { convertUrl } from '~/services/util'
import { AssetsURL, QuotaCalcTypes, ToDoTypes } from '~/services/config'

export function* fetchfeedsRequest(api, action) {
  try {
    const { userId, type, perPage, page, filter, startDate, endDate, order, sort, title, other } = action.payload

    if (isNil(userId) || isNil(type)) {
      yield put(DevActions.fetchfeedsFailure())
      return
    }

    if (type === 'courses') {
      if (title === 'assignments') {
        const status = 'status[]=0&status[]=1&status[]=2&status[]=4&card_type_id=1'
        const prevDate = moment(startDate)
          .subtract(1, 'day')
          .format('YYYY-MM-DD')
        let options = `${status}&date_start=null&date_end=${prevDate}&per_page=-1&page=1`
        options = isNil(filter) ? options : `${options}&search=${filter}`
        options = isNil(order) ? `${options}&order=due_at` : `${options}&order=${order}`
        options = isNil(sort) ? options : `${options}&sort=${sort}`
        options = isNil(other) ? options : `${options}&${other}`

        const response = yield api.getLearnFeeds('training', userId, options)
        if (response.ok) {
          for (let card of response.data.data) {
            let completed = 0
            let remaining = 0
            let pastDue = 0

            for (let child of card.children) {
              card.retention_quiz = child.card_type_id === 16
              if (child.status === 3) completed++
              else if (child.status === 2) pastDue++
              else remaining++
            }

            card.data.completed = completed
            card.data.remaining = remaining
            card.data.past_due = pastDue
          }
          yield put(DevActions.fetchfeedsSuccess({ type: 'carryOvers', data: response.data }))
        }
      }

      let options = isNil(perPage) ? 'card_type_id=1&per_page=25' : `card_type_id=1&per_page=${perPage}`
      options = isNil(page) ? `${options}&page=1` : `${options}&page=${page}`
      if (!isNil(startDate)) options = `${options}&date_start=${moment(startDate).format('YYYY-MM-DD')}`
      if (!isNil(endDate)) options = `${options}&date_end=${moment(endDate).format('YYYY-MM-DD')}`
      options = isNil(filter) ? options : `${options}&search=${filter}`
      options = isNil(order) ? `${options}&order=due_at` : `${options}&order=${order}`
      options = isNil(sort) ? `${options}` : `${options}&sort=${sort}`
      options = isNil(other) ? options : `${options}&${other}`

      const response = yield api.getLearnFeeds('training', userId, options)
      if (response.ok) {
        for (let card of response.data.data) {
          let completed = 0
          let remaining = 0
          let pastDue = 0

          for (let child of card.children) {
            card.retention_quiz = child.card_type_id === 16
            if (child.status === 3) completed++
            else if (child.status === 2) pastDue++
            else remaining++
            child.data.attachments = isEmpty(child.data.attachments) ? [] : convertUrl(child.data.attachments)
          }

          card.data.completed = completed
          card.data.remaining = remaining
          card.data.past_due = pastDue
        }
        yield put(DevActions.fetchfeedsSuccess({ type, data: response.data }))
      } else {
        yield put(DevActions.fetchfeedsFailure())
      }
      return
    }

    let mode = type
    if (type === 'habitslist') mode = 'habitschedules'
    let options = isNil(perPage) ? 'per_page=25' : `per_page=${perPage}`
    options = isNil(page) ? `${options}&page=1` : `${options}&page=${page}`
    if (!isNil(startDate)) options = `${options}&date_start=${moment(startDate).format('YYYY-MM-DD')}`
    if (!isNil(endDate)) options = `${options}&date_end=${moment(endDate).format('YYYY-MM-DD')}`
    options = isNil(filter) ? options : `${options}&search=${filter}`
    options = isNil(order) ? `${options}&order=due_at` : `${options}&order=${order}`
    options = isNil(sort) ? options : `${options}&sort=${sort}`
    options = isNil(other) ? options : `${options}&${other}`

    const response = yield api.getLearnFeeds(mode, userId, options)
    if (response.ok) {
      if (type === 'tracks') {
        for (let card of response.data.data) {
          if (card.program_id) {
            const programResponse = yield api.getCareerProgram(card.program_id)
            card.program_title = (programResponse.ok && programResponse.data.program.title) || ''
          }
        }
        yield put(DevActions.fetchfeedsSuccess({ type, data: response.data }))
      }
      yield put(DevActions.fetchfeedsSuccess({ type, data: response.data }))
    } else {
      yield put(DevActions.fetchfeedsFailure())
    }
  } catch (e) {
    yield put(DevActions.fetchfeedsFailure())
  }
}

export function* dailytrainingRequest(api, action) {
  try {
    const { userId } = action.payload
    const now = moment().format('YYYY-MM-DD')

    let open = [],
      completed = []

    let options = `per_page=500&page=1&date_start=${now}&date_end=${now}`
    const openResponse = yield api.getLearnFeeds('daily', userId, options)

    if (openResponse.ok) {
      open = openResponse.data.today.map(card => {
        const completedModules = filter(
          ({ status, completed_at }) => equals(status, 3) || !isNil(completed_at),
          card.children
        )
        const pastModules = filter(({ status }) => equals(status, 2), card.children)
        return {
          ...card,
          data: {
            ...card.data,
            completed: length(completedModules),
            past_due: length(pastModules),
          },
        }
      })
    }

    options = `per_page=500&page=1&status[]=3&archived=1&completed_at_start=${now}`
    const completedRes = yield api.getLearnFeeds('training', userId, options)

    if (completedRes.ok) completed = completedRes.data.data

    yield put(DevActions.dailytrainingSuccess({ open, completed }))
  } catch (e) {
    yield put(DevActions.dailytrainingFailure())
  }
}

export function* updatecardinstanceRequest(api, action) {
  try {
    const { event, cardId, card, after, nextAfter, attachment } = action.payload
    let cardData = card

    if (!isNil(attachment) && !isNil(attachment.file)) {
      const res = yield api.getS3Info()
      if (res.ok) {
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', attachment.file.type)
        formData.append('key', `attachments/${attachment.attachment_hash}/${attachment.file.name}`)
        formData.append('file', attachment.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text
          cardData.data.attachment = url
        }
      }
    }

    const response = yield api.updateCardInstance(cardId, event, { card: cardData })
    if (response.ok) {
      toast.success('Your action was successfully completed!', {
        position: toast.POSITION.TOP_CENTER,
      })
      if (!isNil(after)) yield put({ ...after })
      if (!isNil(nextAfter)) yield put({ ...nextAfter })
      yield put(DevActions.updatecardinstanceSuccess())
    } else {
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
      })
      yield put(DevActions.updatecardinstanceFailure())
    }
  } catch (e) {
    yield put(DevActions.updatecardinstanceFailure())
  }
}

export function* postscorecardsaveRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postScorecardSave(payload)

    if (response.ok) {
      toast.success('The scorecard has been updated successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(DevActions.postscorecardsaveSuccess(response.data))
    } else {
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(DevActions.postscorecardsaveFailure())
    }
  } catch (e) {
    yield put(DevActions.postscorecardsaveFailure())
  }
}

export function* postdeletescorecardRequest(api, action) {
  try {
    const { scorecard, after } = action.payload
    const response = yield api.postDeleteScorecard({ scorecard })

    if (response.ok) {
      toast.success('The scorecards has been deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      })
      yield put(DevActions.postdeletescorecardSuccess())
      if (!isNil(after)) yield put({ ...after })
      let reviews = yield select(state => state.manage.companyPerformanceReviews)
      reviews = clone(reviews)
      reviews.users = reviews.users.map(item => {
        if (item.scorecards.length > 0) {
          item.scorecards = filter(e => !equals(scorecard.id, e.id), item.scorecards)
          return item
        }
        return item
      })
      yield put(MngActions.companyperformancereviewsSuccess(reviews))
    } else {
      yield put(DevActions.postdeletescorecardFailure())
    }
  } catch (e) {
    yield put(DevActions.postdeletescorecardFailure())
  }
}

export function* librarytemplatesRequest(api, action) {
  try {
    const { mode, current, per, publish } = action.payload // filter, mode, current, per, tags
    const search = action.payload.filter || ''
    const tags = action.payload.tags || (yield select(state => state.app.selectedTags))
    const published = isNil(publish) ? yield select(state => state.app.published) : publish
    const perPage = per || 20
    const curPage = current || 1
    const learnModules = [3, 4, 5, 7, 14, 15]

    let viewMode = mode || 'tracks'
    let type = viewMode
    let cardType = ''
    let programType = ''
    let documentType = ''
    let url = ''

    switch (viewMode) {
      case 'tracks':
        break
      case 'courses':
        break
      case 'modules':
        learnModules.forEach((item, index) => {
          if (equals(0, index)) cardType = concat(cardType, `card_type_id[]=${item}`)
          else cardType = concat(cardType, `&card_type_id[]=${item}`)
        })
        break
      case 'habits schedules':
      case 'habitslist':
        viewMode = 'habitslist'
        type = 'modules'
        cardType = 'card_type_id[]=17'
        break
      case 'habits':
        type = 'modules'
        cardType = 'card_type_id[]=8'
        break
      case 'quotas':
        type = 'quota_templates'
        break
      case 'scorecards':
        break
      case 'powerpoint':
      case 'power points':
        viewMode = 'powerpoint'
        type = 'documents'
        documentType = 'type=Power Point'
        break
      case 'word':
      case 'words':
        viewMode = 'word'
        type = 'documents'
        documentType = 'type=Word'
        break
      case 'pdf':
        type = 'documents'
        documentType = 'type=PDF'
        break
      case 'envelope':
        type = 'documents'
        documentType = 'type=Envelope'
        cardType = 'card_type_id[]=8'
        break
      case 'careers':
        type = 'programs'
        programType = 'type=1'
        break
      case 'certifications':
        type = 'programs'
        programType = 'type=2'
        break
      case 'badges':
        type = 'programs'
        programType = 'type=3'
        break
      case 'assessment':
        type = 'modules'
        cardType = 'card_type_id[]=2'
        break
      case 'survey':
        type = 'modules'
        cardType = 'card_type_id[]=6'
        break
      case 'review':
        type = 'modules'
        cardType = 'card_type_id[]=6'
        break

      default:
        break
    }

    const author_url = join(
      '&',
      tags.authors.map(id => 'author_id[]=' + id)
    )
    const category_url = join(
      '&',
      tags.categories.map(id => 'category_id[]=' + id)
    )
    const competency_url = join(
      '&',
      tags.competencies.map(id => 'competency_id[]=' + id)
    )
    const department_url = join(
      '&',
      tags.departments.map(id => 'department_id[]=' + id)
    )

    url = [author_url, category_url, competency_url, department_url]
    url = filter(item => !isEmpty(item), url)
    url = join('&', url)

    let query = [cardType, documentType, programType]
    query = filter(item => !isEmpty(item), query)
    query = join('&', query)

    let complex = [url, query]
    complex = filter(item => !isEmpty(item), complex)
    complex = join('&', complex)

    if (!isEmpty(complex)) complex = `&${complex}`
    if (!isEmpty(search)) complex = `${complex}&search=${search}`
    if (!isNil(published) && !published) complex = `${complex}&published[]=0`

    const response = yield api.getDevLibrarySearch(type, complex, perPage, curPage)

    if (response.ok) {
      let templates = {
        current_page: response.data.current_page,
        data: [],
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
      }

      if (!isNil(response.data.data)) {
        templates.data = response.data.data.map(template => {
          template.data.thumb_url = convertUrl(template.data.thumb_url)
          template.data.attachments = isEmpty(template.data.attachments) ? [] : convertUrl(template.data.attachments)
          if (viewMode === 'tracks') {
            template.thumbnail =
              template.thumbnail.includes('/[]') || template.thumbnail.includes('/attachments%2Fnull%2Fundefined')
                ? convertUrl('')
                : convertUrl(template.thumbnail)
          }
          if (!isNil(template.children)) {
            template.children.data = template.children.map(children => {
              children.data.thumb_url = convertUrl(children.data.thumb_url)
              children.data.attachments = isEmpty(children.data.attachments)
                ? []
                : convertUrl(children.data.attachments)
              return children
            })
          }
          return template
        })
      }

      const data = { templates, mode: viewMode }
      const after = yield select(state => state.app.modalData.after)
      yield put(
        AppActions.modalRequest({
          type: null,
          data: { before: { type: mode, modules: templates.data }, after },
        })
      )

      yield put(DevActions.librarytemplatesSuccess(data))
    } else {
      yield put(DevActions.librarytemplatesFailure())
    }
  } catch (e) {
    yield put(DevActions.librarytemplatesFailure())
  }
}

export function* libraryeventRequest(api, action) {
  try {
    const { libType, event, templateId, data, after } = action.payload
    const response = yield api.postDevLibraryEvent(libType, event, templateId, data)

    if (response.ok) {
      if (response.data.response === 'failure') {
        toast.error(`${event === 'delete' ? 'Deleting' : 'Saving'} the template was failed. ${response.data.message}`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        yield put(DevActions.libraryeventFailure())
      } else {
        if (!isNil(after)) yield put({ type: after.type, payload: after.payload })
        toast.success(`The template was successfully ${equals(event, 'delete') ? 'deleted' : 'saved'}.`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        yield put(DevActions.libraryeventSuccess())
      }
    } else {
      toast.error(`${equals(event, 'delete') ? 'Deleting' : 'Saving'} the template was failed.`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.libraryeventFailure())
    }
  } catch (e) {
    yield put(DevActions.libraryeventFailure())
  }
}

export function* librarytrackdetailRequest(api, action) {
  try {
    const { payload, route } = action
    const { data } = payload

    if (!isNil(data.data) && !isNil(data.data.cards)) {
      const templates = data.data.cards.map(card => card.card_template_id)
      const options = `?per_page=${length(templates)}`
      const response = yield api.postDevLibraryCardTemplates({ templates }, options)
      const result = { ...data, data: { ...data.data, _cards: response.data.data } }
      yield put(DevActions.librarytrackdetailSuccess(result))
    } else {
      yield put(DevActions.librarytrackdetailFailure())
    }

    if (!isEmpty(route) && !isNil(route)) yield call(history.push, route)
  } catch (e) {
    yield put(DevActions.librarytrackdetailFailure())
  }
}

export function* libraryprogramdetailRequest(api, action) {
  try {
    const { payload, mode, route } = action
    const program = payload

    if (isNil(program)) {
      yield put(DevActions.libraryprogramdetailSuccess(program, mode))
      return
    }

    const { levels, description } = clone(program.data)
    let templateIds = [],
      trackIds = [],
      quota_templates = []

    keysIn(levels).map(key => {
      const level = levels[key]
      const { habits, quotas, trainings } = level
      if (!isNil(habits)) {
        if (!habits.day) habits.day = []
        if (!habits.week) habits.week = []
        if (!habits.month) habits.month = []
        let habitIds = habits.day
        habitIds = concat(habitIds, habits.week)
        habitIds = concat(habitIds, habits.month)
        habitIds.map(item => templateIds.push(item.id || item))
      }
      if (!isNil(quotas)) {
        const quotaIds = quotas.map(x => x.quota_template_id)
        quota_templates = concat(quota_templates, quotaIds)
      }
      if (!isNil(trainings)) {
        trainings.items.map(item => {
          if (item.type === 'track') trackIds.push(item.item_id)
          else templateIds.push(item.item_id)
        })
      }
    })

    let tracks = []
    let options = `?per_page=${trackIds.length}`
    if (trackIds.length > 0) {
      const response1 = yield api.postDevLibraryCardTemplates({ tracks: trackIds }, options)
      tracks = response1.ok && response1.data.response !== 'error' ? response1.data.data : []
    }

    let cardTemplates = []
    if (templateIds.length > 0) {
      options = `?per_page=${templateIds.length}`
      const response2 = yield api.postDevLibraryCardTemplates({ templates: templateIds }, options)
      cardTemplates = response2.ok && response2.data.response !== 'error' ? response2.data.data : []
    }

    let quotaCards = []
    if (quota_templates.length > 0) {
      options = `?per_page=${quota_templates.length}`
      const response3 = yield api.postDevLibraryCardTemplates({ quota_templates }, options)
      quotaCards = response3.ok && response3.data.response !== 'error' ? response3.data.data : []
    }

    let newLevels = {}
    keysIn(levels).map(key => {
      const level = levels[key]
      const { habits, quotas, trainings } = level
      newLevels[key] = { ...level }
      if (!isNil(habits)) {
        const day = []
        habits.day.map(habit => {
          const item = find(propEq('id', habit.id || habit), cardTemplates)
          if (!isNil(item)) day.push(item)
        })
        const week = []
        habits.week.map(habit => {
          const item = find(propEq('id', habit.id || habit), cardTemplates)
          if (!isNil(item)) week.push(item)
        })
        const month = []
        habits.month.map(habit => {
          const item = find(propEq('id', habit.id || habit), cardTemplates)
          if (!isNil(item)) month.push(item)
        })
        newLevels[key] = { ...newLevels[key], habits: { day, week, month } }
      }
      if (!isNil(quotas)) {
        const newQuotas = []
        quotas.map(x => {
          const quota = find(propEq('id', Number(x.quota_template_id)), quotaCards)
          if (!isNil(quota)) newQuotas.push({ ...quota, ...x })
        })
        newLevels[key] = { ...newLevels[key], quotas: newQuotas }
      }
      let trainingDetails = tracks
      if (!isNil(trainings)) {
        const newTrainings = []
        trainings.items.map(item => {
          trainingDetails = item.type === 'track' ? tracks : cardTemplates
          const e = find(propEq('id', Number(item.item_id)), trainingDetails)
          if (!isNil(e)) newTrainings.push({ ...e, ...item })
        })
        newLevels[key] = { ...newLevels[key], trainings: { ...trainings, items: newTrainings } }
      }
    })

    const response = { ...program, data: { ...program.data, description, levels: newLevels } }

    yield put(DevActions.libraryprogramdetailSuccess(response, mode))
    if (route) yield call(history.push, route)
  } catch (e) {
    yield put(DevActions.libraryprogramdetailFailure())
  }
}

export function* quotatemplatesRequest(api, action) {
  try {
    const { id, mode, templateIds } = action
    const options = `?per_page=500`
    const response = yield api.postDevLibraryCardTemplates({ quota_templates: templateIds }, options)
    const quotas = response.data.data || []
    if (response.ok) {
      yield put(DevActions.quotatemplatesSuccess(id, mode, quotas))
    } else {
      yield put(DevActions.quotatemplatesFailure())
    }
  } catch (e) {
    yield put(DevActions.quotatemplatesFailure())
  }
}

export function* trainingscheduledetailRequest(api, action) {
  const schedule = action.payload
  const cards = schedule.data.cards || []
  const templates = cards.map(card => card.card_template_id)
  const options = `?per_page=${length(templates)}`

  try {
    const response = yield api.postDevLibraryCardTemplates({ templates }, options)
    if (response.ok) {
      let newCards = cards.map(card => {
        const detail = find(propEq('id', Number(card.card_template_id)), response.data.data)
        return { ...card, ...detail }
      })
      newCards = filter(x => !!x.id, newCards)

      yield put(
        DevActions.trainingscheduledetailSuccess({
          ...schedule,
          data: { ...schedule.data, cards: newCards },
        })
      )
    } else {
      yield put(
        DevActions.trainingscheduledetailFailure({
          ...schedule,
          data: { ...schedule.data, cards: [] },
        })
      )
    }
  } catch (e) {
    yield put(
      DevActions.trainingscheduledetailFailure({
        ...schedule,
        data: { ...schedule.data, cards: [] },
      })
    )
  }
}

export function* librarytemplatesaveRequest(api, action) {
  try {
    const { payload, image, video, pdf, file, mode, after, route } = action
    const viewMode = mode || 'courses'
    let hash = ''

    if (image) {
      hash = yield api.getGenerateHash()
      const _payload = { attachment_hash: hash.data, file: image }
      const res = yield api.getS3Info()

      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `attachments/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text

          if (viewMode === 'tracks') {
            payload.track.thumbnail = url
          } else {
            if (path(['template'], payload)) payload.template.data.thumb_url = url
            if (path(['assessment'], payload)) payload.assessment.data.thumb_url = url
          }
        }
      }
    }

    if (video) {
      hash = yield api.getGenerateHash()
      const _payload = { attachment_hash: hash.data, file: video }
      const res = yield api.getS3Info()

      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `attachments/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text
          payload.template.data.video_url = url
        }
      }
    }

    if (pdf) {
      hash = yield api.getGenerateHash()
      const _payload = { attachment_hash: hash.data, file: pdf }
      const res = yield api.getS3Info()

      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `attachments/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text
          payload.template.data.attachments = [url]
        }
      }
    }

    if (file) {
      hash = yield api.getGenerateHash()
      const _payload = { attachment_hash: hash.data, file }
      const res = yield api.getS3Info()
      const assetsPath = payload.template.card_type_id === 15 ? 'presentation' : 'attachments'
      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `${assetsPath}/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text
          if (payload.template.card_type_id === 15) {
            payload.template.data.presentation_url = drop(AssetsURL.length, url)
          } else {
            payload.template.data.attachments = [url]
          }
        }
      }
    }

    let type = ''
    if (viewMode === 'tracks') type = 'track'
    else if (viewMode === 'scorecards') type = 'scorecard'
    else type = 'template'

    if (viewMode === 'modules' && path(['assessment'], payload)) {
      const data = { assessment: payload.assessment }
      const response = yield api.postDevLibraryCardSave(data, 'assessments')
      if (response.ok) {
        const quizData = {
          template: {
            ...payload.data,
            data: {
              ...payload.data.data,
              thumb_url: payload.assessment.data.thumb_url,
              assessment_id: response.data.id,
            },
          },
        }

        const res = yield api.postDevLibraryCardSave(quizData, 'template')
        if (res.ok) {
          toast.success('Your quiz module was successfully saved.', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })

          if (after) yield put({ ...after })
          if (!isEmpty(route) && route) yield call(history.push, route)
          yield put(DevActions.librarytemplatesaveSuccess())
          return
        }
      }
      toast.error('Oops, Your action cannot be completed!. Please try again', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.librarytemplatesaveFailure())
      return
    }

    const response = yield api.postDevLibraryCardSave(payload, type)

    if (response.ok) {
      yield put(DevActions.librarytemplatesaveSuccess(payload))

      if (
        file &&
        (includes('.ppt', file.name) ||
          includes('.pptx', file.name) ||
          includes('.pot', file.name) ||
          includes('.potx', file.name) ||
          includes('.odp', file.name))
      ) {
        const _p = {
          file: `presentation/${hash.data}/${file.name}`,
          location: `presentation/${hash.data}`,
          card_template_id: response.data.template.id,
        }
        const _r = yield api.postPresentationSave(_p)
      }

      let message = 'Your habit template was successfully saved.'
      if (viewMode === 'habits') {
      } else if (viewMode === 'habitslist') message = 'Your habit schedule template was successfully saved.'
      else if (viewMode === 'quotas') message = 'Your quota template was successfully saved.'
      else if (viewMode === 'scorecards') message = 'Your scorecard template was successfully saved.'
      else if (viewMode === 'tracks') message = 'Your track was successfully saved.'
      else if (viewMode === 'courses') message = 'Your course was successfully saved.'
      else if (viewMode === 'modules') message = 'Your modules was successfully saved.'

      toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })

      if (after) yield put({ ...after })
      if (!isEmpty(route) && route) yield call(history.push, route)

      /**
       * This functionality would be worked for ADD COURSE functionality
       * to put newly created modules to the request to create new courses.
       */
      if (viewMode == 'courses') {
        const modalData = yield select(state => state.app.modalData)
        if (modalData && modalData.after && modalData.after.modules) {
          const modules = modalData.after.modules
          let afterData = []
          if (modules && !isEmpty(modules)) afterData = modules
          afterData = afterData.concat([response.data.template])
          yield put(
            AppActions.modalRequest({
              type: '',
              data: { before: null, after: afterData },
              callBack: null,
            })
          )
        }
      }

      if (viewMode == 'modules') {
        const modalData = yield select(state => state.app.modalData)
        if (modalData && modalData.after && modalData.after.modules) {
          const modules = modalData.after.modules
          let afterData = []
          if (modules && !isEmpty(modules)) afterData = modules
          afterData = afterData.concat([response.data.template])
          yield put(
            AppActions.modalRequest({
              type: '',
              data: { before: null, after: { modules: afterData } },
              callBack: null,
            })
          )
        }
      }

      if (viewMode === 'habits') {
        const modalData = yield select(state => state.app.modalData)
        if (modalData && modalData.after && modalData.after.habits) {
          const habits = modalData.after.habits
          let afterData = []
          if (habits && !isEmpty(habits)) afterData = habits
          afterData = afterData.concat([response.data.template])
          yield put(
            AppActions.modalRequest({
              type: '',
              data: { before: null, after: { habits: afterData } },
              callBack: null,
            })
          )
        }
      }
    } else {
      toast.error(`Editing the ${viewMode} failed. ${response.data.message}`, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.librarytemplatesaveFailure())
    }
  } catch (e) {
    yield put(DevActions.librarytemplatesaveFailure())
  }
}

export function* librarycardtemplatesRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postDevLibraryCardTemplates(payload)
    if (response.ok) {
      yield put(DevActions.librarycardtemplatesSuccess(response.data.data))
    } else {
      yield put(DevActions.librarycardtemplatesFailure())
    }
  } catch (e) {
    yield put(DevActions.librarycardtemplatesFailure())
  }
}

export function* librarysaveRequest(api, action) {
  try {
    const { payload, image, pdf } = action
    const { type, data } = payload

    if (!isNil(image) && !isEmpty(image)) {
      const _payload = { attachment_hash: null, file: image }
      const res = yield api.getS3Info()

      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `attachments/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const imageData = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(imageData).PostResponse.Location._text
          data.program.data.thumb_url = url
        }
      }
    }

    if (!isNil(pdf)) {
      const _payload = { attachment_hash: null, file: pdf }
      const res = yield api.getS3Info()

      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `attachments/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const pdfData = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(pdfData).PostResponse.Location._text
          data.program.data.attachments = [url]
        }
      }
    }

    let mode = ''
    if (type === 'careers' || type === 'certifications' || type === 'badges') mode = 'program'
    else if (type === 'habits' || type === 'habitslist') mode = 'template'
    else if (type === 'quotas') mode = 'quota_template'
    else if (type === 'scorecards') mode = 'scorecard'
    else mode = type

    const response = yield api.postDevLibraryCardSave(data, mode)
    if (response.ok) {
      if (response.data.response === 'failure') {
        toast.error(`Saving the template failed. ${response.data.message}`, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
        yield put(DevActions.librarysaveFailure())
      } else {
        yield put(DevActions.librarysaveSuccess(response.data))
        if (mode === 'program') {
          toast.success(`Your program was successfully ${data.program.id ? 'saved' : 'added'}.`, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          yield call(history.push, '/library/programs')
        }
        if (includes(type, ToDoTypes)) {
          let msg = ''
          if (type === 'habits') {
            msg = `Your habit card was successfully ${data.template.id ? 'saved' : 'added'}.`
          }
          if (type === 'habitslist') {
            msg = `Your habit schedule card was successfully ${data.template.id ? 'saved' : 'added'}.`
          }
          if (type === 'quotas') {
            msg = `Your quota card was successfully ${data.quota_template.id ? 'saved' : 'added'}.`
          }
          if (type === 'scorecards') {
            msg = `Your scorecard was successfully ${data.scorecard.id ? 'saved' : 'added'}.`
          }
          toast.success(msg, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          yield call(history.push, '/library/to-do')
        }
        if (type === 'track') {
          if (data.track.type === 3) {
            const msg = `Your training schedule was successfully ${data.track.id ? 'saved' : 'added'}.`
            toast.success(msg, {
              position: toast.POSITION.TOP_CENTER,
              pauseOnFocusLoss: false,
              hideProgressBar: true,
            })
            yield call(history.push, '/hcm/report-training-schedule')
          }
        }
      }
    } else {
      yield put(DevActions.librarysaveFailure())
      if (mode === 'program') {
        toast.error(
          `${
            data.program.id ? 'Updating' : 'Adding'
          } your program was failed. Please retry it again. If you can't add one, please contact our support.`,
          {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          }
        )
      }
      if (includes(type, ToDoTypes)) {
        let msg = ''
        if (type === 'habits') {
          msg = `${
            data.template.id ? 'Updating' : 'Adding'
          } your habit was failed. Please retry it again. If you can't add one, please contact our support.`
        }
        if (type === 'habitslist') {
          msg = `${
            data.template.id ? 'Updating' : 'Adding'
          } your habit schedule was failed. Please retry it again. If you can't add one, please contact our support.`
        }
        if (type === 'quotas') {
          msg = `${
            data.quota_template.id ? 'Updating' : 'Adding'
          } your quota was failed. Please retry it again. If you can't add one, please contact our support.`
        }
        if (type === 'scorecards') {
          msg = `${
            data.scorecard.id ? 'Updating' : 'Adding'
          } your scorecard was failed. Please retry it again. If you can't add one, please contact our support.`
        }
        toast.error(msg, {
          position: toast.POSITION.TOP_CENTER,
          pauseOnFocusLoss: false,
          hideProgressBar: true,
        })
      }
      if (type === 'track') {
        if (data.track.type === 3) {
          const msg = `${data.track.id ? 'Saving' : 'Adding'} your training schedule was failed.`
          toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
        }
      }
    }
  } catch (e) {
    yield put(DevActions.librarysaveFailure())
  }
}

export function* questionRequest(api, action) {
  try {
    const { quizId } = action
    const response = yield api.getQuizQuestion(quizId)

    if (response.ok) {
      const { data } = response
      const res = {
        num: data.current ? data.current.item : 0,
        type: data.item ? Number(data.item.type) : 0,
        options: data.item && data.item.rules ? values(data.item.rules.options) : [],
        title: data.item ? data.item.wording : '',
        completed: data.complete ? data.complete : false,
        result: data.info && data.info.result ? data.info.result.result : {},
        message: data.message,
      }
      yield put(DevActions.questionSuccess(res))
    } else {
      yield put(DevActions.questionFailure())
    }
  } catch (e) {
    yield put(DevActions.questionFailure())
  }
}

export function* answerRequest(api, action) {
  try {
    const { quizId, payload } = action
    const response = yield api.submitAnswer(quizId, payload)

    if (response.ok) {
      const res = { correct: 0, answer: '', error: false }

      if (response.data.correct) {
        res.correct = response.data.correct.correct
        res.answer = response.data.correct.answer
        yield put(DevActions.answerSuccess(res))
      } else {
        res.error = true
        yield put(DevActions.answerSuccess(res))
      }

      const { data } = response
      const nextQuestion = {
        num: data.current ? data.current.item : 0,
        type: data.item ? Number(data.item.type) : 0,
        options: data.item && data.item.rules ? values(data.item.rules.options) : [],
        title: data.item ? data.item.wording : '',
        completed: data.complete ? data.complete : false,
        result: data.info && data.info.result ? data.info.result.result : {},
        message: data.message,
      }
      yield put(DevActions.questionSuccess(nextQuestion))
      if (data.complete) yield updateLearnFeed(api)
    } else {
      yield put(DevActions.answerFailure())
    }
  } catch (e) {
    yield put(DevActions.answerFailure())
  }
}

export function* resetquizRequest(api, action) {
  try {
    const { quizId } = action
    const response = yield api.resetQuiz(quizId)
    if (response.ok) {
      if (response.data.reset) yield questionRequest(api, { quizId })
      yield put(DevActions.resetquizSuccess())
    } else {
      yield put(DevActions.resetquizFailure())
    }
  } catch (e) {
    yield put(DevActions.resetquizFailure())
  }
}

export function* createquotaRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postDevLibraryCreateQuota(payload)

    if (response.ok) {
      const modalData = yield select(state => state.app.modalData)
      if (modalData && modalData.after && modalData.after.quotas) {
        const quotas = modalData.after.quotas
        let afterData = []
        if (quotas && !isEmpty(quotas)) afterData = quotas
        afterData = afterData.concat([response.data.quota_template])
        yield put(
          AppActions.modalRequest({
            type: '',
            data: { before: null, after: { quotas: afterData } },
            callBack: null,
          })
        )
      }
      yield put(DevActions.createquotaSuccess())
    } else {
      yield put(DevActions.createquotaFailure())
    }
  } catch (e) {
    yield put(DevActions.createquotaFailure())
  }
}

export function* getquotaoptionsRequest(api, action) {
  try {
    const response = yield api.getQuotaOptions()
    if (response.ok) {
      const { calculations } = response.data
      const options = keysIn(calculations).map(key => ({
        id: QuotaCalcTypes[key].id,
        label: QuotaCalcTypes[key].label,
        value: calculations[key],
      }))
      yield put(DevActions.getquotaoptionsSuccess(options))
    }
  } catch (e) {
    yield put(DevActions.getquotaoptionsFailure())
  }
}

export function* adddocumentRequest(api, action) {
  try {
    const { payload, attachment } = action
    if (!isNil(attachment)) {
      const _payload = { attachment_hash: null, file: attachment }
      const res = yield api.getS3Info()

      if (res.ok) {
        // eslint-disable-next-line no-undef
        const formData = new FormData()
        for (const key in res.data.inputs) {
          formData.append(key, res.data.inputs[key])
        }
        formData.set('Content-Type', _payload.file.type)
        formData.append('key', `attachments/${_payload.attachment_hash}/${_payload.file.name}`)
        formData.append('file', _payload.file)
        const response = yield api.fileUpload(formData)

        if (response.ok) {
          const data = xmljs.xml2json(response.data, { compact: true, ignoreDeclaration: true })
          const url = JSON.parse(data).PostResponse.Location._text
          payload.document.data.attachment = url
        }
      }
    }

    const response = yield api.postDevLibraryAddDocument(payload)
    if (response.ok) {
      yield put(AppActions.modalRequest({ type: '', data: null, callBack: null }))
      yield put(DevActions.adddocumentSuccess())
    } else {
      yield put(DevActions.adddocumentFailure())
    }
  } catch (e) {
    yield put(DevActions.adddocumentFailure())
  }
}

export function* careergoalsRequest(api, action) {
  try {
    const { id } = action
    const response = yield api.getCareerGoals(id)

    if (response.ok) {
      yield put(DevActions.careergoalsSuccess(response.data))
    } else {
      yield put(DevActions.careergoalsFailure())
    }
  } catch (e) {
    yield put(DevActions.careergoalsFailure())
  }
}

export function* careergoalsaveRequest(api, action) {
  try {
    const { id, data } = action
    const response = yield api.postCareerGoals(id, data)

    if (response.ok) {
      yield put(DevActions.careergoalsaveSuccess(data.goals))
    } else {
      yield put(DevActions.careergoalsaveFailure())
    }
  } catch (e) {
    yield put(DevActions.careergoalsaveFailure())
  }
}

export function* careerdevreportsRequest(api, action) {
  try {
    const { companyId, userId } = action
    const response = yield api.getCareerDevReports(companyId, userId)

    if (response.ok) {
      const programs = []
      const habits = []
      const requirements = []
      const developments = []
      const jobs = []
      let current = 0
      if (response.data.status === 'error') {
        yield put(
          DevActions.careerdevreportsSuccess({
            message: response.data.message,
            programs,
            requirements,
            habits,
            developments,
            current,
            jobs,
          })
        )
      } else {
        values(response.data.job_titles).forEach((job, index) => {
          if (job.active) current = index
          if (is(Object, job.program)) {
            programs.push({
              ...job.program,
              months: job.program.data.months,
              job_status: job.active ? 'current' : job.archived ? 'completed' : 'not started',
            })
            requirements.push(values(job.program.data.achievements))
          }
          habits.push(job.habits)
          jobs.push(job.job_title)
          if (job.courses) developments.push(Object.values(job.courses))
        })
        yield put(
          DevActions.careerdevreportsSuccess({
            programs,
            requirements,
            habits,
            developments,
            current,
            jobs,
            message: '',
          })
        )
      }
    } else {
      yield put(DevActions.careerdevreportsFailure())
    }
  } catch (e) {
    yield put(DevActions.careerdevreportsFailure())
  }
}

export function* careertasksRequest(api, action) {
  try {
    const { userId, perPage, page } = action
    const response = yield api.getLearnFeed(userId, perPage, page, 8)
    if (response.ok) {
      yield put(DevActions.careertasksSuccess(response.data))
    } else {
      yield put(DevActions.careertasksFailure())
    }
  } catch (e) {
    yield put(DevActions.careertasksFailure())
  }
}

export function* careertrainingsRequest(api, action) {
  try {
    const { userId, perPage, page } = action
    const response = yield api.getLearnFeed(userId, perPage, page, 1)
    if (response.ok) {
      yield put(DevActions.careertrainingsSuccess(response.data))
    } else {
      yield put(DevActions.careertrainingsFailure())
    }
  } catch (e) {
    yield put(DevActions.careertrainingsFailure())
  }
}

export function* careerpromoteRequest(api, action) {
  try {
    // get user id
    const getUserId = state => state.app.id
    const userId = yield select(getUserId)
    // get company id
    const { companyId } = action

    const response = yield api.requestPromote(companyId, userId)
    if (response.ok) {
      if (response.data.response === 'success') {
        toast.success('Your request is successfully created.', {
          position: toast.POSITION.TOP_CENTER,
        })
        yield put(DevActions.careerpromoteSuccess(response.data.card_instance))
      } else if (response.data.response === 'exists') {
        toast.success('Your request was already created.', {
          position: toast.POSITION.TOP_CENTER,
        })
        const res = yield api.updateCardInstance(response.data.card_instance.id)
        if (res.ok) {
          yield put(DevActions.careerpromoteSuccess(res.data))
        } else {
          yield put(DevActions.careerpromoteSuccess(response.data.card_instance))
        }
      } else if (response.data.response === 'error') {
        toast.error(
          'Sorry, you have no a manager defined in your company or you are not in an active program for your company',
          {
            position: toast.POSITION.TOP_CENTER,
          }
        )
        yield put(DevActions.careerpromoteFailure())
      }
    } else {
      yield put(DevActions.careerpromoteFailure())
    }
  } catch (e) {
    yield put(DevActions.careerpromoteFailure())
  }
}

export function* careerApprovalTaskRequest(api, action) {
  try {
    // get user id
    const userId = yield select(state => state.app.id)
    // get company id
    const currentCompanyInfo = yield select(state => state.app.company_info)

    const { name, description } = action.payload

    const payload = {
      card: {
        card_template_id: null,
        card_type_id: 8,
        parent_id: null,
        data: {
          name: name,
          description: description,
          company_id: currentCompanyInfo.id,
          promote_user_id: userId,
          type: 'single',
        },
        project_id: 1,
      },
      user_id: [2],
    }

    const response = yield api.createCard(payload)

    if (response.ok) {
      if (response.data.success) yield put(DevActions.careercardSuccess(response.data.cards[0]))
      else yield put(DevActions.careercardFailure())
    } else {
      yield put(DevActions.careercardFailure())
    }
  } catch (e) {
    yield put(DevActions.careercardFailure())
  }
}

export function* adddevcommentRequest(api, action) {
  try {
    const { payload, act } = action
    const { card_instance_id } = payload.comment

    const response = yield api.addComment(payload)
    if (response.ok) {
      const res = yield api.updateCardInstance(card_instance_id)
      if (res.ok) {
        if (act === 'career-comment') yield put(DevActions.careerpromoteSuccess(res.data))
      }
      yield put(DevActions.adddevcommentSuccess())
    } else {
      yield put(DevActions.adddevcommentFailure())
    }
  } catch (e) {
    yield put(DevActions.adddevcommentFailure())
  }
}

export function* userscoursereportRequest(api, action) {
  try {
    const { userId, startDate, endDate } = action
    const response = yield api.getUsersCourseRequest(userId, startDate, endDate)

    if (response.ok) {
      response.data = response.data.map(item => {
        item.data.thumb_url = convertUrl(item.data.thumb_url)
        return item
      })
      yield put(DevActions.userscoursereportSuccess(response.data))
    } else {
      yield put(DevActions.userscoursereportFailure())
    }
  } catch (e) {
    yield put(DevActions.userscoursereportFailure())
  }
}

export function* teamreportsRequest(api, action) {
  try {
    const { id, startDate, endDate } = action
    const payload = {
      company_id: id,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).format('YYYY-MM-DD'),
    }
    const response = yield api.getTrainingReports(payload)
    if (response.ok) {
      yield put(DevActions.teamreportsSuccess(response.data))
    } else {
      yield put(DevActions.teamreportsFailure())
    }
  } catch (e) {
    yield put(DevActions.teamreportsFailure())
  }
}

export function* traininglistRequest(api, action) {
  try {
    const { payload } = action
    const { startDate, endDate, perPage, page } = payload

    let options = 'type=3'
    options = isNil(perPage) ? options : `${options}&per_page=${perPage}`
    options = isNil(page) ? options : `${options}&page=${page}`
    options = isNil(startDate) ? options : `${options}&date_range_start=${startDate}`
    options = isNil(endDate) ? options : `${options}&date_range_end=${endDate}`

    const response = yield api.getLibrarySearch('tracks', options)
    if (response.ok) {
      yield put(DevActions.traininglistSuccess(response.data))
    } else {
      yield put(DevActions.traininglistFailure())
    }
  } catch (e) {
    yield put(DevActions.traininglistFailure())
  }
}

export function* updatemoduleRequest(api, action) {
  try {
    const { payload } = action
    const request = {
      id: payload.id,
      data: { card: { card_template_id: payload.card_template_id, data: payload.data } },
    }
    const response = yield api.updateModule(request)
    if (response.ok) {
      yield put(DevActions.updatemoduleSuccess())
      const modalData = clone(yield select(state => state.app.modalData))
      modalData.before.module = response.data
      yield put(AppActions.modalRequest({ type: null, data: modalData, callBack: null }))
    } else {
      yield put(DevActions.updatemoduleFailure())
    }
  } catch (e) {
    yield put(DevActions.updatemoduleFailure())
  }
}

export function* updatecardRequest(api, action) {
  try {
    const { event, cardId, page, perPage, after } = action
    const response = yield api.updateCard(event, cardId)
    if (response.ok) {
      if (!isNil(after)) yield put({ ...after })
      yield updateLearnFeed(api)
      const userId = yield select(state => state.app.id)
      yield put(DevActions.fetchfeedsRequest({ userId, page, perPage, type: 'courses', sort: 'ASC' }))
      yield put(DevActions.updatecardSuccess())
    } else {
      yield put(DevActions.updatecardFailure())
    }
  } catch (e) {
    yield put(DevActions.updatecardFailure())
  }
}

export function* postcompanyinfoRequest(api, action) {
  try {
    const { payload, companyId } = action
    const response = yield api.postDevRecordsCompany(payload, companyId)

    if (response.ok) {
      yield put(DevActions.postcompanyinfoSuccess())
      yield put(AppActions.getcompanyRequest(companyId))
      yield put(AppActions.globalcompaniesRequest())
    } else {
      yield put(DevActions.postcompanyinfoFailure())
    }
  } catch (e) {
    yield put(DevActions.postcompanyinfoFailure())
  }
}

export function* fetchnotificationssettingsRequest(api, action) {
  const response = yield api.getDevRecordsNotificationsSettings()
  if (response.ok) {
    yield put(DevActions.fetchnotificationssettingsSuccess(response.data))
  } else {
    yield put(DevActions.fetchnotificationssettingsFailure())
  }
}

export function* updatenotificationssettingsRequest(api, action) {
  try {
    const { payload } = action
    const response = yield api.postDevRecordsNotificationsSettings(payload)
    if (response.ok) {
      yield put(DevActions.updatenotificationssettingsSuccess())
    } else {
      yield put(DevActions.updatenotificationssettingsFailure())
    }
  } catch (e) {
    yield put(DevActions.updatenotificationssettingsFailure())
  }
}

function* updateLearnFeed(api) {
  const currentModule = yield select(state => state.app.modalData.before.module)
  const cardId = currentModule.id
  const res = yield api.updateCardInstance(currentModule.parent_id)

  if (res.ok) {
    const { children } = res.data
    let completed = 0
    let remaining = 0
    let pastDue = 0
    res.data.due_at = res.data.due_at ? moment(split(' ', res.data.due_at)[0]).format('MM/DD/YYYY') : ''

    for (let child of children) {
      child.due_at = child.due_at ? moment(split(' ', child.due_at)[0]).format('MM/DD/YYYY') : ''
      child.data.video_url = convertUrl(child.data.video_url)
      child.data.thumb_url = convertUrl(child.data.thumb_url)

      if (equals(child.status, 3)) completed++
      else if (equals(child.status, 2)) pastDue++
      else remaining++

      if (equals(child.id, cardId)) {
        const modalData = yield select(state => state.app.modalData)
        yield put(
          AppActions.modalRequest({
            type: null,
            data: { ...modalData, before: { ...modalData.before, module: child } },
            callBack: null,
          })
        )
      }
    }
    const updatedCourse = {
      ...res.data,
      children,
      data: { ...res.data.data, completed, remaining, past_due: pastDue },
    }

    const currentCards = yield select(state => state.develop.templates.trainings.data)
    const updatedCards = []
    for (const card of currentCards) {
      if (card.id === updatedCourse.id) updatedCards.push(updatedCourse)
      else updatedCards.push(card)
    }

    const templates = yield select(state => state.develop.templates)
    const newTemplates = { ...templates, trainings: { ...templates.trainings, data: updatedCards } }
    yield put(DevActions.fetchlearncardsSuccess(newTemplates))

    const modalData = yield select(state => state.app.modalData)
    yield put(
      AppActions.modalRequest({
        type: null,
        data: { ...modalData, before: { ...modalData.before, course: updatedCourse } },
        callBack: null,
      })
    )
  }
}

export function* programeventRequest(api, action) {
  try {
    const { event, data, after } = action.payload
    const response = yield api.postProgramEvent(event, data)

    if (response.ok) {
      let msg = ''
      if (event === 'start') {
        msg = 'The program was successfully started'
      } else if (event === 'stop') {
        msg = 'The program was successfully stopped'
      } else if (event === 'delete') {
        if (response.data?.status === 'error') {
          toast.error('Deleting the program was failed, please try it later.', {
            position: toast.POSITION.TOP_CENTER,
            pauseOnFocusLoss: false,
            hideProgressBar: true,
          })
          yield put(DevActions.programeventFailure())
          return
        }
        msg = 'The program was successfully deleted'
      } else {
        msg = 'The program was successfully moved to next level'
      }
      if (!isNil(after) && !isEmpty(after)) yield put({ ...after })
      toast.success(msg, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.programeventSuccess(response.data))
    } else {
      toast.error('Updating the program was failed, please try it later.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.programeventFailure())
    }
  } catch (e) {
    yield put(DevActions.programeventFailure())
  }
}

export function* programpromotionRequest(api, action) {
  try {
    const { programId, route, after } = action.payload
    const response = yield api.getProgramRequestPromotion(programId)

    if (response.ok) {
      toast.success('Your request was successfully completed.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.programpromotionSuccess())
      if (!isNil(after)) yield put({ ...after })
      if (!isEmpty(route) && !isNil(route)) yield call(history.push, route)
    } else {
      toast.error('Your request was failed, please try it later.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.programpromotionFailure())
    }
  } catch (e) {
    yield put(DevActions.programpromotionFailure())
  }
}

export function* postterminateuserRequest(api, action) {
  try {
    const { payload, companyId, event } = action
    const response = yield api.postTerminateUser(payload, companyId, event)

    if (response.ok) {
      toast.success(`User has been ${event} successfully.`, {
        position: toast.POSITION.TOP_CENTER,
      })
      yield put(DevActions.postterminateuserSuccess())
      yield put(AppActions.postmulticompanydataRequest())
    } else {
      yield put(DevActions.postterminateuserFailure())
    }
  } catch (e) {
    yield put(DevActions.postterminateuserFailure())
  }
}

export function* postdeleteuserRequest(api, action) {
  try {
    const { userId, companyId } = action
    const response = yield api.postDeleteUser(userId)

    if (response.ok) {
      toast.success('User has been deleted successfully.', {
        position: toast.POSITION.TOP_CENTER,
      })
      yield put(DevActions.postdeleteuserSuccess())
      yield put(AppActions.postmulticompanydataRequest())
    } else {
      toast.error('Your request was failed, please try it later.', {
        position: toast.POSITION.TOP_CENTER,
        pauseOnFocusLoss: false,
        hideProgressBar: true,
      })
      yield put(DevActions.programpromotionFailure())
    }
  } catch (e) {
    yield put(DevActions.programpromotionFailure())
  }
}
