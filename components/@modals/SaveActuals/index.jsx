import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clone, concat, equals, filter, find, findLast, keys, propEq, uniqBy } from 'ramda'
import moment from 'moment'
import { Tabs, Tab } from 'react-bootstrap'
import { Avatar, DatePicker, Icon } from '@components'
import MngActions from '~/actions/manage'
import Actuals from './Actuals'
import Results from './Results'
import SaveActualsPdf from './SaveActualsPdf'
import './SaveActuals.scss'

class SaveActuals extends Component {
  constructor(props) {
    super(props)
    const now = props.date ? moment(props.date) : moment()
    const actuals = this._getActuals(now)
    this.state = { actuals, initial: clone(actuals), key: 'actuals', now }
  }

  componentDidMount() {
    this.props.getActuals(this.props.scorecards[0].user_id)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!equals(prevProps.scorecards, this.props.scorecards)) {
      const actuals = this._getActuals(this.state.now, prevProps.scorecards)
      this.setState({ actuals })
    }
  }

  _getActuals = (now, prev = null) => {
    const { scorecards } = this.props
    const actuals = {}
    const startDate = now.startOf('month').format('YYYY-MM-DD')
    const endDate = now.endOf('month').format('YYYY-MM-DD')

    scorecards.forEach((scorecard, index) => {
      scorecard.quotas.forEach((item, idx) => {
        if (prev && equals(prev[index].quotas[idx], item)) {
          actuals[item.id] = this.state.actuals[item.id]
        } else {
          if (item?.actuals && item.actuals.length > 0) {
            const actual = findLast(x => item.id == x.quota_id && moment(x.actual_at).isBetween(startDate, endDate))(
              item.actuals
            )
            actuals[item.id] = {
              ...actual,
              actual: actual ? (actual?.actual ? actual?.actual : 'N/A') : null,
              checked: !((actual && !actual.actual) || (actual && actual.actual === 'N/A')),
              changed: false,
            }
          } else {
            actuals[item?.id] = { actual: null, checked: true, changed: false }
          }
        }
      })
    })

    return actuals
  }

  handleChange = (quotas, id) => value => {
    const { actuals } = this.state
    actuals[id].actual = value
    actuals[id].changed = true
    this.setState({ actuals })
  }

  handleCheckBox = data => e => {
    const { actuals } = this.state
    actuals[data.id].checked = e.target.checked
    actuals[data.id].changed = true
    actuals[data.id].actual = actuals[data.id].checked ? null : 'N/A'
    this.setState({ actuals })
  }

  handleComment = id => comment => {
    const { now } = this.state
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
      const payload = {
        data: {
          actuals: actualsData,
          year: now.format('YYYY'),
          month: now.format('M'),
        },
        after,
        scorecards,
      }
      this.props.onSubmit(payload, callback)
    }
  }

  handleDate = e => {
    const actuals = this._getActuals(e.start)
    this.setState({ actuals, now: e.start })

    const { userId, companyId } = this.props.after
    const startDate = moment(e.start).format('YYYY-MM-DD')
    const endDate = moment(e.end).format('YYYY-MM-DD')
    this.props.fetchReviews(userId, companyId, startDate, endDate)
  }

  handlePdf = async () => {
    const { key, now, actuals } = this.state
    const { scorecards, user, type } = this.props
    const pdfData = { activeTab: key, date: now, scorecards, user, type, actuals }
    const binaryData = await SaveActualsPdf(pdfData)
    const binaryUrl = URL.createObjectURL(binaryData)
    window.open(binaryUrl, '__blank')
  }

  handleSubmit = () => {
    const { actuals, initial, now } = this.state
    const { after, scorecards, callback } = this.props

    if (!equals(actuals, initial)) {
      let _actuals = filter(e => e.changed, actuals)
      _actuals = keys(_actuals).map(key => ({
        quota_id: key,
        actual: actuals[key].checked ? actuals[key].actual : 'N/A',
      }))

      const payload = {
        data: {
          actuals: _actuals,
          year: now.format('YYYY'),
          month: now.format('M'),
        },
        after,
        scorecards,
      }

      this.props.onSubmit(payload, callback)
      this.props.onClose()
    }
  }

  render() {
    const { avatar, scorecards, userName, user, type } = this.props
    const { actuals, key, now } = this.state

    return (
      <>
        <div className="modal-header">
          <span className="dsl-w14">Save Actuals</span>
        </div>
        <div className="modal-body save-actuals-modal">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <Avatar
              className="mr-3"
              url={user?.profile.avatar}
              size="small"
              name={user.name || `${user.profile?.first_name} ${user.profile?.last_name}`}
            />
            <span className="dsl-b16 text-400">
              {user.name || `${user.profile?.first_name} ${user.profile?.last_name}`}
            </span>
          </div>
          <div className="d-flex justify-content-center">
            <span className="dsl-b14 text-400 mr-2">Performance for the month of:</span>
            <DatePicker
              calendar="month"
              align="right"
              format="MMM"
              value={{ start: moment(now).startOf('month'), end: moment(now).endOf('month') }}
              disabledDate={e => moment(e).isSameOrAfter(new Date())}
              onSelect={this.handleDate}
            />
          </div>
          <div className="d-h-end cursor-pointer">
            <Icon name="far fa-print" size={18} color="#343f4b" onClick={this.handlePdf} />
          </div>
          <Tabs className="mb-4" defaultActiveKey="actuals" activeKey={key} onSelect={e => this.setState({ key: e })}>
            <Tab eventKey="actuals" title="Actuals">
              <Actuals
                scorecards={scorecards}
                avatar={avatar}
                name={userName}
                actuals={actuals}
                onChange={this.handleChange}
                onCheck={this.handleCheckBox}
                onComment={this.handleComment}
                onSubmit={this.handleSubmit}
              />
            </Tab>
            <Tab eventKey="results" title="Results">
              <Results
                scorecards={scorecards}
                avatar={avatar}
                name={userName}
                actuals={actuals}
                type={type}
                onCheck={this.handleCheckBox}
                onComment={this.handleComment}
                onSubmit={this.handleSubmit}
              />
            </Tab>
          </Tabs>
        </div>
      </>
    )
  }
}

SaveActuals.propTypes = {
  avatar: PropTypes.string.isRequired,
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

SaveActuals.defaultProps = {
  avatar: '',
  name: '',
  scorecards: [],
  after: null,
  type: 'scorecards',
  onSubmit: () => {},
  onClose: () => {},
}

const mapDispatchToProps = dispatch => ({
  getActuals: e => dispatch(MngActions.getquotasactualsRequest(e)),
  fetchReviews: (userId, companyId, startDate, endDate) =>
    dispatch(MngActions.individualperformancereviewRequest(userId, companyId, null, startDate, endDate)),
})

export default connect(null, mapDispatchToProps)(SaveActuals)
