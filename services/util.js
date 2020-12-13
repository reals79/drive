import {
  any,
  clone,
  descend,
  equals,
  filter,
  find,
  includes,
  isEmpty,
  isNil,
  is,
  join,
  keys,
  length as rlength,
  path,
  prop,
  propEq,
  sort,
  split,
  startsWith,
} from 'ramda'
import * as XLSX from 'xlsx'
import moment from 'moment'
import { AssetsURL } from './config'

const pkg = require('../../../../package.json')

export const version = () => {
  return pkg.version
}
export const pagination = (c, m) => {
  var currentPage = c,
    last = m,
    delta = 3,
    left = currentPage - delta,
    right = currentPage + delta + 1,
    range = [],
    rangeWithDots = [],
    l

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
}

export const validateUrl = url => {
  const regExp = /(https?:\/\/.*(\.(?:png|jpg|mp4|PNG|JPG|MP4))?)/g
  return regExp.test(url)
}

/**
 * @description Verify if string is base64 or not
 * @param url: string
 * @return true/false
 */
export const checkBase64Format = base64DataString => {
  let base64regex = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g
  return base64regex.test(base64DataString)
}

/**
 * @description Verify if its a formatted image url or not
 * @param url: URL to verify if its a valid url or not.
 * @return formattedUrl
 */
export const formattedUrl = url => {
  let findNullOrUrl = includes('[]', url) || includes('[""]', url) ? '' : url
  let validUrl = startsWith('//', findNullOrUrl) ? 'https:' + findNullOrUrl : findNullOrUrl
  if (includes('///', validUrl)) {
    const splitUrl = split('///', validUrl)
    return 'https://' + splitUrl[1]
  }
  return validUrl
}

/**
 * @param url : abbreviated image url
 * @param defaultImg : default image when url is empty
 * @return : full image url
 */
export const convertUrl = (url, defaultImg = '/images/no-image.jpg') => {
  const regex = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/
  if (isEmpty(url) || isNil(url)) {
    return defaultImg
  } else if (regex.test(url)) {
    return url
  } else if (includes('/images/', url) && /\.(svg|jpg|png)$/i.test(url)) {
    return url
  }

  return validateUrl(url) ? url : formattedUrl(`${AssetsURL}${url}`)
}

export const getImageURL = str => {
  let div = document.createElement('div')
  div.innerHTML = str
  const firstImage = div.getElementsByTagName('img')[0]
  const imgSrc = firstImage ? firstImage.src : ''
  return imgSrc
}

export const blobToBase64 = blob =>
  new Promise((resolve, reject) => {
    if (!blob) {
      resolve(null)
    } else {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = error => resolve(null)
    }
  })

export const getProductVideoLink = (productId, video) => {
  const link = `https://ds-uploads-${process.env.NODE_ENV}.s3-us-west-2.amazonaws.com/content/${productId}-${video}/Video.mp4`
  return link
}

export const removeTags = text => {
  const regex = /(<([^>]+)>)/gi
  if (text) return text.replace(regex, '')
  return text
}

export const length = e => {
  if (isNil(e) || isEmpty(e)) return 0
  return rlength(e)
}

export const percent = (some, total) => {
  if (equals('N/A', some)) return 'N/A'
  else if (equals(0, total)) return '0' + '%'
  return Math.round(((100 * some) / total).toFixed(2)) + '%'
}

export const convertAvgDays = time => {
  if (!time) return 0

  const days = parseInt(split('days', time)[0])
  const mSeconds = moment.duration(split('days', time)[1]).asSeconds()
  const avgTime = (days + moment.duration(mSeconds).asDays()).toFixed(1)

  if (avgTime < 10) return avgTime + ' days'
  else if (avgTime <= 30) return Math.round(avgTime) + ' days'
  else return '99 days'
}

