import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { clone, concat, equals, filter, find, findLast, keys, propEq, uniqBy } from 'ramda'
import moment from 'moment'
import { Avatar, Button, Dropdown, Icon, Rating } from '@components'
import { MonthNames } from '~/services/config'
import { avatarBackgroundColor, quotaCalc } from '~/services/util'
import Quota from './Quota'
import InputActualsPdf from './InputActualsPdf'
import './InputActuals.scss'

class InputActuals extends Component {
  constructor(props) {
    super(props)
    const now = props.date ? moment(props.date) : moment()
    const year = now.year()
    const month = now.month() + 1

    const Months = [...Array(12).keys()].map(key => ({ id: key + 1, value: MonthNames[key] }))
    const months = filter(e => e.id <= month, Months)
    const actuals = this._getActuals(year, month)
    const monthly = this._getMonthlyRating(actuals)

    this.state = { actuals, initial: clone(actuals), monthly, year, month, months }
  }

  componentDidUpdate(prevProps, prevState) {
    const { year, month } = this.state
    if (!equals(prevProps.scorecards, this.props.scorecards)) {
      const actuals = this._getActuals(year, month, prevProps.scorecards)
      this.setState({ actuals })
    }
  }

  _getActuals = (year, month, prev = null) => {
    const { scorecards } = this.props
    const actuals = {}
    const limit = `${year}-${month}-1`
    const startDate = moment(limit, 'YYYY-M-D')
      .startOf('month')
      .format('YYYY-MM-DD')
    const endDate = moment(limit, 'YYYY-M-D')
      .endOf('month')
      .format('YYYY-MM-DD')

    scorecards.forEach((scorecard, index) => {
      scorecard.quotas.forEach((item, idx) => {
        if (prev && equals(prev[index].quotas[idx], item)) {
          actuals[item.id] = this.state.actuals[item.id]
        } else {
          if (item.actuals && item.actuals.length > 0) {
            const actual = findLast(x => item.id == x.quota_id && moment(x.actual_at).isBetween(startDate, endDate))(
              item.actuals
            )
            actuals[item.id] = {
              ...actual,
              checked: !((actual && !actual.actual) || (actual && actual.actual === 'N/A')),
              changed: false,
            }
          } else {
            actuals[item.id] = { checked: true, changed: false }
          }
        }
      })
    })

    return actuals
  }

  _getMonthlyRating = actuals => {
    let monthly = 0
    let counts = 0
    this.props.scorecards.map(scorecard => {
      scorecard.quotas.map(item => {
        const { actual } = actuals[item.id]
        if (actual) {
          const rating = quotaCalc(item, actual)
          monthly += Number(rating)
          counts += 1
        }
      })
    })
    monthly = counts > 0 ? (monthly / counts).toFixed(2) : 0
    return monthly
  }

  handleChange = (quotas, id) => value => {
    const { actuals } = this.state
    actuals[id].actual = value
    actuals[id].changed = true
    const monthly = this._getMonthlyRating(actuals)
    this.setState({ actuals, monthly })
  }

  handleCheckBox = data => e => {
    const { actuals } = this.state
    actuals[data.id].checked = e.target.checked
    actuals[data.id].changed = true
    const monthly = this._getMonthlyRating(actuals)
    this.setState({ actuals, monthly })
  }

  handleComment = id => comment => {
    const { month, year } = this.state
    const { after, scorecards, callback } = this.props
    let { actuals } = this.state
    let quotas = []
    actuals[id].changed = true
    scorecards.map(scorecard => {
      quotas = concat(quotas, scorecard.quotas)
    })
    quotas = uniqBy(x => x.id, quotas)
    actuals = filter(e => e.changed, actuals)

    let actualsData = quotas.map(x => {
      if (actuals[x.id] && actuals[x.id].actual && actuals[id].changed) {
        if (x.id === id) {
          return { quota_id: id, actual: actuals[id].checked ? actuals[id].actual : 'N/A', comment }
        }
        return { quota_id: x.id, actual: actuals[x.id].checked ? actuals[x.id].actual : 'N/A' }
      }
      return null
    })
    actualsData = filter(x => !!x, actualsData)
    if (!find(propEq('quota_id', id), actualsData)) {
      actualsData.push({ quota_id: id, actual: null, comment })
    }

    if (actualsData.length > 0) {
      const payload = { data: { actuals: actualsData, year, month }, after, scorecards }
      this.props.onSubmit(payload, callback)
    }
  }

  handleMonth = e => {
    this.handleSync(this.state.year, e[0])
    this.setState({ month: e[0] })
  }

  handleSync = (year, month) => {
    const actuals = this._getActuals(year, month)
    const monthly = this._getMonthlyRating(actuals)
    this.setState({ actuals, monthly })
  }

