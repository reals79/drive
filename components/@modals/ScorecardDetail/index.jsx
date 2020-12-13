import React, { PureComponent } from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Icon, Rating, QuotaTooltip, RatingTooltip } from '@components'
import { getUnit } from '~/services/util'
import ScorecardDetailPdf from './ScorecardDetailPdf'

class ScorecardDetail extends PureComponent {
  handlePdf = async () => {
    const { data, date } = this.props
    const pdfData = { data, date }
    const binary = await ScorecardDetailPdf(pdfData)
    const binaryUrl = URL.createObjectURL(binary)
    window.open(binaryUrl, '__blank')
  }

  render() {
    const { data } = this.props
    return (
      <div className="scorecard-detail">
        <div className="modal-header text-center bg-primary text-white">Scorecard Preview</div>
        <div className="modal-body p-4">
          <div className="d-h-between">
            <p className="dsl-b18 bold my-2">{data.title}</p>
            <Icon name="far fa-print" size={18} color="#343f4b" onClick={this.handlePdf} />
          </div>
          <div className="d-h-between py-3">
            <div className="d-flex-1">
              <p className="dsl-m12 mb-0 text-400">#</p>
            </div>
            <div className="d-flex-9">
              <p className="dsl-m12 mb-0 text-400">{`Quotas (${data.quotas.length})`}</p>
            </div>
            <div className="d-flex-3 px-3 d-none d-md-block">
              <p className="dsl-m12 text-right mb-0 text-400">Target</p>
            </div>
            <div className="d-flex-3 px-3 d-none d-md-block">
              <p className="dsl-m12 text-right mb-0 text-400">Actual</p>
            </div>
            <div className="d-flex-4 pl-3 d-sm-flex-5 d-none d-md-block">
              <p className="dsl-m12 mb-0 text-400">Scale</p>
            </div>
          </div>
          {data.quotas.map((item, index) => {
            const { quota_direction, star_values, target_types } = item.data
            return (
              <div key={item.id} className="d-flex py-3 border-top">
                <div className="d-flex flex-column flex-md-row d-flex-12">
                  <div className="d-flex d-flex-4 flex-ssm-unset">
                    <div className="d-flex-1">
                      <p className="dsl-b14 mb-0">{index + 1}</p>
                    </div>
                    <div className="d-flex-9 cursor-pointer">
                      <OverlayTrigger
                        placement="top"
                        overlay={QuotaTooltip(item.data.description, item.name)}
                        key={index}
                      >
                        <p className="dsl-b14 text-400 bold-ssm mb-0">{item.name}</p>
                      </OverlayTrigger>
                    </div>
                  </div>
                  <div className="d-flex d-flex-5 ml-4 mt-2 mt-md-0">
                    <div className="d-flex-3 px-3">
                      <p className="dsl-m12 text-right mb-0 text-400 d-block d-md-none">Target</p>
                      <p className="dsl-b14 text-right my-1 text-400">
                        {getUnit(quota_direction == 1 ? star_values[5] : star_values[0], target_types)}
                      </p>
                    </div>
                    <div className="d-flex-3 px-3">
                      <p className="dsl-m12 text-right mb-0 text-400 d-block d-md-none">Actual</p>
                      <p className="dsl-b14 text-right my-1 text-400">{getUnit(star_values[5], target_types)}</p>
                      <p className="dsl-b14 text-right my-2 text-400">{getUnit(star_values[3], target_types)}</p>
                      <p className="dsl-b14 text-right my-2 text-400">{getUnit(star_values[2], target_types)}</p>
                    </div>
                    <OverlayTrigger placement="top" overlay={RatingTooltip(item)}>
                      <div className="d-flex-4 pl-3 d-sm-flex-5">
                        <p className="dsl-m12 mb-0 text-400 d-block d-md-none">Scale</p>
                        <Rating score={5} className="mt-1" />
                        <Rating score={3} className="my-1" />
                        <Rating score={2} className="my-1" />
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

ScorecardDetail.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    quotas: PropTypes.array,
  }),
  onClose: PropTypes.func,
}

ScorecardDetail.defaultProps = {
  data: {
    title: '',
    quotas: [],
  },
  onClose: () => {},
}

export default ScorecardDetail