export const toDuration = e => {
  const start = moment(e)
  const end = moment()
  const hours = moment.duration(end.diff(start)).asHours()
  const days = moment.duration(end.diff(start)).asDays()
  const weeks = moment.duration(end.diff(start)).asWeeks()
  const months = moment.duration(end.diff(start)).asMonths()

  if (hours < 24) {
    const _hours = Math.round(hours)
    return `${_hours} ${_hours === 1 ? 'hr' : 'hrs'}`
  } else if (days < 30) {
    const _days = Math.round(days)
    return `${_days} ${_days === 1 ? 'day' : 'days'}`
  } else if (months > 1) {
    const _months = Math.round(months)
    return `${_months} ${_months === 1 ? 'month' : 'months'}`
  }
}

export const youtubeURL = url => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
  var match = url.match(regExp)
  return match && match[7].length == 11 ? match[7] : false
}

export const getSettings = (ids, data, empty) => {
  if (isNil(ids) || isNil(data)) return empty
  let items = []
  ids.map(id => {
    const item = find(propEq('id', id), data)
    if (item) items.push(item)
  })
  items = items.map(e => e.name)
  let placeholder = join(', ', items)
  if (isEmpty(placeholder)) placeholder = empty
  return placeholder
}

/**
 *
 * @param {string} name
 * @description get initials from string
 */
export const getInitials = name => {
  if (!name) return ''
  const matches = name.match(/\b(\w)/g)
  const initials = matches.join('')
  return initials
}

/**
 * Check if that the index might be belong to the page range.
 * @param {number} index
 * @param {number} page
 * @param {number} per
 */
export const inPage = (index, page, per) => {
  return index >= (page - 1) * per && index < page * per
}

/**
 * We use this export const to initialize data
 * For instance, in Manage/Report/Career, we initialize the program using this export const.
 * @param {any} data
 */
export const initialize = e => {
  // Manager Report Career
  let program = clone(e)
  let levels = keys(program.data.levels)
  if (!program.quotas) program.quotas = []
  if (!program.habits) program.habits = []
  if (!program.trainings) program.trainings = []

  levels.forEach(level => {
    program.data.levels[level].quotas = program.library.levels[level].quotas
    program.data.levels[level].habits = clone(program.library.levels[level].habits)
    program.data.levels[level].trainings.items = program.library.levels[level].trainings
  })

  levels.forEach(level => {
    const _quotas = filter(propEq('program_level', Number(level)), program.quotas)
    const _habits = filter(propEq('program_level', Number(level)), program.habits)
    const _trainings = filter(propEq('program_level', Number(level)), program.trainings)

    const dayHabits = filter(e => equals('day', path(['data', 'schedule_interval'], e)), _habits)
    const weekHabits = filter(e => equals('week', path(['data', 'schedule_interval'], e)), _habits)
    const monthHabits = filter(e => equals('month', path(['data', 'schedule_interval'], e)), _habits)

    if (rlength(_quotas) > 0) {
      program.data.levels[level].quotas = _quotas
    }
    if (rlength(_habits) > 0) {
      program.data.levels[level].habits = { day: dayHabits, week: weekHabits, month: monthHabits }
    }
    if (rlength(_trainings) > 0) {
      program.data.levels[level].trainings.items = _trainings
    }
  })

  return program
}

export const getUnit = (e, unit) => {
  let value = Math.floor(e * 100) / 100
  value = Number(value).toLocaleString('en')
  if (unit == 'Percentage') {
    return value + ' %'
  } else if (unit == 'Integer' || unit == 'Number') {
    return value
  } else if (unit == 'Dollar') {
    return '$ ' + value
  }
}

export const isValid = e => {
  return !isEmpty(e) && !isNil(e)
}

export const removeAssign = (data, published) => {
  if (equals(0, published)) {
    const options = filter(e => !includes('Assign', e), data)
    return options
  } else {
    return data
  }
}

export const localDate = (date, formatString = 'YYYY-MM-DD') => {
  const isString = is(String)
  return isString(date)
    ? moment
        .utc(date)
        .local()
        .format(formatString)
    : moment
        .unix(date)
        .local()
        .format(formatString)
}