  handleSubmit = () => {
    const { actuals, initial, month, year } = this.state
    const { after, scorecards, callback } = this.props

    if (!equals(actuals, initial)) {
      let _actuals = filter(e => e.changed, actuals)
      _actuals = keys(_actuals).map(key => ({
        quota_id: key,
        actual: actuals[key].checked ? actuals[key].actual : 'N/A',
      }))

      const payload = { data: { actuals: _actuals, year, month }, after, scorecards }

      this.props.onSubmit(payload, callback)
      this.props.onClose()
    }
  }

  handlePDF = async () => {
    const { date, scorecards, user, selected } = this.props
    const { actuals } = this.state
    const pdfData = { scorecards, date, user, selected, actuals }
    const binary = await InputActualsPdf(pdfData)
    const binaryUrl = URL.createObjectURL(binary)
    window.open(binaryUrl, '__blank')
  }

  render() {
    const { avatar, scorecards, userId, userName, user, selected, type } = this.props
    const { actuals, month, months, monthly } = this.state
    const isProgram = type === 'programs'

    return (
      <div className="input-actuals-modal modal-content">
        <div className="modal-header text-center bg-primary">
          <span className="dsl-w14">
            Save actuals for {user.name || `${user.profile?.first_name} ${user.profile?.last_name}`}
          </span>
        </div>
        <div className="modal-body">
          <div className="date-area">
            <Avatar
              className="mr-3"
              size="tiny"
              url={user.profile?.avatar}
              type="initial"
              name={`${user.profile.first_name} ${user.profile.last_name}`}
              backgroundColor={avatarBackgroundColor(user.id)}
            />
            <span className="dsl-b14 text-400">
              {isProgram ? 'Program quota For the month of:' : 'Performance for the month of:'}
            </span>
            <Dropdown
              width="fit-content"
              align="right"
              placeholder="Select"
              defaultIds={[month]}
              data={months}
              onChange={this.handleMonth}
            />
          </div>
          <div className="w-100 d-h-between">
            <p className="dsl-b18 bold my-2">{scorecards[0]?.title}</p>
            <Icon name="far fa-print mr-3 mr-md-0" size={18} color="#343f4b" onClick={this.handlePDF} />
          </div>
          <div className="d-flex w-100 py-2 border-bottom">
            <div className="quota-check">
              <span className="dsl-m12 text-400">Include</span>
            </div>
            <div className="d-flex-5 ml-2">
              <span className="dsl-m12 text-400">Quotas</span>
            </div>
            <div className="d-flex-1 text-right d-none d-md-block">
              <span className="dsl-m12 text-400">Target</span>
            </div>
            <div className="d-flex-2 text-center d-none d-md-block">
              <span className="dsl-m12 text-400">Actual</span>
            </div>
            {!isProgram && (
              <div className="d-flex-4 d-none d-md-block">
                <span className="dsl-m12 mr-3 text-400">Rating</span>
              </div>
            )}
            <div className="mr-3 d-none d-md-block">
              <span className="dsl-m12 text-400">Comments</span>
            </div>
          </div>
          <div className="quota-list w-100">
            {scorecards.map(scorecard =>
              scorecard.quotas.map(
                item =>
                  (selected ? selected == item.id : true) && (
                    <Quota
                      key={item.id}
                      avatar={avatar}
                      name={userName}
                      userId={userId}
                      data={item}
                      value={actuals[item.id]}
                      isProgram={isProgram}
                      onChange={this.handleChange(scorecard.quotas, item.id)}
                      onCheck={this.handleCheckBox(item)}
                      onComment={this.handleComment(item.id)}
                    />
                  )
              )
            )}
          </div>
          {!isProgram && (
            <div className="d-flex align-items-center ml-auto mt-3 mr-5">
              <span className="dsl-b14 bold">Monthly rating:</span>
              <Rating className="ml-3 mr-4" score={monthly} />
              <span className="dsl-b14 ml-3 text-400">({monthly})</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <Button clasName="core-button high size-small m-0 btn-primary" name="SAVE" onClick={this.handleSubmit} />
        </div>
      </div>
    )
  }
}

InputActuals.propTypes = {
  avatar: PropTypes.string.isRequired,
  userId: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.oneOf([null, 'scorecards', 'programs']).isRequired,
  scorecards: PropTypes.array,
  after: PropTypes.shape({
    type: PropTypes.string,
    payload: PropTypes.any,
  }),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

InputActuals.defaultProps = {
  avatar: '',
  userId: 0,
  name: '',
  scorecards: [],
  after: null,
  type: 'scorecards',
  onSubmit: () => {},
  onClose: () => {},
}

export default InputActuals
