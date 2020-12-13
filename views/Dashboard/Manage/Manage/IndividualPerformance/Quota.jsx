import React from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import moment from 'moment'
import { findLast, isNil } from 'ramda'
import { Animations, CheckBox, EditDropdown, Icon, Rating, QuotaTooltip, RatingTooltip } from '@components'
import { QuotaCalcs } from '~/services/config'
import { arrangeQuota, getUnit } from '~/services/util'
import './IndividualPerformance.scss'

function calcDetail(quota, now) {
  const { quota_calculation } = quota.data
  const startDate = moment(now.start)
    .startOf('month')
    .format('YYYY-MM-DD')
  const endDate = moment(now.end)
    .endOf('month')
    .format('YYYY-MM-DD')
  const actual = findLast(x => moment(x.actual_at).isBetween(startDate, endDate))(quota.actuals)
  let calculation = null
  if (quota_calculation == QuotaCalcs.MONTH || quota_calculation == QuotaCalcs.QUARTER) {
    if (isNil(quota.calculation.months) || isNil(actual)) {
      calculation = null
    } else {
      calculation = quota.calculation.months[actual.actual_at]
    }
  } else if (quota_calculation === QuotaCalcs.TOTAL) {
    calculation = isNil(quota.calculation.total) ? null : quota.calculation.total
  }

  const actualValue = actual ? actual.actual : 0
  const data = actual ? actual.data : null
  const starRating = calculation ? calculation.star_rating : 0
  return { starRating, actualValue, data, incomplete: isNil(actual) }
}

function Header(props) {
  const { title, editable = false } = props
  return (
    <div className="d-flex align-items-center border-bottom pt-3 pb-2">
      <div className="include">
        <span className="dsl-m12">Include</span>
      </div>
      <div className="d-flex-5">
        <span className="dsl-m12">{title}</span>
      </div>
      <div className="d-flex-2 text-right">
        <span className="dsl-m12">Target</span>
      </div>
      <div className="d-flex-2 text-right">
        <span className="dsl-m12">Actual</span>
      </div>
      <div className="d-flex-4 ml-3">
        <span className="dsl-m12">Rating</span>
      </div>
      <div className="d-flex-1">
        <span className="dsl-m12">Comments</span>
      </div>
      {editable && <div className="d-flex-2"></div>}
    </div>
  )
}

class List extends React.PureComponent {
  state = { visible: -1 }

  handleMouseOver = idx => () => {
    this.setState({ visible: idx })
  }

  handleClose = () => {
    this.setState({ visible: -1 })
  }

  render() {
    const { editable = false, quotas, now, limit = 6, onModal = () => {} } = this.props
    const { visible } = this.state
    if (quotas.length === 0) return null

    return (
      <>
        {quotas.map((quota, index) => {
          const { starRating, actualValue, data, incomplete } = calcDetail(quota, now)
          if (limit < 3 && isNil(actualValue)) return null
          if (starRating < limit) {
            const stars = arrangeQuota(quota.data.star_values, quota.data.quota_direction)
            return (
              <div className="d-flex align-items-center border-bottom cursor-pointer py-3" key={`q${index}`}>
                <div className="include">
                  <CheckBox className="ml-auto" size="tiny" id={quota.id} checked={actualValue !== null} />
                </div>
                <div className="d-flex-5">
                  <OverlayTrigger placement="top" overlay={QuotaTooltip(quota.data.description, quota.name)}>
                    <span className="dsl-b14">{quota.name}</span>
                  </OverlayTrigger>
                </div>
                <div className="d-flex-2 text-right">
                  <span className="dsl-b14">{getUnit(stars[0].value, quota.data.target_types)}</span>
                </div>
                <div className="d-flex-2 text-right">
                  <div className="dsl-b14 cursor-pointer" onClick={() => onModal(quota)}>
                    {isNil(actualValue) ? 'NA' : getUnit(actualValue, quota.data.target_types)}
                  </div>
                </div>
                <OverlayTrigger placement="top" overlay={RatingTooltip(quota)}>
                  <div className="d-flex-4 d-flex justify-content-start ml-3">
                    {incomplete ? (
                      <span className="dsl-b14">Incomplete</span>
                    ) : (
                      <>{actualValue ? <Rating score={starRating} /> : <span className="dsl-b14">NA</span>}</>
                    )}
                  </div>
                </OverlayTrigger>
                <div className="d-flex-1 position-relative">
                  <Icon
                    active={!isNil(data)}
                    name="fas fa-comment"
                    size={14}
                    colors={['#376caf', '#969faa']}
                    onMouseEnter={this.handleMouseOver(index)}
                    onMouseLeave={() => this.setState({ visible: -1 })}
                  />
                  <Animations.Popup
                    className="comment-popup"
                    enter={10}
                    exit={0}
                    opened={!isNil(data) && visible == index}
                  >
                    <div className="close">
                      <Icon name="fal fa-times cursor-pointer" color="#676767" size={16} onClick={this.handleClose} />
                    </div>
                    {data &&
                      data.comments.map((item, index) => (
                        <div key={`h${index}`}>
                          <p className="dsl-m12 mb-1">By {item.name}</p>
                          <p className="dsl-b14 mt-2 mb-0">{item.comment}</p>
                        </div>
                      ))}
                  </Animations.Popup>
                </div>
                {editable && (
                  <div className="d-flex-1">
                    <EditDropdown options={['Edit']} onChange={e => onModal(e)} />
                  </div>
                )}
              </div>
            )
          }
          return null
        })}
      </>
    )
  }
}

function Total(props) {
  const { quotas, now, limit = 6 } = props
  let quotaLength = 0

  let totalRating = 0
  quotas.forEach(quota => {
    const { starRating, actualValue } = calcDetail(quota, now)
    if (actualValue && !isNil(starRating) && starRating < limit) {
      totalRating += starRating
      quotaLength += 1
    }
  })

  return (
    <div className="d-flex align-items-center justify-content-end mt-4">
      <div className="include" />
      <div className="d-flex d-flex-7 justify-content-end">
        <span className="dsl-b14 bold">Monthly rating:</span>
      </div>
      <div className="d-flex align-items-center d-flex-4 ml-3">
        <Rating score={quotaLength === 0 ? 0 : (totalRating / quotaLength).toFixed(1)} />
        <span className="dsl-b14 ml-4 mr-3">({quotaLength === 0 ? 0 : (totalRating / quotaLength).toFixed(2)})</span>
      </div>
    </div>
  )
}

export { Header, List, Total }