/**
 * @description NO OPERATION!
 * Mostly it will be used as defaultProps for export const props.
 */
export const noop = () => {}

/**
 * @param {object} quota quota object
 * @param {number} actual actual value
 */
export const quotaCalc = (quota, actual) => {
  const { star_values, quota_direction } = quota.data
  const actValue = Number(actual)

  if (star_values) {
    let star = 0
    for (let i = 0; i < star_values.length; i++) {
      const val = star_values[i]
      if (actValue === val) {
        star = i
        break
      }
      if (quota_direction === 2) {
        if (actValue >= val && i > 0) {
          const prev = star_values[i - 1]
          const diff = prev - actValue > 0 ? prev - actValue : 0
          const span = prev - val

          if (span > 0) {
            const perc = diff / span
            star = star + perc
          }
          break
        }
      } else {
        if (actValue <= val && i > 0) {
          const prev = star_values[i - 1]
          const diff = actValue - prev > 0 ? actValue - prev : 0
          const span = val - prev
          if (span > 0) {
            const perc = diff / span
            star = star + perc
          }
          break
        }
      }
      star = i
    }
    return Number(star).toFixed(2)
  }
  return 'N/A'
}

export const avatarBackgroundColor = (index = 10) => {
  const backgroundColor = [
    '#4F4487',
    '#E1C006',
    '#16AC10',
    '#6899D7',
    '#5A6978',
    '#FF9100',
    '#C3C7CC',
    '#86A9D7',
    '#376CAF',
    '#FF0000',
  ]
  return backgroundColor[String(index).substr(-1)]
}

export const removeStatus = (status, from) => {
  return filter(e => e !== status, from)
}

export const loading = (status, query = 'pending') => {
  return any(e => includes(query, e))(status)
}

export const arrangeQuota = (stars, order) => {
  if (!stars || stars.length === 0) return []
  const diff = order =>
    function(a, b) {
      if (order === 1) return a - b
      else return b - a
    }
  const data1 = sort(diff(order), stars)
  const data2 = data1.map((item, index) => ({ value: item, star: index }))
  return sort(descend(prop('star')), data2)
}

export const exportCsv = (data, key, fileName, autoWidth) => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  data.unshift(key)
  if (autoWidth) {
    const arr = jsonToArray(key, data)
    columnWidth(ws, arr)
  }
  const opts = (XLSX.WritingOptions = {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
    Props: { Author: ' ' },
  })
  XLSX.utils.book_append_sheet(wb, ws, fileName)
  XLSX.writeFile(wb, fileName + '.xlsx', opts)
}

export const exportMultipleCsv = (data, key, sheetName, fileName) => {
  const totalSheet = data.length
  const wb = XLSX.utils.book_new()
  const opts = (XLSX.WritingOptions = {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
    Props: { Author: ' ' },
  })
  for (let i = 0; i < totalSheet; i++) {
    const ws = XLSX.utils.json_to_sheet(data[i])
    data[i].unshift(key)
    const arr = jsonToArray(key, data[i])
    columnWidth(ws, arr)
    XLSX.utils.book_append_sheet(wb, ws, sheetName[i])
  }
  XLSX.writeFile(wb, fileName + '.xlsx', opts)
}

const jsonToArray = (key, jsonData) => {
  return jsonData.map(v =>
    key.map(j => {
      return v[j]
    })
  )
}

const columnWidth = (ws, data) => {
  const colWidth = data.map(row =>
    row.map(val => {
      if (val == null) {
        return { wch: 10 }
      } else {
        return { wch: val.toString().length }
      }
    })
  )
  let result = colWidth[0]
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch']
      }
    }
  }
  ws['!cols'] = result
}

export const formatPhoneNumber = pNum => {
  const x = pNum.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
  return !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`
}

export const getValidPhoneNumber = num => {
  return num.replace(/\D/g, '')
}

export const urlify = text => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  return text.replace(urlRegex, function(url) {
    return '<a target="_blank" href="' + url + '">' + url + '</a>'
  })
}
