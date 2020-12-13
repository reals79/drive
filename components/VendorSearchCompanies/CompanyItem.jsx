import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { Avatar, Button, Rating } from '@components'
import { convertUrl } from '~/services/util'
import './VendorSearchCompanies.scss'

const CompanyItem = props => {
  const { type } = props
  const url = convertUrl(null, '/images/default_company.svg')
  const name = 'DealerSocket'
  const companyURL = 'dealersocket.com'
  const description =
    'DealerSocket company description. It should be not more than three rows for sure.'
  const recommend = 81
  const rating_count = 494
  const rating = 4.6
  const companyName = 'DealerSocket'
  const phone = '(844) 361-3473'
  return (
    <div className={`vendor-search-companies-item ${type}`}>
      {type === 'simple' ? (
        <>
          <div className="vendor-company-item-bg mb-3">
            <Avatar
              url={url}
              type="logo"
              size="small"
              className="vendor-company-logo"
              backgroundColor="white"
              borderColor="#969faa"
            />
          </div>
          <div className="vendor-company-detail">
            <p className="dsl-b14 bold mb-2">{name}</p>
            <p className="dsl-b14 mb-1">{name}</p>
            <p className="dsl-b14 truncate-three">{description}</p>
            <div className="d-h-start mb-2">
              <p className="dsl-b12 company-detail-label">Products</p>
              <p className="dsl-b14 mb-0">12</p>
            </div>
            <div className="d-h-start mb-2">
              <p className="dsl-b12 company-detail-label">Ave rating</p>
              <div className="d-h-start">
                <Rating score={4.6} />
                <p className="dsl-b14 mb-0 ml-2">4.6</p>
              </div>
            </div>
            <div className="d-h-start mb-2">
              <p className="dsl-b12 company-detail-label">% Recommended</p>
              <p className="dsl-b14 mb-0">89%</p>
            </div>
            <div className="d-h-start mb-2">
              <p className="dsl-b12 company-detail-label">Training library</p>
              <p className="dsl-b14 mb-0">117 Courses</p>
            </div>
            <div className="d-h-start mb-2">
              <p className="dsl-b12 company-detail-label">Blog</p>
              <p className="dsl-p14 mb-0 truncate-one">Best choice of having</p>
            </div>
          </div>
        </>
      ) : (
        <Row className="mx-0">
          <Col className="px-0" xs={3}>
            <Avatar url={url} type="logo" size="extraLarge" backgroundColor="white" />
          </Col>
          <Col className="px-0" xs={7}>
            <p className="dsl-b14 mb-2">{name}</p>
            <div className="d-h-start">
              <Rating score={rating} />
              <p className="dsl-b12 mb-0">{`${recommend}% Recommended  ${rating_count} Ratings`}</p>
            </div>
            <p className="dsl-b14 truncate-two mb-2">{description}</p>
          </Col>
          <Col className="px-0 d-flex flex-column justify-content-between" xs={2}>
            <div className="mb-3">
              <p className="dsl-p14 text-right mb-2">{companyName}</p>
              <p className="dsl-b14 text-right mb-2">{phone}</p>
            </div>
            <div className="d-flex flex-column align-items-end">
              <Button type="link" name="RATE IT" />
              <Button className="btn-company-contact" type="medium" name="SPECIAL QUOTE" />
            </div>
          </Col>
        </Row>
      )}
    </div>
  )
}

CompanyItem.propTypes = {
  type: PropTypes.oneOf(['simple', 'detail']),
}

CompanyItem.defaultProps = {
  type: 'simple',
}

export default memo(CompanyItem)
