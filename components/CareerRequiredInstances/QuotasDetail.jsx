import React from 'react'
import PropTypes from 'prop-types'
import { isNil, values } from 'ramda'
import { CheckIcon, Pagination } from '@components'
import { QuotaCalcTypes, QuotaRequirement } from '~/services/config'
import { getUnit, inPage } from '~/services/util'
import './CareerRequiredInstances.scss'

const quotaCalcTypes = values(QuotaCalcTypes)

class QuotasDetail extends React.PureComponent {
  state = { current: 1, per: 5 }

  handlePagination = e => {
    this.setState({ current: e })
  }

  handlePer = e => {
    this.setState({ per: e })
  }

  render() {
    const { current, per } = this.state
    const { data, type } = this.props

    return (
      <div className="career-required-instances">
        <div className="quotas">
          <div className="list pt-0">
            <div className="d-flex-7">
              <span className="dsl-m12">Achievement</span>
            </div>
            <div className="d-flex-5 px-0">
              <p className="dsl-d12">Calculation</p>
            </div>
            <div className="d-flex-2 text-right mr-5 px-0">
              <p className="dsl-d12">Months</p>
            </div>
            <div className="d-flex-3 px-0">
              <p className="dsl-d12">Requirement</p>
            </div>
            <div className="d-flex-2 text-right mr-2 px-0">
              <p className="dsl-d12">Target</p>
            </div>
          </div>
          {data.map((item, index) => {
            const quotaCalculation = type === 'instance' ? item.data.quota_calculation : item.quota_calculation
            const spanMonths = type === 'instance' ? item.data.span_months : item.span_months
            const quotaRequirement = type === 'instance' ? item.data.quota_direction : item.quota_direction
            const quotaTarget = type === 'instance' ? item.data.quota_target : item.quota_target
            return (
              inPage(index, current, per) && (
                <div className="list" key={`qt-${index}`}>
                  <div className="d-h-start d-flex-7">
                    <CheckIcon className="my-auto" size={26} checked={!isNil(item.completed_at)} />
                    <div className="ml-4">
                      <p className="dsl-b14 text-400 mb-1">{item.name || item.data.name}</p>
                    </div>
                  </div>
                  <div className="d-flex-5 px-0 align-self-center">
                    <p className="dsl-b14 mb-1">
                      {quotaCalcTypes[quotaCalculation]
                        ? quotaCalcTypes[quotaCalculation].label
                        : quotaCalcTypes[0].label}
                    </p>
                  </div>
                  <div className="d-flex-2 px-0 mr-5 text-right align-self-center">
                    {quotaCalculation === 3 && <p className="dsl-b14 mb-1">{spanMonths}</p>}
                  </div>
                  <div className="d-flex-3 px-0 align-self-center">
                    <p className="dsl-b14 mb-1">
                      {QuotaRequirement[quotaRequirement - 1]
                        ? QuotaRequirement[quotaRequirement - 1].name
                        : QuotaRequirement[0].name}
                    </p>
                  </div>
                  <div className="d-flex-2 px-0 mr-2 text-right align-self-center">
                    <p className="dsl-b14 mb-1">{getUnit(quotaTarget, item.data.target_types)}</p>
                  </div>
                </div>
              )
            )
          })}
        </div>
        <Pagination
          current={current}
          per={per}
          pers={[5, 10, 'all']}
          total={Math.ceil(data.length / per)}
          onChange={this.handlePagination}
          onPer={this.handlePer}
        />
      </div>
    )
  }
}

QuotasDetail.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['instance', 'template']),
}

QuotasDetail.defaultProps = {
  data: [],
  type: 'instance',
}

export default QuotasDetail
